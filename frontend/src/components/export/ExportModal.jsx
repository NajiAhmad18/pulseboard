import React, { useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import exportService from '../../services/exportService';
import toast from 'react-hot-toast';

export function ExportModal({
  open,
  onClose,
  projects = [],
  users = [],
  currentFilters = {},
  selectedReportIds = []
}) {
  const dialogRef = useRef(null);
  
  const [format, setFormat] = useState('csv');
  const [scope, setScope] = useState('all');
  const [filters, setFilters] = useState({
    status: 'all',
    projectId: '',
    userId: '',
    startDate: '',
    endDate: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      // Initialize filters with currentFilters when opened, if scope is filtered
      setFilters(prev => ({
        ...prev,
        ...currentFilters
      }));
      if (selectedReportIds.length > 0) {
        setScope('selected');
      } else if (Object.keys(currentFilters).length > 0) {
        setScope('filtered');
      } else {
        setScope('all');
      }
    } else {
      dialog.close();
    }
  }, [open, currentFilters, selectedReportIds]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Preparing report...');
    
    try {
      const payload = {
        format,
        scope,
        filters: scope === 'filtered' ? filters : {},
        selectedReportIds: scope === 'selected' ? selectedReportIds : []
      };
      
      const result = await exportService.generateExport(payload);
      
      if (result.empty) {
        toast.error('No reports found for the selected filters.', { id: toastId });
      } else {
        toast.success('Report exported successfully.', { id: toastId });
        onClose();
      }
    } catch (error) {
      toast.error('Failed to export reports.', { id: toastId });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-full max-w-lg rounded-xl border border-gray-200 bg-white p-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Download className="h-5 w-5 text-gray-500" />
          Export Reports
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="px-6 py-5 space-y-6">
        
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="format" 
                value="csv" 
                checked={format === 'csv'}
                onChange={(e) => setFormat(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">CSV Document</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="format" 
                value="pdf" 
                checked={format === 'pdf'}
                onChange={(e) => setFormat(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">PDF Report</span>
            </label>
          </div>
        </div>

        {/* Scope Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Scope</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="scope" 
                value="all" 
                checked={scope === 'all'}
                onChange={(e) => setScope(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">All Reports</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="scope" 
                value="filtered" 
                checked={scope === 'filtered'}
                onChange={(e) => setScope(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">Filtered Reports</span>
            </label>
            {selectedReportIds.length > 0 && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="scope" 
                  value="selected" 
                  checked={scope === 'selected'}
                  onChange={(e) => setScope(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">Selected Reports ({selectedReportIds.length})</span>
              </label>
            )}
          </div>
        </div>

        {/* Filters (only show if scope is filtered) */}
        {scope === 'filtered' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Filters to apply</h4>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Status"
                value={filters.status || 'all'}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'submitted', label: 'Submitted' }
                ]}
              />
              <Select
                label="Project"
                value={filters.projectId || ''}
                onChange={(e) => setFilters({...filters, projectId: e.target.value})}
                options={[
                  { value: '', label: 'All Projects' },
                  ...projects.map(p => ({ value: p._id, label: p.name }))
                ]}
              />
              <Select
                label="User"
                value={filters.userId || ''}
                onChange={(e) => setFilters({...filters, userId: e.target.value})}
                options={[
                  { value: '', label: 'All Users' },
                  ...users.map(u => ({ value: u._id, label: u.name }))
                ]}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Start Date"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
              <Input
                label="End Date"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-xl">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleExport} isLoading={isLoading}>
          Export
        </Button>
      </div>
    </dialog>
  );
}
