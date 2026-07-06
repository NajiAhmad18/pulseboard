import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { PageHeader } from '../../components/common/PageHeader';
import toast from 'react-hot-toast';

export default function ReportForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [projects, setProjects] = useState([]);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, reportRes] = await Promise.all([
          api.get('/projects'),
          isEdit ? api.get(`/reports/${id}`) : Promise.resolve(null)
        ]);
        
        setProjects(projRes.data.data);
        
        if (reportRes) {
          const r = reportRes.data.data;
          if (r.status === 'submitted') {
            toast.error('Cannot edit a submitted report');
            navigate(`/member/reports/${id}`);
            return;
          }
          reset({
            projectId: r.projectId._id,
            weekStartDate: new Date(r.weekStartDate).toISOString().split('T')[0],
            weekEndDate: new Date(r.weekEndDate).toISOString().split('T')[0],
            tasksCompleted: r.tasksCompleted,
            tasksPlanned: r.tasksPlanned,
            blockers: r.blockers,
            hoursWorked: r.hoursWorked,
            notes: r.notes,
          });
        }
      } catch (error) {
        console.error(error);
        setApiError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    setApiError('');

    // Cross-field date validation
    if (new Date(data.weekEndDate) < new Date(data.weekStartDate)) {
      setApiError('Week End Date cannot be before Week Start Date');
      return;
    }

    // Process and trim data
    const payload = {
      ...data,
      tasksCompleted: data.tasksCompleted.trim(),
      tasksPlanned: data.tasksPlanned.trim(),
      blockers: data.blockers?.trim() || 'No blockers reported.',
      notes: data.notes?.trim(),
      hoursWorked: data.hoursWorked === '' ? 0 : Number(data.hoursWorked)
    };

    if (payload.tasksCompleted.length === 0 || payload.tasksPlanned.length === 0) {
      setApiError('Please fill out all required fields properly without just using spaces.');
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/reports/${id}`, payload);
        toast.success('Report updated!');
      } else {
        await api.post('/reports', payload);
        toast.success('Draft created!');
      }
      navigate('/member/reports');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save report';
      setApiError(msg);
      toast.error(msg);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-2xl space-y-5 page-enter">
      <PageHeader
        title={isEdit ? 'Edit Report' : 'New Report'}
        description={isEdit ? 'Update your weekly report draft' : 'Create a new weekly progress report'}
      />
      
      {apiError && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <Card>
        <CardContent className="p-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Week Start"
                type="date"
                {...register('weekStartDate', { required: 'Week Start is required' })}
                error={errors.weekStartDate?.message}
              />
              <Input
                label="Week End"
                type="date"
                {...register('weekEndDate', { required: 'Week End is required' })}
                error={errors.weekEndDate?.message}
              />
            </div>

            {/* Project */}
            <div>
              <Select
                label="Project"
                {...register('projectId', { required: 'Project is required' })}
                error={errors.projectId?.message}
                disabled={projects.length === 0}
              >
                <option value="">Select a project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </Select>
              {projects.length === 0 && (
                <p className="mt-1.5 text-[13px] text-red-500 font-medium">No projects are available. Please contact your manager.</p>
              )}
            </div>

            {/* Tasks */}
            <Textarea
              label="Tasks Completed"
              placeholder="What did you accomplish this week?"
              {...register('tasksCompleted', { 
                required: 'Tasks Completed is required',
                minLength: { value: 10, message: 'Minimum 10 characters required' },
                maxLength: { value: 2000, message: 'Maximum 2000 characters allowed' }
              })}
              error={errors.tasksCompleted?.message}
            />

            <Textarea
              label="Tasks Planned for Next Week"
              placeholder="What do you plan to work on?"
              {...register('tasksPlanned', { 
                required: 'Tasks Planned is required',
                minLength: { value: 10, message: 'Minimum 10 characters required' },
                maxLength: { value: 2000, message: 'Maximum 2000 characters allowed' }
              })}
              error={errors.tasksPlanned?.message}
            />

            <Textarea
              label="Blockers / Challenges (Optional)"
              placeholder="Any obstacles? Leave blank if none."
              className="min-h-[80px]"
              {...register('blockers', {
                maxLength: { value: 1000, message: 'Maximum 1000 characters allowed' }
              })}
              error={errors.blockers?.message}
            />

            {/* Hours & Notes */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Hours Worked"
                type="number"
                step="0.5"
                placeholder="e.g. 40"
                {...register('hoursWorked', {
                  min: { value: 0, message: 'Hours worked must be a number between 0 and 80' },
                  max: { value: 80, message: 'Hours worked must be a number between 0 and 80' },
                  valueAsNumber: true,
                })}
                error={errors.hoursWorked?.message}
              />
              <div /> {/* Spacer for grid alignment */}
            </div>

            <Textarea
              label="Additional Notes (Optional)"
              placeholder="Links, references, or extra context..."
              className="min-h-[80px]"
              {...register('notes', {
                maxLength: { value: 1000, message: 'Maximum 1000 characters allowed' }
              })}
              error={errors.notes?.message}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <Button type="button" variant="outline" size="sm" onClick={() => navigate('/member/reports')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="sm" 
                isLoading={isSubmitting}
                disabled={projects.length === 0}
              >
                {isEdit ? 'Save Changes' : 'Create Draft'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
