import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Register() {
  const { register: registerUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      // Backend expects 'name'. We combine firstName and lastName.
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      // We pass name, email, password to backend. (Backend currently ignores phone, but we collected it in UI)
      await registerUser(fullName, data.email, data.password);
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-surface-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-600/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="w-full max-w-[960px] bg-white rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] relative z-10 animate-fade-in flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        {/* Left Panel - Branding & Info (Hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-between w-5/12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 text-white relative overflow-hidden">
          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-white p-1.5 rounded-lg">
                <img src="/logo.png" alt="PulseBoard" className="h-6 w-auto object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight">PulseBoard</span>
            </div>
            
            <p className="text-accent-400 font-medium text-sm mb-2">Join the movement</p>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Register & Start Your Journey Today</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-10">
              Create an account to start managing your weekly reports and collaborate with your team more effectively.
            </p>
            
            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
                <h3 className="text-sm font-semibold mb-1 text-white">Effortless Reporting</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Save time with structured forms and draft saving capabilities.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
                <h3 className="text-sm font-semibold mb-1 text-white">Centralized Workspace</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Keep all your progress, plans, and blockers organized in one place.</p>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mt-8 text-xs text-gray-500 font-medium">
            After registration, you can log in to access your dashboard.
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-[400px] w-full mx-auto">
            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden text-center mb-8">
              <img src="/logo.png" alt="PulseBoard Logo" className="mx-auto h-12 w-auto object-contain mb-4" />
              <h1 className="text-[28px] font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent tracking-tight">
                Create Account
              </h1>
              <p className="mt-2 text-[14px] text-gray-500">Join PulseBoard to get started</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block mb-8">
              <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Register</h1>
              <p className="mt-1 text-[15px] text-gray-500">Fill your details to create a new account</p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {authError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 animate-fade-in mb-4">
                  <p>{authError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="First Name *"
                  type="text"
                  placeholder="John"
                  autoFocus
                  {...register('firstName', { 
                    required: 'First Name is required',
                    minLength: { value: 2, message: 'Must be at least 2 characters' }
                  })}
                  error={errors.firstName?.message}
                  containerClassName="group"
                  labelClassName="group-focus-within:text-accent-600 font-medium text-gray-700"
                  className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent-100 focus:border-accent-600 transition-all"
                />
                <Input
                  label="Last Name *"
                  type="text"
                  placeholder="Doe"
                  {...register('lastName', { 
                    required: 'Last Name is required',
                    minLength: { value: 2, message: 'Must be at least 2 characters' }
                  })}
                  error={errors.lastName?.message}
                  containerClassName="group"
                  labelClassName="group-focus-within:text-accent-600 font-medium text-gray-700"
                  className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent-100 focus:border-accent-600 transition-all"
                />
              </div>

              <Input
                label="Email Address *"
                type="email"
                placeholder="you@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
                containerClassName="group"
                labelClassName="group-focus-within:text-accent-600 font-medium text-gray-700"
                className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent-100 focus:border-accent-600 transition-all"
              />
              
              <Input
                label="Phone Number *"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register('phone', { 
                  required: 'Phone Number is required',
                })}
                error={errors.phone?.message}
                containerClassName="group"
                labelClassName="group-focus-within:text-accent-600 font-medium text-gray-700"
                className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent-100 focus:border-accent-600 transition-all"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Password *"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'At least 8 characters' }
                  })}
                  error={errors.password?.message}
                  containerClassName="group"
                  labelClassName="group-focus-within:text-accent-600 font-medium text-gray-700"
                  className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent-100 focus:border-accent-600 transition-all"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-accent-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  }
                />
                <Input
                  label="Confirm Password *"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  error={errors.confirmPassword?.message}
                  containerClassName="group"
                  labelClassName="group-focus-within:text-accent-600 font-medium text-gray-700"
                  className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent-100 focus:border-accent-600 transition-all"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-accent-600 transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-3.5 h-auto text-[15px] font-semibold rounded-xl hover:-translate-y-0.5 shadow-sm hover:shadow-[0_10px_20px_-10px_rgba(79,70,229,0.4)] active:translate-y-0 transition-all duration-300 mt-4" 
                isLoading={isSubmitting}
              >
                Register Now
              </Button>

              <div className="relative mt-8 mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <Link to="/login" className="block">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full py-3.5 h-auto text-[15px] font-medium rounded-xl text-gray-700 border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
