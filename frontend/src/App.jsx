import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute from './components/layout/RoleRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import DashboardRedirect from './pages/DashboardRedirect';
import MemberDashboard from './pages/member/MemberDashboard';
import ReportList from './pages/member/ReportList';
import ReportForm from './pages/member/ReportForm';
import ReportDetail from './pages/member/ReportDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProjectList from './pages/admin/ProjectList';
import AdminReportList from './pages/admin/AdminReportList';
import AdminReportDetail from './pages/admin/AdminReportDetail';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#18181b',
            color: '#fafafa',
            fontSize: '13px',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: { primary: '#6366f1', secondary: '#fafafa' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fafafa' },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          <Route element={<MainLayout />}>
            {/* Member Routes */}
            <Route element={<RoleRoute allowedRoles={['member', 'admin']} />}>
              <Route path="/member/dashboard" element={<MemberDashboard />} />
              <Route path="/member/reports" element={<ReportList />} />
              <Route path="/member/reports/new" element={<ReportForm />} />
              <Route path="/member/reports/:id" element={<ReportDetail />} />
              <Route path="/member/reports/:id/edit" element={<ReportForm />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/projects" element={<ProjectList />} />
              <Route path="/admin/reports" element={<AdminReportList />} />
              <Route path="/admin/reports/:id" element={<AdminReportDetail />} />
            </Route>
          </Route>
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
