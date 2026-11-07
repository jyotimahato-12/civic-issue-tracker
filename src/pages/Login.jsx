import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await API.post('/auth/login', { email, password });
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid system access keys.');
    }
  };

  return (
    <div className="h-screen w-full bg-[#0f1319] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-slate-800 rounded-xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Gateway Ingestion Terminal</h1>
          <p className="text-xs text-slate-500">Provide credentials to decode dynamic access scopes</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">System Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-sky-500 transition-colors text-sm" 
              placeholder="operator@civic.internal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Security Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-sky-500 transition-colors text-sm" 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors mt-2 shadow-lg shadow-sky-600/10">
            Establish Secure Session
          </button>
        </form>
      </div>
    </div>
  );
}