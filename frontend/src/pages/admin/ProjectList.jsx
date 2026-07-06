import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/common/PageHeader';
import { SkeletonTable } from '../../components/common/Skeleton';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { FolderKanban, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;
    try {
      await api.post('/projects', newProject);
      toast.success('Project created');
      setNewProject({ name: '', description: '' });
      setIsAdding(false);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating project');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/projects/${deleteTarget}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting project');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <PageHeader title="Projects" description="Manage project categories for reports">
        <Button size="sm" variant={isAdding ? 'outline' : 'primary'} onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Project'}
        </Button>
      </PageHeader>

      {isAdding && (
        <Card className="p-5 animate-slide-down">
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Project Name"
                placeholder="e.g. Mobile App Redesign"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                autoFocus
                required
              />
            </div>
            <div className="flex-1">
              <Input
                label="Description"
                placeholder="Brief description (optional)"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>
            <Button type="submit" size="md">Save</Button>
          </form>
        </Card>
      )}

      {loading ? <SkeletonTable rows={4} cols={3} /> : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No Projects"
          description="Create a project so members can categorize their reports."
          actionText="Add Project"
          onAction={() => setIsAdding(true)}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-50">
                          <FolderKanban className="h-3.5 w-3.5 text-accent-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{project.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{project.description || '—'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setDeleteTarget(project._id)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
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
        title="Delete project?"
        description="This will permanently delete this project. Reports tagged with it will not be affected."
        confirmText="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
