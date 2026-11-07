import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../services/api';

// --- Sub-Component: Status Severity Badge ---
const SeverityBadge = ({ severity }) => {
  const styles = {
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-mono border rounded ${styles[severity] || styles.Medium}`}>
      {severity}
    </span>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // --- Dynamic Application States ---
  const [metrics, setMetrics] = useState({ active: 0, resolved: 0, breakdown: { High: 0, Medium: 0 } });
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Controlled Form State ---
  const [form, setForm] = useState({
    issueType: 'Pothole',
    description: '',
    severity: 'High',
  });

  // --- Hydrate Component Data directly from Backend Layers ---
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Firing concurrent execution pools for maximum network efficiency
      const [metricsRes, feedRes] = await Promise.all([
        API.get('/analytics/summary'),
        API.get('/issues/feed')
      ]);

      setMetrics(metricsRes.data);
      setFeed(feedRes.data);
    } catch (err) {
      console.error('Failed to sync dynamic telemetry metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Stream New Report Ingestion Payload ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) return;

    try {
      const response = await API.post('/issues', {
        title: `${form.issueType}: ${form.description.slice(0, 30)}`,
        category: form.issueType,
        description: form.description,
        location: '47.8823, -122.3321', // Geolocation payload hook
        severity: form.severity
      });
      
      // Optimistic pipeline UI state acceleration updates
      const newLog = {
        id: response.data._id || Date.now(),
        user: 'Alex (You)',
        action: `reported: ${form.issueType}, 4th & Madison`,
        severity: form.severity,
        time: 'Just now'
      };

      setFeed(prev => [newLog, ...prev]);
      setMetrics(prev => ({ ...prev, active: prev.active + 1 }));
      setForm(prev => ({ ...prev, description: '' })); // Clear input canvas buffer
    } catch (err) {
      console.error('Error dispatching ledger event payload:', err);
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="p-6 h-full overflow-y-auto grid grid-cols-1 xl:grid-cols-3 gap-6 bg-[#0f1319]">
        
        {/* LEFT COMPONENT COLUMN (MAP & METRICS VIEW GRIDS) */}
        <div className="xl:col-span-2 flex flex-col gap-6 justify-between">
          
          {/* GEOSPATIAL MAP WRAPPER CARD */}
          <div className="flex-1 min-h-[400px] bg-[#161b22] border border-slate-800 rounded-xl relative overflow-hidden p-4 flex flex-col justify-between shadow-2xl">
            <div className="flex justify-between items-center z-10 w-full">
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 w-72 shadow-lg">
                <svg className="w-4 h-4 text-slate-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search telemetry coordinates..." className="bg-transparent text-xs text-slate-200 outline-none w-full placeholder-slate-500" />
              </div>
            </div>

            <div className="absolute inset-0 bg-[#11141a] opacity-35 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Visualizing Clustered Nodes (Simulated Core Heatmap targets) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
              <div className="w-40 h-40 bg-red-500/10 rounded-full animate-pulse flex items-center justify-center border border-red-500/20">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                  <div className="w-4 h-4 bg-red-500 rounded-full ring-4 ring-red-500/30 shadow-2xl"></div>
                </div>
              </div>
            </div>

            <div className="self-end bg-slate-900/95 border border-slate-800 p-3.5 rounded-xl text-[11px] space-y-2 z-10 w-40 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-md"></span> <span className="text-slate-400">Pothole</span></div>
              <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md"></span> <span className="text-slate-400">Broken Light</span></div>
              <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md"></span> <span className="text-slate-400">Tree Down</span></div>
              <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-md"></span> <span className="text-slate-400">Graffiti</span></div>
            </div>
          </div>

          {/* LOWER ANALYTICAL SUMMARY DATA CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 shrink-0">
            <div className="bg-[#161b22] border border-slate-800/80 p-5 rounded-xl shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Reports</span>
                <h3 className="text-3xl font-bold text-white mt-1 font-mono">
                  {loading ? <span className="animate-pulse text-slate-600">...</span> : metrics.active}
                </h3>
              </div>
              <div className="h-1.5 w-full bg-slate-800 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((metrics.active / (metrics.active + metrics.resolved || 1)) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-[#161b22] border border-slate-800/80 p-5 rounded-xl shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Recently Resolved</span>
                <h3 className="text-3xl font-bold text-emerald-400 mt-1 font-mono">
                  {loading ? <span className="animate-pulse text-slate-600">...</span> : metrics.resolved}
                </h3>
              </div>
              <div className="h-1.5 w-full bg-slate-800 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((metrics.resolved / (metrics.active + metrics.resolved || 1)) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-[#161b22] border border-slate-800/80 p-5 rounded-xl shadow-lg flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Report Status Breakdown</span>
              <div className="flex items-center justify-between mt-2">
                <div className={`w-10 h-10 rounded-full border-4 border-slate-800 border-t-sky-500 border-r-emerald-500 ${loading ? 'animate-spin' : ''}`}></div>
                <div className="text-right text-[11px] font-mono text-slate-400">
                  <div>High: <span className="text-red-400">{metrics.breakdown?.High || 0}%</span></div>
                  <div>Mid: <span className="text-amber-400">{metrics.breakdown?.Medium || 0}%</span></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COMPONENT COLUMN (FORM OPERATIONS & TRANSACTION LOG PIPELINE) */}
        <div className="space-y-6 flex flex-col h-full overflow-hidden">
          
          {/* INGESTION FORM BLOCK CARD */}
          <div className="bg-[#161b22] border border-slate-800/80 p-5 rounded-xl shadow-xl shrink-0 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">New Report</h3>
            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Issue Type</label>
                <select 
                  value={form.issueType}
                  onChange={(e) => setForm({...form, issueType: e.target.value})}
                  className="w-full bg-[#0f1319] border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-sky-500 transition-colors"
                >
                  <option>Pothole</option>
                  <option>Broken Light</option>
                  <option>Tree Down</option>
                  <option>Graffiti</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Description</label>
                <textarea 
                  rows="2"
                  required
                  placeholder="Enter detailed structural context..."
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full bg-[#0f1319] border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-sky-500 transition-colors resize-none placeholder-slate-600 leading-relaxed"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Location</label>
                <div className="bg-[#0f1319] border border-slate-800 rounded-lg p-2.5 text-slate-500 font-mono text-[11px]">
                  Automatically detected: <span className="text-slate-300 font-medium">47.8823, -122.3321</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Severity</label>
                <select 
                  value={form.severity}
                  onChange={(e) => setForm({...form, severity: e.target.value})}
                  className="w-full bg-[#0f1319] border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-sky-500 transition-colors"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-lg shadow-sky-600/10">
                  New Report
                </button>
              </div>
            </form>
          </div>

          {/* DYNAMIC PIPELINE TELEMETRY FEED PANEL */}
          <div className="bg-[#161b22] border border-slate-800/80 p-5 rounded-xl flex-1 flex flex-col overflow-hidden shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Activity Feed</h3>
            
            <div className="overflow-y-auto flex-1 pr-1 border-l border-slate-800 ml-2 pl-5 space-y-4 relative scrollbar-thin scrollbar-thumb-slate-800">
              {loading ? (
                <div className="text-center font-mono text-[11px] text-slate-600 animate-pulse pt-4">Synchronizing with live stream clusters...</div>
              ) : feed.length === 0 ? (
                <div className="text-center font-mono text-[11px] text-slate-600 pt-4">No active incident logs streaming.</div>
              ) : (
                feed.map((item) => (
                  <div key={item.id || item._id} className="relative text-xs space-y-1 group transition-all">
                    <span className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full bg-[#161b22] border-2 border-slate-600 group-hover:border-sky-500 transition-colors"></span>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-semibold text-[11px]">User {item.user || 'External Node'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.time || 'recent'}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{item.action || item.description}</p>
                    
                    <div className="pt-0.5">
                      <SeverityBadge severity={item.severity} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}