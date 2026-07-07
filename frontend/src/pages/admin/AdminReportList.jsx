import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/common/PageHeader';
import Select from '../../components/common/Select';
import { SkeletonTable } from '../../components/common/Skeleton';
import { Link, useLocation } from 'react-router-dom';
import { Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/common/Button';
import { ExportModal } from '../../components/export/ExportModal';

const PAGE_LIMIT = 10;

export default function AdminReportList() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const initialSearch = new URLSearchParams(location.search).get('search') || '';

  const [filters, setFilters] = useState({
    userId: '',
    projectId: '',
    status: '',
    search: initialSearch,
  });

  useEffect(() => {
    const currentSearch = new URLSearchParams(location.search).get('search') || '';
    setFilters(prev => ({ ...prev, search: currentSearch }));
  }, [location.search]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Fetch reports whenever page or filters change
  useEffect(() => {
    fetchReports();
  }, [filters, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInitialData = async () => {
    try {
      const [userRes, projRes] = await Promise.all([
        api.get('/users'),
        api.get('/projects'),
      ]);
      setUsers(userRes.data.data);
      setProjects(projRes.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.userId) query.append('userId', filters.userId);
      if (filters.projectId) query.append('projectId', filters.projectId);
      if (filters.status) query.append('status', filters.status);
      if (filters.search) query.append('search', filters.search);
      query.append('page', page);
      query.append('limit', PAGE_LIMIT);

      const res = await api.get(`/reports/all?${query.toString()}`);
      setReports(res.data.data);
      setTotal(res.data.total ?? 0);
      setTotalPages(res.data.totalPages ?? 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  return (
    <div className="space-y-5 page-enter">
      <PageHeader title="Team Reports" description="View and filter all team member reports">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExportModalOpen(true)}
          className="bg-white"
        >
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </PageHeader>

      <ExportModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projects={projects}
        users={users}
        currentFilters={filters}
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center flex-wrap">
          <Select
            value={filters.userId}
            onChange={e => setFilters({ ...filters, userId: e.target.value })}
            className="min-w-[150px]"
          >
            <option value="">All Members</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </Select>

          <Select
            value={filters.projectId}
            onChange={e => setFilters({ ...filters, projectId: e.target.value })}
            className="min-w-[150px]"
          >
            <option value="">All Projects</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </Select>

          <Select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="min-w-[150px]"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="draft">Draft</option>
          </Select>

          {filters.search && (
            <div className="flex items-center gap-2 bg-accent-50 text-accent-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-accent-100 ml-auto">
              <span>Search: "{filters.search}"</span>
              <button 
                onClick={() => setFilters({ ...filters, search: '' })}
                className="text-accent-500 hover:text-accent-800 ml-1"
                aria-label="Clear search"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      </Card>

      {loading ? <SkeletonTable rows={6} cols={5} /> : reports.length === 0 ? (
        <EmptyState title="No Reports Found" description="Try adjusting your filters or check back later." />
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700 text-xs font-semibold">
                            {report.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{report.userId?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(report.weekStartDate).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{report.projectId?.name || 'N/A'}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={report.status === 'submitted' ? 'success' : 'warning'}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/admin/reports/${report._id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-500"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Page <span className="font-medium text-gray-900">{page}</span> of{' '}
              <span className="font-medium text-gray-900">{totalPages}</span>
              <span className="ml-2 text-gray-400">({total} total)</span>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
