import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Skeleton } from '../common/Skeleton';

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-50">
        <div className="w-full max-w-md px-6 text-center animate-fade-in">
          <div className="mb-8">
            <img 
              src="/logo.png" 
              alt="PulseBoard Logo" 
              className="mx-auto h-12 w-auto object-contain mb-5"
            />
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              PulseBoard
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500/70 uppercase tracking-widest">
              Weekly Reports. Team Insights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return user && allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default RoleRoute;
