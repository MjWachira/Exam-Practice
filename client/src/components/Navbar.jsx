import React from 'react';
import { ShieldCheck, History, LayoutDashboard, FileSpreadsheet, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ activeTab, setActiveTab, onOpenExcelModal, onOpenAuthModal }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight gradient-text">ScrumMaster Pro</span>
              <span className="block text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">CSM Alliance Exam Prep</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Practice Dashboard</span>
            </button>

            {user && (
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'history'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Session History</span>
              </button>
            )}

            <button
              onClick={onOpenExcelModal}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 border border-slate-200 dark:border-slate-700/50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Excel Question Bank</span>
            </button>
          </nav>

          {/* Theme Switcher & User Account Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-indigo-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{user.email || 'Logged in'}</p>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="gradient-btn px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
              >
                <User className="w-4 h-4" />
                <span>Login / Register</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
