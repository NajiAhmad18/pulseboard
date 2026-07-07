import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { Card } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/common/PageHeader';
import { SkeletonTable } from '../../components/common/Skeleton';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentSearch = searchParams.get('search') || '';

  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, [location.search]);

  const fetchReports = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const search = queryParams.get('search');
      let url = '/reports';
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      const res = await api.get(url);
      setReports(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/reports/${deleteTarget}`);
      toast.success('Draft deleted');
      fetchReports();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting report');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <PageHeader title="My Reports" description="Track and manage your weekly submissions">
        <Link to="/member/reports/new">
          <Button size="sm"><Plus className="h-4 w-4" /> New Report</Button>
        </Link>
      </PageHeader>

      {currentSearch && (
        <div className="flex items-center gap-2 bg-accent-50 text-accent-700 px-3 py-2 rounded-lg text-sm font-medium border border-accent-100 mb-4 w-max">
          <span>Search: "{currentSearch}"</span>
          <button 
            onClick={() => navigate('/member/reports')}
            className="text-accent-500 hover:text-accent-800 ml-1"
            aria-label="Clear search"
          >
            &times;
          </button>
        </div>
      )}

      {loading ? <SkeletonTable rows={5} cols={4} /> : reports.length === 0 ? (
        <EmptyState 
          title="No reports yet" 
          description="Start tracking your weekly progress by creating your first report." 
          actionText="Create Report"
          onAction={() => window.location.href = '/member/reports/new'}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {new Date(report.weekStartDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{report.projectId?.name || 'N/A'}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={report.status === 'submitted' ? 'success' : 'warning'}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/member/reports/${report._id}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                        {report.status === 'draft' && (
                          <>
                            <Link
                              to={`/member/reports/${report._id}/edit`}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(report._id)}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete draft report?"
        description="This will permanently delete this draft. This action cannot be undone."
        confirmText="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
