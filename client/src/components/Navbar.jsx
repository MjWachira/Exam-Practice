import React, { useState } from 'react';
import { ShieldCheck, History, LayoutDashboard, FileSpreadsheet, LogOut, User, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ activeTab, setActiveTab, onOpenExcelModal, onOpenAuthModal }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white font-bold" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight gradient-text">ScrumMaster Pro</span>
              <span className="hidden xs:block text-[9px] sm:text-[10px] uppercase tracking-widest text-violet-600 dark:text-violet-400 font-semibold">CSM Alliance Exam Prep</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>Practice Dashboard</span>
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('history')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'history'
                    ? 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <History className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Session History</span>
              </button>
            )}

            <button
              onClick={onOpenExcelModal}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 border border-slate-200 dark:border-slate-700/50"
            >
              <FileSpreadsheet className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>Excel Question Bank</span>
            </button>
          </nav>

          {/* Theme Switcher & User Account Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
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
              <div className="flex items-center space-x-2 sm:space-x-3 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 sm:px-3 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left">
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
                className="gradient-btn px-3 sm:px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
              >
                <User className="w-4 h-4" />
                <span className="hidden xs:inline">Login / Register</span>
                <span className="xs:hidden">Login</span>
              </button>
            )}

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-2 animate-fade-in shadow-xl">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/30'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span>Practice Dashboard</span>
          </button>

          {user && (
            <button
              onClick={() => handleNavClick('history')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/30'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <History className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Session History</span>
            </button>
          )}

          <button
            onClick={() => { onOpenExcelModal(); setMobileMenuOpen(false); }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50"
          >
            <FileSpreadsheet className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span>Excel Question Bank</span>
          </button>
        </div>
      )}
    </header>
  );
}
