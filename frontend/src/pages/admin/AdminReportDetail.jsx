import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function AdminReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/reports/all/${id}`);
        setReport(res.data.data);
      } catch (error) {
        setApiError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <Loader />;
  if (!report) return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="text-sm text-red-500 mb-4">{apiError || 'Report not found'}</p>
      <Link to="/admin/reports">
        <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" /> Back to Reports</Button>
      </Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5 page-enter">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/reports" className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Report Details</h1>
          <p className="text-xs text-gray-400">Read-only view</p>
        </div>
        <Badge variant={report.status === 'submitted' ? 'success' : 'warning'}>
          {report.status}
        </Badge>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Member</p>
              <div className="flex items-center gap-2.5 mt-1.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700 text-sm font-semibold">
                  {report.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <CardTitle className="text-base">{report.userId?.name || 'Unknown'}</CardTitle>
                  <p className="text-xs text-gray-400">{report.userId?.email}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Project</p>
              <p className="text-sm font-medium text-gray-900 mt-1.5">{report.projectId?.name || 'N/A'}</p>
              <p className="flex items-center justify-end gap-1 text-xs text-gray-400 mt-0.5">
                <Calendar className="h-3 w-3" />
                {new Date(report.weekStartDate).toLocaleDateString()} – {new Date(report.weekEndDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          <Section title="Tasks Completed" content={report.tasksCompleted} />
          <Section title="Tasks Planned" content={report.tasksPlanned} />

          <div className="grid sm:grid-cols-2 gap-4">
            <Section title="Blockers" content={report.blockers || 'None reported'} />
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Details</h3>
              <div className="rounded-lg bg-gray-50 border border-gray-100 p-3.5 text-sm text-gray-700 space-y-1.5">
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-500">Hours:</span>
                  <span className="font-medium">{report.hoursWorked || 0}</span>
                </p>
                {report.notes && (
                  <p className="text-gray-600 pt-1.5 border-t border-gray-200 mt-1.5">{report.notes}</p>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-right">
            Created {new Date(report.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, content }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className="rounded-lg bg-gray-50 border border-gray-100 p-3.5 text-sm text-gray-700 whitespace-pre-wrap min-h-[60px]">
        {content}
      </div>
    </div>
  );
}
