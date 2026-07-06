import api from './api';

const exportService = {
  // Generate and download export
  generateExport: async (payload) => {
    try {
      const response = await api.post('/export', payload, {
        responseType: 'blob', // Important for file downloads
      });
      
      // Check for 204 No Content
      if (response.status === 204) {
        return { empty: true };
      }
      
      // Determine filename and type from format
      const format = payload.format === 'csv' ? 'csv' : 'pdf';
      const type = format === 'csv' ? 'text/csv' : 'application/pdf';
      const filename = `pulseboard-reports.${format}`;
      
      const blob = new Blob([response.data], { type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }
};

export default exportService;
