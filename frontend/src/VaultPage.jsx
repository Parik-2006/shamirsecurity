// frontend/src/VaultPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL ||
  return (
    <div className="modern-card">
      {/* HEADER */}
      <header className="vault-header" style={{ marginBottom: 25 }}>
        <div>
          <h2 style={{ margin: 0 }}>{username}'s Vault</h2>
          <p style={{ margin: 0, color: '#888' }}>
            {vaultData.length} secret{vaultData.length !== 1 ? 's' : ''} stored
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="modern-btn" onClick={() => navigate('/registration-vault')}>Add New Password</button>
          <button className="modern-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* ERROR */}
      {error && <div className="modern-error">{error}</div>}

      {/* VAULT TABLE AREA: loading, empty, or table */}
      <div style={{ minHeight: 200 }}>
        {loading ? (
          <div className="modern-loading">Loading...</div>
        ) : vaultData.length === 0 ? (
          <div className="modern-empty">Your vault is empty.</div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {vaultData.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{item.service}</td>
                  <td>{item.username}</td>
                  <td>{item.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
        <div style={{ color: 'red', marginBottom: 20 }}>
          {error}
        </div>
      )}



      {/* VAULT TABLE AREA: loading, empty, or table */}
      <div style={{ minHeight: 200 }}>
        {loading ? (
          <div>Loading...</div>
        ) : vaultData.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: '#888',
            }}
          >
            Your vault is empty.
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#23272f',
            }}
          >
            <thead>
              <tr>
                <th style={{ color: '#FFD66B' }}>Service</th>
                <th style={{ color: '#FFD66B' }}>Username</th>
                <th style={{ color: '#FFD66B' }}>Password</th>
              </tr>
            </thead>
            <tbody>
              {vaultData.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{item.service}</td>
                  <td>{item.username}</td>
                  <td>{item.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}