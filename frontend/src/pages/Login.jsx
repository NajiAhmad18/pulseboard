import React, { useContext, useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('member');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useHookForm();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password, activeTab);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to login';
      toast.error(msg);
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
            
            <h2 className="text-3xl font-bold mb-4 leading-tight">Sign in to Your Account</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-10">
              Team members and managers — all in one place. Access your dashboard and manage your weekly reports seamlessly.
            </p>
            
            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
                <h3 className="text-sm font-semibold mb-1 text-white">Team Members</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Submit weekly reports, track progress, and highlight blockers effortlessly.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
                <h3 className="text-sm font-semibold mb-1 text-white">Managers</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Review team activity, access live analytics, and export comprehensive summaries.</p>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mt-8 text-xs text-gray-500 font-medium">
            Secure login. Industry-standard encryption.
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-[400px] w-full mx-auto">
            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden text-center mb-8">
              <img src="/logo.png" alt="PulseBoard Logo" className="mx-auto h-12 w-auto object-contain mb-4" />
              <h1 className="text-[28px] font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-2 text-[14px] text-gray-500">Sign in to access your dashboard</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block mb-8">
              <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Welcome Back</h1>
              <p className="mt-1 text-[15px] text-gray-500">Enter your credentials to access your account</p>
            </div>

            {/* Tabs (Optional if you want to keep them, or we can remove since role is auto-detected. The original had them, let's keep them for visual consistency with original if needed, but the original script says role is auto-detected. Actually the original code had tabs for visual flair. Let's keep them as they were in the original code.) */}
            <div className="flex p-1 mb-8 space-x-1 bg-gray-100 rounded-xl border border-gray-200/50">
              <button
                type="button"
                className={cn(
                  "w-full rounded-lg py-2.5 text-[14px] font-medium transition-all duration-300",
                  activeTab === 'member'
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
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
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                )}
                onClick={() => setActiveTab('admin')}
              >
                Manager
              </button>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  labelClassName="group-focus-within:text-accent-600 font-medium text-gray-700"
                  className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-accent-100 focus:border-accent-600 transition-all"
                />
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
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
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  }
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-accent-600 focus:ring-accent-600" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-accent-600 hover:text-accent-700 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3.5 h-auto text-[15px] font-semibold rounded-xl hover:-translate-y-0.5 shadow-sm hover:shadow-[0_10px_20px_-10px_rgba(79,70,229,0.4)] active:translate-y-0 transition-all duration-300 mt-2" 
                isLoading={isSubmitting}
              >
                Sign In
              </Button>

              <div className="relative mt-8 mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to PulseBoard?</span>
                </div>
              </div>

              <Link to="/register" className="block">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full py-3.5 h-auto text-[15px] font-medium rounded-xl text-gray-700 border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  Create New Account
                </Button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

