import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-full bg-[#0f1319] text-slate-200 font-sans overflow-hidden">
      
      {/* PERSISTENT SIDEBAR */}
      <aside className="w-64 bg-[#161b22] border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Header Branding */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="p-2 bg-sky-600 rounded-lg text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-white tracking-wide">CivicLink</h2>
              <p className="text-xs text-slate-500">Issue Reporter</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {['Dashboard', 'Reports', 'Map View', 'Validation Hub', 'Settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab ? setActiveTab(tab) : null}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-sky-600/10 text-sky-400 border border-sky-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-40"></span>
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Dynamic User Profile Footer */}
        <div className="border-t border-slate-800 pt-4 px-2 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.role?.slice(0, 2) || 'US'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white truncate">Session User</h4>
              <p className="text-xs text-slate-500 font-mono truncate uppercase">{user?.role || 'Guest'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full text-left text-xs text-red-400 hover:text-red-300 transition-colors font-medium pl-1"
          >
            Sign Out System →
          </button>
        </div>
      </aside>

      {/* RENDER VIEWPORT SLAG */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-[#161b22] px-6 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-bold text-white tracking-tight">Urban Control Tower</h1>
          <span className="text-xs px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Microsoft SDE Cluster</span>
        </header>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

    </div>
  );
}