import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, Pencil, ArrowLeft, Calendar, Clock } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/reports/${id}`);
        setReport(res.data.data);
      } catch (error) {
        setApiError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setApiError('');
    try {
      await api.post(`/reports/${id}/submit`);
      setReport({ ...report, status: 'submitted' });
      toast.success('Report submitted successfully!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit report';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  if (loading) return <Loader />;
  if (!report) return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="text-sm text-red-500 mb-4">{apiError || 'Report not found'}</p>
      <Button variant="outline" size="sm" onClick={() => navigate('/member/reports')}>
        <ArrowLeft className="h-4 w-4" /> Back to Reports
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5 page-enter">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/member/reports" className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Report Details</h1>
        </div>
        <Badge variant={report.status === 'submitted' ? 'success' : 'warning'}>
          {report.status}
        </Badge>
      </div>

      {apiError && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <Card>
        {/* Meta header */}
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Project</p>
              <CardTitle className="mt-1 text-base">{report.projectId?.name || 'Unknown'}</CardTitle>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(report.weekStartDate).toLocaleDateString()} – {new Date(report.weekEndDate).toLocaleDateString()}
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

          {report.status === 'draft' && (
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <Button variant="outline" size="sm" onClick={() => navigate(`/member/reports/${report._id}/edit`)}>
                <Pencil className="h-3.5 w-3.5" /> Edit Draft
              </Button>
              <Button size="sm" onClick={() => setShowSubmitDialog(true)}>
                <Send className="h-3.5 w-3.5" /> Submit Report
              </Button>
            </div>
          )}

          <p className="text-[11px] text-gray-400 text-right">
            Created {new Date(report.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmit}
        title="Submit this report?"
        description="Once submitted, this report cannot be edited. Make sure all information is accurate."
        confirmText="Submit"
        variant="warning"
        isLoading={submitting}
      />
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
