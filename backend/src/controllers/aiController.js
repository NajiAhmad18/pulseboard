const { GoogleGenerativeAI } = require('@google/generative-ai');
const Report = require('../models/Report');
const sendResponse = require('../utils/responseHandler');
const AppError = require('../utils/AppError');

// Initialize Gemini (Requires GEMINI_API_KEY in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_prevent_crash');

const askAi = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) throw new AppError('Prompt is required', 400);

    if (!process.env.GEMINI_API_KEY) {
      return sendResponse(res, 200, 'AI response', {
        answer: 'Gemini AI is not configured. Please add GEMINI_API_KEY to the backend .env file. Once added, the AI will analyze the reports.'
      });
    }
    console.log("DEBUG KEY LENGTH:", process.env.GEMINI_API_KEY.length);
    console.log("DEBUG KEY STARTS:", process.env.GEMINI_API_KEY.substring(0, 10));


    // Fetch all submitted reports for context
    const reports = await Report.find({ status: 'submitted' })
      .populate('userId', 'name')
      .populate('projectId', 'name')
      .lean();

    // Simplify data to save tokens
    const contextData = reports.map(r => ({
      member: r.userId?.name,
      project: r.projectId?.name,
      week: r.weekStartDate,
      completed: r.tasksCompleted,
      blockers: r.blockers,
      hours: r.hoursWorked
    }));

    const systemPrompt = `You are an AI assistant for a manager analyzing weekly team reports. 
Here is the JSON data of recent submitted reports:
${JSON.stringify(contextData)}

User question: ${prompt}

Analyze the data and answer the question concisely and professionally. Focus on summarizing work, identifying blockers, or noting workload imbalances if asked.
*Note for privacy: Do not output sensitive personal data outside of work context.*`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    sendResponse(res, 200, 'AI response generated', { answer: responseText });
  } catch (error) {
    console.error('AI Error:', error);
    next(new AppError('Failed to generate AI response. Make sure your API key is valid.', 500));
  }
};

module.exports = {
  askAi,
};
