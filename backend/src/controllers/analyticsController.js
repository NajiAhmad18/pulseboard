const Report = require('../models/Report');
const sendResponse = require('../utils/responseHandler');

const getDashboardAnalytics = async (req, res, next) => {
  try {
    // 1. Total reports submitted this week & Pending reports
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentReports = await Report.find({ weekStartDate: { $gte: oneWeekAgo } }).populate('projectId');
    
    const submittedThisWeek = recentReports.filter(r => r.status === 'submitted').length;
    const pendingThisWeek = recentReports.filter(r => r.status === 'draft').length;

    // 2. Submission compliance rate (based on recent week)
    const totalRecent = recentReports.length;
    const complianceRate = totalRecent > 0 ? Math.round((submittedThisWeek / totalRecent) * 100) : 0;

    // 3. Open blockers across the team (count reports that have blockers text)
    const allReports = await Report.find().populate('projectId');
    const openBlockers = allReports.filter(r => r.status === 'draft' && r.blockers && r.blockers.trim().length > 0).length;

    // 4. Project/report distribution (Chart Data)
    const projectStats = await Report.aggregate([
      { $group: { _id: "$projectId", count: { $sum: 1 }, totalHours: { $sum: "$hoursWorked" } } },
      { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
      { $unwind: "$project" },
      { $project: { name: "$project.name", value: "$count", hours: "$totalHours" } }
    ]);

    // 5. Submission status by team member (Chart Data)
    const memberStats = await Report.aggregate([
      { $group: { 
          _id: { userId: "$userId", status: "$status" }, 
          count: { $sum: 1 } 
      } },
      { $lookup: { from: 'users', localField: '_id.userId', foreignField: '_id', as: 'user' } },
      { $unwind: "$user" },
      { $project: { name: "$user.name", status: "$_id.status", count: "$count" } }
    ]);

    // Format member stats for stacked bar chart
    const memberChartData = {};
    memberStats.forEach(stat => {
      if (!memberChartData[stat.name]) {
        memberChartData[stat.name] = { name: stat.name, submitted: 0, draft: 0 };
      }
      memberChartData[stat.name][stat.status] = stat.count;
    });

    // 6. Recent activity feed (last 5 actions)
    const recentActivity = await Report.find()
      .populate('userId', 'name')
      .populate('projectId', 'name')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    sendResponse(res, 200, 'Analytics retrieved', {
      metrics: {
        submittedThisWeek,
        complianceRate,
        openBlockers,
        pendingThisWeek,
      },
      charts: {
        projectDistribution: projectStats,
        memberSubmissions: Object.values(memberChartData),
      },
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
};
