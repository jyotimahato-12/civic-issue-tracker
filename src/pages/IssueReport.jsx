import React, { useState } from 'react';
import Layout from '../components/Layout';
import API from '../services/api';

export default function IssueReport() {
  const [activeTab, setActiveTab] = useState('Map View');
  
  // --- Form & Telemetry State Machine ---
  const [form, setForm] = useState({
    issueType: 'Pothole',
    description: 'Large pothole on 4th & Madison, causing delays.',
    severity: 'High',
  });
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isUploading, setIsUploading] = useState(false);

  // --- Secure Multi-part File Selection ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check bounds for payload protection (e.g., 5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'Payload size exceeds 5MB gateway threshold.' });
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  // --- Dynamic Multipart Form Ingestion Delivery ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    setIsUploading(true);

    try {
      // Establish Multipart FormData payload boundary assignment
      const formData = new FormData();
      formData.append('title', `${form.issueType}: ${form.description.slice(0, 30)}`);
      formData.append('category', form.issueType);
      formData.append('description', form.description);
      formData.append('severity', form.severity);
      formData.append('location', '47.8823, -122.3321'); // Coordinates anchor hook
      
      if (file) {
        formData.append('media', file); // S3 cloud pipeline integration slot
      }

      const response = await API.post('/issues/multipart-ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatusMessage({ type: 'success', text: `Incident committed successfully. Ledger Entity ID: #${response.data._id?.slice(-6)}` });
      
      // Clear current form stream buffer buffers
      setForm({ issueType: 'Pothole', description: '', severity: 'High' });
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Multipart pipeline transaction failure:', err);
      setStatusMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Transaction drop encountered at API gateway layer.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="p-6 h-full overflow-y-auto grid grid-cols-1 xl:grid-cols-3 gap-6 bg-[#0f1319]">
        
        {/* LEFT TWO COLUMNS: SYSTEM COMPONENT DATA CANVAS GRAPH */}
        <div className="xl:col-span-2 min-h-[450px] bg-[#161b22] border border-slate-800 rounded-xl relative overflow-hidden p-4 flex flex-col justify-between shadow-2xl">
          <div className="flex justify-between items-center z-10 w-full">
            <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 w-72 shadow-lg">
              <svg className="w-4 h-4 text-slate-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Filter node maps by region/zone..." className="bg-transparent text-xs text-slate-200 outline-none w-full placeholder-slate-500" />
            </div>
          </div>

          {/* Canvas Node Grid Vector Matrix Background Layout */}
          <div className="absolute inset-0 bg-[#11141a] opacity-35 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          {/* Spatial Anchor Point Layer */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="w-3.5 h-3.5 bg-sky-500 rounded-full ring-4 ring-sky-500/20 shadow-2xl animate-pulse"></div>
            <span className="bg-slate-900/90 text-[9px] text-sky-400 font-mono px-1.5 py-0.5 border border-slate-700 rounded">TARGET_CELL</span>
          </div>

          {statusMessage.text && (
            <div className={`z-10 p-3 rounded-lg border text-xs max-w-md ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {statusMessage.text}
            </div>
          )}

          <div className="self-end bg-slate-900/95 border border-slate-800 p-3.5 rounded-xl text-[11px] space-y-2 z-10 w-40 shadow-2xl backdrop-blur-sm">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Overlay Metadata</div>
            <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> <span className="text-slate-400">Pothole</span></div>
            <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <span className="text-slate-400">Broken Light</span></div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECONFIGURABLE TRANSACTION REPORT INGESTION FORM CONTAINER */}
        <div className="bg-[#161b22] border border-slate-800 p-5 rounded-xl shadow-xl h-fit space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">New Report</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Stream spatial telemetry metadata arrays directly into cloud storage.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            
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
                rows="3"
                required
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                className="w-full bg-[#0f1319] border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-sky-500 transition-colors resize-none leading-relaxed"
                placeholder="Enter spatial context logs..."
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Location Override Parameters</label>
              <div className="bg-[#0f1319] border border-slate-800 rounded-lg p-3 text-slate-500 font-mono text-[10px] space-y-0.5">
                <div>Device Latency: <span className="text-emerald-400">12ms (Nominal)</span></div>
                <div>GPS Coordinates: <span className="text-slate-300">47.8823, -122.3321</span></div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Severity Matrix Assignment</label>
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

            {/* SECURE MULTIPART MEDIA INGESTION SELECTION BLOCK */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold block">
                UPLOAD PHOTO/VIDEO <span className="text-sky-400 ml-1 font-normal cursor-pointer hover:underline">(Attach File)</span>
              </label>
              <div className="grid grid-cols-2 gap-3 h-20 items-center">
                {/* Visual Binary Input Wrapper Slot */}
                <label className="h-full border border-dashed border-slate-700 rounded-lg bg-[#0f1319] flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors group">
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  <span className="text-[10px] text-slate-500 font-medium">Attach File</span>
                </label>

                {/* Local Memory Preview Buffer Element Box */}
                <div className="h-full border border-slate-800 rounded-lg bg-[#0f1319] overflow-hidden flex items-center justify-center relative">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Payload preview buffer" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-600 font-mono text-center px-2">No media context cached</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-lg shadow-sky-600/10 flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-white animate-spin"></div>
                    Transmitting Stream...
                  </>
                ) : (
                  'New Report'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </Layout>
  );
}