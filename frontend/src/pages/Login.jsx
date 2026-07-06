import React, { useContext, useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('member');
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useHookForm();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to login';
      toast.error(msg);
    }
  };


  return (
    <div 
      className="flex min-h-screen items-center justify-center px-4 py-12 relative overflow-hidden bg-surface-50"
      style={{
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.1) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.1) 0px, transparent 50%)
        `
      }}
    >
      <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-xl border border-white rounded-[24px] p-8 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] relative z-10 animate-fade-in">
        
        {/* Brand */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="PulseBoard Logo" 
            className="mx-auto h-12 w-auto object-contain transition-transform hover:scale-105 duration-500"
          />
          <h1 className="mt-6 text-[28px] font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-[14px] font-medium text-gray-500">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 mb-8 space-x-1 bg-gray-900/5 rounded-xl border border-gray-900/5 backdrop-blur-sm">
          <button
            type="button"
            className={cn(
              "w-full rounded-lg py-2.5 text-[14px] font-medium transition-all duration-300",
              activeTab === 'member'
                ? "bg-white text-accent-700 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
            )}
            onClick={() => setActiveTab('member')}
          >
            Team Member
          </button>
          <button
            type="button"
            className={cn(
              "w-full rounded-lg py-2.5 text-[14px] font-medium transition-all duration-300",
              activeTab === 'admin'
                ? "bg-white text-accent-700 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
            )}
            onClick={() => setActiveTab('admin')}
          >
            Manager
          </button>
        </div>

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              autoFocus
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
              containerClassName="group"
              labelClassName="group-focus-within:text-accent-600 transition-colors"
              className="bg-white/50 border-gray-200/80 focus:bg-white"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
              containerClassName="group"
              labelClassName="group-focus-within:text-accent-600 transition-colors"
              className="bg-white/50 border-gray-200/80 focus:bg-white"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-3.5 h-auto text-[15px] font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] active:translate-y-0 transition-all duration-300 mt-2" 
            isLoading={isSubmitting}
          >
            Sign In
          </Button>

          <p className="text-center text-[14px] text-gray-500 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-accent-600 hover:text-accent-500 hover:underline transition-all">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
