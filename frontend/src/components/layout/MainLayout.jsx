import React, { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { AuthContext } from '../../context/AuthContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <div className="hidden lg:flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Sidebar — mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm text-gray-600">
              {getGreeting()}, <span className="font-medium text-gray-900">{user?.name?.split(' ')[0]}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search input */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const search = formData.get('search');
              if (search && search.trim()) {
                const query = encodeURIComponent(search.trim());
                if (user?.role === 'admin') {
                  navigate(`/admin/reports?search=${query}`);
                } else {
                  navigate(`/member/reports?search=${query}`);
                }
              }
            }} className="hidden sm:flex items-center gap-2.5 rounded-full border border-gray-200 bg-gray-50/80 px-3.5 py-1.5 text-sm focus-within:ring-[3px] focus-within:ring-accent-500/20 focus-within:border-accent-500 focus-within:bg-white transition-all duration-300 shadow-sm hover:bg-white w-[240px] focus-within:w-[300px] group">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-accent-500 transition-colors shrink-0" />
              <input 
                name="search"
                type="text"
                placeholder="Search reports..."
                className="bg-transparent border-none border-0 focus:border-0 focus:border-none focus:ring-0 focus:outline-none outline-none text-gray-700 w-full placeholder-gray-400 p-0 shadow-none ring-0 h-full"
                autoComplete="off"
              />
              <div className="flex shrink-0 items-center justify-center rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 shadow-sm group-focus-within:border-accent-200 group-focus-within:text-accent-500 transition-colors">
                <kbd className="font-sans">cmd K</kbd>
              </div>
            </form>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
