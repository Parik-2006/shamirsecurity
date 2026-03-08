import React, { useState, useEffect, useCallback } from 'react';
import { motion as FM } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { getErrorMessage } from './utils';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com';

// --- Particles config and background ---
const particlesConfig = {
  fullScreen: false,
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color: { value: ['#6366f1', '#8b5cf6', '#06b6d4'] },
    links: { color: '#6366f1', distance: 100, enable: true, opacity: 0.06, width: 1 },
    move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: true, speed: 0.5, straight: false },
    number: { density: { enable: true, area: 1200 }, value: 30 },
    opacity: { value: { min: 0.05, max: 0.25 } },
    shape: { type: 'circle' },
    size: { value: { min: 1, max: 2 } },
  },
  detectRetina: true
};

const ParticlesBackground = () => {
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setEngineReady(true);
    });
  }, []);

  if (!engineReady) return null;

  return (
    <Particles
      id="tsparticles-vault"
      options={particlesConfig}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
};
// --- Floating shapes placeholder (if used in VaultPage) ---
const FloatingShapes = ({ zIndex }) => null;

// --- Icons (copy from VaultPage) ---
const Icons = {
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
  ),
  refresh: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  vault: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="8" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="16"/><line x1="8" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="16" y2="12"/></svg>
  ),
  key: (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
  ),
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  eyeOff: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m1 1 22 22M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/></svg>
  ),
  copy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
};

// --- Helper: getServiceColor, getServiceDomain, ServiceLogo, PasswordRow, LoadingSpinner ---
// ...existing code from VaultPage for these helpers...

// --- Main RegistrationVaultPage ---
export default function RegistrationVaultPage() {
  // Always render vault UI, even if credentials are missing
  const username = localStorage.getItem('vaultUser') || 'User';
  const goldenKey = localStorage.getItem('goldenKey') || '';
  const [vaultData, setVaultData] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('view');
  const [refreshing, setRefreshing] = useState(false);
  const [newService, setNewService] = useState('');
  const [newServiceUser, setNewServiceUser] = useState('');
  const [newPass, setNewPass] = useState('');

  const fetchVault = useCallback(async (isRefresh = false) => {
    if (!goldenKey) { setLoading(false); return; }
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    let timeoutId;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_URL}/api/get_passwords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, golden_key: goldenKey }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.status === 'success') {
        setVaultData(data.passwords);
      } else {
        setError('Failed to load vault: ' + (data.message || 'Unknown error'));
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        setError('Vault fetch timed out. Please try again or check your connection.');
      } else {
        setError('Network error loading vault.');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      setRefreshing(false);
    }
  }, [username, goldenKey]);

  useEffect(() => {
    fetchVault();
  }, [fetchVault]);

  const handleAddPassword = async () => {
    if (!newService || !newPass) {
      setError('Please fill Service name and Password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/add_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          golden_key: goldenKey,
          service_name: newService,
          service_username: newServiceUser,
          password_to_save: newPass
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setNewService('');
        setNewServiceUser('');
        setNewPass('');
        await fetchVault();
        setPage('view');
      } else {
        setError('Save Error: ' + (data.message || 'Unknown error'));
      }
    } catch (e) {
      setError('Save failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = (idx) => {
    setVisiblePasswords((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Add Entry Form View
  if (page === 'add') {
    return (
      <div className="app-wrapper">
        <ParticlesBackground />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, width: '90%', maxWidth: '420px' }}>
          <div className="glass-card card-glow" style={{ padding: '30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="form-icon gradient-icon">{Icons.lock}</div>
              <h2 className="gradient-text-animated" style={{ margin: '12px 0 0 0', fontSize: '1.5rem' }}>Add New Secret</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '6px' }}>Encrypt and store securely in your vault</p>
            </div>
            {error && (<div className="error-message" style={{ marginBottom: '15px' }}>{error}</div>)}
            <div>
              <div className="input-group">
                <div className="input-icon">
                  {/* Service icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <input id="vault-service" name="service" placeholder="Service (e.g. GitHub, Netflix)" autoComplete="organization" value={newService} onChange={e => setNewService(e.target.value)} />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  {/* User icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input id="vault-service-username" name="serviceUsername" placeholder="Service Username (optional)" autoComplete="username" value={newServiceUser} onChange={e => setNewServiceUser(e.target.value)} />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  {/* Password icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input type="password" id="vault-password" name="password" placeholder="Password to encrypt" autoComplete="new-password" value={newPass} onChange={e => setNewPass(e.target.value)} />
              </div>
              <div style={{ marginTop: '20px' }}>
                <button onClick={handleAddPassword} disabled={loading} style={{ background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '12px 32px', marginTop: 8, cursor: 'pointer', boxShadow: '0 2px 12px #0006', transition: 'background 0.2s' }}>Save Secret</button>
                <button onClick={() => setPage('view')} style={{ marginLeft: 16, background: 'transparent', color: '#FFD66B', border: '2px solid #FFD66B', borderRadius: 12, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Vault View
  return (
    <div className="app-wrapper">
      <ParticlesBackground />
      <div className="vault-header">
        <div className="vault-title gradient-text-animated">Welcome, {username}!</div>
        <button className="add-secret-btn" onClick={() => setPage('add')} style={{ background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '12px 32px', marginTop: 8, cursor: 'pointer', boxShadow: '0 2px 12px #0006', transition: 'background 0.2s' }}>{Icons.plus} Add Secret</button>
      </div>
      <div className="vault-table-wrapper">
        {loading ? (
          <LoadingSpinner text="Loading your vault..." />
        ) : error ? (
          <div className="error-message" style={{ margin: '40px auto', color: '#ef4444', fontWeight: 600, textAlign: 'center' }}>{error}</div>
        ) : (
          <table className="vault-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vaultData.length === 0 ? (
                <tr><td colSpan={4} style={{ color: '#64748b', textAlign: 'center', padding: '40px 0' }}>No secrets saved yet. Click "Add Secret" to store your first password!</td></tr>
              ) : (
                vaultData.map((item, idx) => (
                  <PasswordRow key={item.id || idx} item={item} index={idx} isVisible={!!visiblePasswords[idx]} onToggleVisibility={handleToggleVisibility} />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

