import React, { useState } from 'react';
import { getApiKey, setApiKey } from '../services/movieApi';
import { KeyRound, Check, X, ShieldCheck, Sparkles } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(keyInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onKeyUpdated();
      onClose();
    }, 1200);
  };

  const handleResetDefault = () => {
    setKeyInput('trilogy');
    setApiKey('trilogy');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onKeyUpdated();
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
          <div style={{ 
            background: 'rgba(212, 175, 55, 0.15)', 
            padding: '0.6rem', 
            borderRadius: '10px', 
            color: 'var(--gold)' 
          }}>
            <KeyRound size={24} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.04em' }}>
              Movie API Settings (IMDb / OMDb)
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
              Real-time movie metadata & high-resolution posters
            </p>
          </div>
        </div>

        <div style={{ 
          background: 'var(--bg2)', 
          border: '1px solid var(--border)', 
          borderRadius: '10px', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--green)', fontWeight: 600, marginBottom: '0.3rem' }}>
            <ShieldCheck size={16} />
            <span>Active Live Connection: Online</span>
          </div>
          <p style={{ color: 'var(--muted)', lineHeight: '1.5' }}>
            CineVault is connected to the live IMDb/OMDb database using the default verified key. You can also paste your own private key from <a href="https://www.omdbapi.com/apikey.aspx" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>omdbapi.com</a>.
          </p>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>API Key</label>
            <input 
              type="text" 
              value={keyInput} 
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="e.g. trilogy or your own key"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1.5 }}>
              {savedSuccess ? <><Check size={16} /> Saved!</> : 'Save & Refresh'}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ flex: 1 }}
              onClick={handleResetDefault}
            >
              Reset Default
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
