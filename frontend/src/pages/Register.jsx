import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Register() {
  const { register: registerUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Failed to register');
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
            Create Account
          </h1>
          <p className="mt-2 text-[14px] font-medium text-gray-500">
            Join PulseBoard to get started
          </p>
        </div>

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {authError && (
            <div className="rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-100 px-4 py-3 text-sm text-red-700 animate-fade-in">
              <p>{authError}</p>
            </div>
          )}

          <div className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Smith"
              autoFocus
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              error={errors.name?.message}
              containerClassName="group"
              labelClassName="group-focus-within:text-accent-600 transition-colors"
              className="bg-white/50 border-gray-200/80 focus:bg-white"
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
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
              placeholder="At least 8 characters"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' }
              })}
              error={errors.password?.message}
              containerClassName="group"
              labelClassName="group-focus-within:text-accent-600 transition-colors"
              className="bg-white/50 border-gray-200/80 focus:bg-white"
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
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
            Create Account
          </Button>

          <p className="text-center text-[14px] text-gray-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent-600 hover:text-accent-500 hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
