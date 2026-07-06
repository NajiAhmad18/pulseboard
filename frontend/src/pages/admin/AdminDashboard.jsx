import React, { useEffect, useState, useContext } from 'react';
import { Users, FileText, CheckCircle, Clock, AlertTriangle, Send, Copy, Trash2, Sparkles, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { PageHeader } from '../../components/common/PageHeader';
import { SkeletonCard, Skeleton } from '../../components/common/Skeleton';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ExportModal } from '../../components/export/ExportModal';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CHART_COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-gray-500">
          <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-medium text-gray-700">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const SUGGESTED_PROMPTS = [
  'Who submitted this week?',
  'Any common blockers?',
  'Summarize team progress',
];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // AI Chat State
  const [messages, setMessages] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statRes, userRes, projRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/users'),
          api.get('/projects')
        ]);
        setAnalytics(statRes.data.data);
        const users = userRes.data.data;
        setAllUsers(users);
        setUsersCount(users.filter(u => u.role === 'member').length);
        setAllProjects(projRes.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAskAi = async (e) => {
    e.preventDefault();
    const prompt = aiPrompt.trim();
    if (!prompt) return;
    
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setAiPrompt('');
    setAiLoading(true);
    
    try {
      const res = await api.post('/ai/ask', { prompt });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: error.response?.data?.message || 'Failed to get response. Please try again.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleClearChat = () => {
    setMessages([]);
    setAiPrompt('');
  };

  const handleSuggestedPrompt = (prompt) => {
    setAiPrompt(prompt);
  };

  if (loading) {
    return (
      <div className="space-y-6 page-enter">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">Failed to load analytics. Please refresh.</p>
      </div>
    );
  }

  const { metrics, charts, recentActivity } = analytics;

  const metricCards = [
    { label: 'Team Members', value: usersCount, icon: Users, color: 'text-accent-500', sub: 'Active members' },
    { label: 'Submitted', value: metrics.submittedThisWeek, icon: CheckCircle, color: 'text-emerald-500', sub: 'This week' },
    { label: 'Compliance', value: `${metrics.complianceRate}%`, icon: FileText, color: 'text-accent-400', sub: 'Submission rate' },
    { label: 'Drafts', value: metrics.pendingThisWeek, icon: Clock, color: 'text-amber-500', sub: 'Pending' },
    { label: 'Blockers', value: metrics.openBlockers, icon: AlertTriangle, color: metrics.openBlockers > 0 ? 'text-red-500' : 'text-gray-400', sub: 'Open issues' },
  ];

  return (
    <div className="space-y-6 page-enter">
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'Admin'}`}
        description={
          <>
            <span className="block">Welcome back to PulseBoard.</span>
            <span className="block mt-1 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
              Weekly Reports. Team Insights.
            </span>
          </>
        }
      >
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsExportModalOpen(true)}
          className="bg-white"
        >
          <Download className="mr-2 h-4 w-4" /> Export Reports
        </Button>
      </PageHeader>
      
      <ExportModal 
        open={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        projects={allProjects}
        users={allUsers}
      />
      
      {/* Metrics Row */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        {metricCards.map((m) => (
          <Card key={m.label} hover>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{m.label}</CardTitle>
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-gray-900">{m.value}</div>
              <p className="text-[11px] text-gray-400 mt-0.5">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Submission Status</CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">By team member</p>
          </CardHeader>
          <CardContent className="h-72">
            {charts.memberSubmissions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.memberSubmissions} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '12px', color: '#6b7280', paddingTop: '12px' }}
                  />
                  <Bar dataKey="submitted" stackId="a" fill="#6366f1" name="Submitted" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="draft" stackId="a" fill="#c7d2fe" name="Draft" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">No submission data yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Project Distribution</CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">Reports by project</p>
          </CardHeader>
          <CardContent className="h-72">
            {charts.projectDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.projectDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    style={{ fontSize: '11px' }}
                  >
                    {charts.projectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">No project data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-100">
              <Sparkles className="h-4 w-4 text-accent-600" />
            </div>
            <div>
              <CardTitle className="text-sm">AI Assistant</CardTitle>
              <p className="text-xs text-gray-400">Powered by Gemini</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          )}
        </CardHeader>
        <CardContent>
          {/* Chat messages */}
          <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <Sparkles className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-1">Ask about your team's reports</p>
                <p className="text-xs text-gray-400">Gemini will analyze submitted data to answer questions</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative group max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-accent-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content)}
                      className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 rounded p-1 text-gray-400 hover:text-gray-600 transition-opacity"
                      aria-label="Copy response"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse-subtle" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse-subtle" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse-subtle" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSuggestedPrompt(p)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleAskAi} className="flex gap-2">
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask about team reports..." 
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
              disabled={aiLoading}
            />
            <button 
              type="submit" 
              disabled={aiLoading || !aiPrompt.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600 text-white hover:bg-accent-700 disabled:opacity-40 transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="text-[11px] text-gray-400 mt-2">
            Report context is sent to Google Gemini for processing.
          </p>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h2>
        <Card>
          <div className="divide-y divide-gray-100">
            {recentActivity.map(report => (
              <div key={report._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700 text-xs font-semibold">
                    {report.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      <span className="font-medium">{report.userId?.name}</span>
                      <span className="text-gray-400"> · </span>
                      <span className="text-gray-500">{report.projectId?.name}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Week of {new Date(report.weekStartDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={report.status === 'submitted' ? 'success' : 'warning'}>
                    {report.status}
                  </Badge>
                  <Link to={`/admin/reports/${report._id}`} className="text-xs font-medium text-accent-600 hover:text-accent-500">
                    View
                  </Link>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-gray-400">No recent activity</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
