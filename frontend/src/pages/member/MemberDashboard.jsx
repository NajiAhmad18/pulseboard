import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PageHeader } from '../../components/common/PageHeader';
import { SkeletonCard } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { AuthContext } from '../../context/AuthContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function MemberDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports');
        setReports(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const submittedCount = reports.filter(r => r.status === 'submitted').length;
  const draftCount = reports.filter(r => r.status === 'draft').length;

  return (
    <div className="space-y-6 page-enter">
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'}`}
        description={
          <>
            <span className="block">Welcome back to PulseBoard.</span>
            <span className="block mt-1 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
              Weekly Reports. Team Insights.
            </span>
          </>
        }
      >
        <Link to="/member/reports/new">
          <Button size="sm"><Plus className="h-4 w-4" /> New Report</Button>
        </Link>
      </PageHeader>

      {/* Metric cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{reports.length}</div>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{submittedCount}</div>
              <p className="text-xs text-gray-400 mt-1">Finalized</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Drafts</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{draftCount}</div>
              <p className="text-xs text-gray-400 mt-1">In progress</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Recent Reports</h2>
          <Link to="/member/reports" className="text-xs font-medium text-accent-600 hover:text-accent-500">
            View all →
          </Link>
        </div>
        <Card>
          <div className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-40" />
                    <div className="skeleton h-3 w-28" />
                  </div>
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
              ))
            ) : reports.length === 0 ? (
              <div className="px-5 py-12">
                <EmptyState
                  title="No reports yet"
                  description="Create your first weekly report to start tracking progress."
                  actionText="Create Report"
                  onAction={() => window.location.href = '/member/reports/new'}
                />
              </div>
            ) : (
              reports.slice(0, 5).map(report => (
                <div key={report._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <Link to={`/member/reports/${report._id}`} className="text-sm font-medium text-gray-900 hover:text-accent-600 transition-colors">
                      Week of {new Date(report.weekStartDate).toLocaleDateString()}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{report.projectId?.name || 'No project'}</p>
                  </div>
                  <Badge variant={report.status === 'submitted' ? 'success' : 'warning'}>
                    {report.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
