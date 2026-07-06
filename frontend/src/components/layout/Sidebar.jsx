import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderKanban, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { ConfirmDialog } from '../common/ConfirmDialog';

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogoutConfirm = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = user?.role === 'admin' 
    ? [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
      ]
    : [
        { name: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard },
        { name: 'My Reports', href: '/member/reports', icon: FileText },
      ];

  return (
    <>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-200 ease-in-out",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo area */}
        <div className={cn("flex flex-col border-b border-gray-100", collapsed ? "p-4 items-center" : "p-5")}>
          <Link to="/dashboard" className="flex flex-col gap-2 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="PulseBoard Logo" 
              className={cn("h-7 w-auto object-contain", collapsed ? "mx-auto" : "self-start")}
            />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-gray-900 tracking-tight whitespace-nowrap">
                  PulseBoard
                </span>
                <span className="text-[10px] font-medium text-gray-500/70 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                  Weekly Reports. Team Insights.
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-2 py-3" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "group relative flex items-center rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors duration-150",
                  isActive
                    ? "bg-accent-50 text-accent-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-accent-600" />
                )}
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    collapsed ? "" : "mr-2.5",
                    isActive ? "text-accent-600" : "text-gray-400 group-hover:text-gray-600"
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 py-1">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User section */}
        <div className="border-t border-gray-100 p-2">
          <div className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2",
            collapsed && "justify-center px-0"
          )}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700 text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-[13px] font-medium text-gray-900">{user?.name}</p>
                <p className="truncate text-[11px] text-gray-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsLogoutOpen(true)}
            title={collapsed ? 'Logout' : undefined}
            className={cn(
              "mt-0.5 flex w-full items-center rounded-md px-2.5 py-2 text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className={cn("h-[18px] w-[18px] shrink-0", !collapsed && "mr-2.5")} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Log out of PulseBoard?"
        description="You will need to sign in again to access your dashboard."
        confirmText="Log out"
        variant="danger"
      />
    </>
  );
}
