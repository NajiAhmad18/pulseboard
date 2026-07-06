import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <div className="text-center animate-fade-in w-full max-w-md">
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
        
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-6">
          <FileQuestion className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="text-sm text-gray-500 mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. Check the URL or head back home.
        </p>
        <Link to="/dashboard">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
