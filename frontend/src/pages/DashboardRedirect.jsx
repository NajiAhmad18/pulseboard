import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

export default function DashboardRedirect() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/member/dashboard" replace />;
}
