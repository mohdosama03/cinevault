import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="nav-logo" onClick={() => onNavigate('home')}>
            CINE<span>VAULT</span>
          </div>
          <p>
            Experience pure cinematic perfection. Featuring 4K laser projection, Dolby Atmos 360-degree spatial audio, and gourmet concession dining.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Now Showing</a></li>
            <li><a href="#movies" onClick={(e) => { e.preventDefault(); onNavigate('movies'); }}>Explore Catalog</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>Multiplex Location</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Experience</h4>
          <ul>
            <li><a href="#movies" onClick={(e) => { e.preventDefault(); onNavigate('movies'); }}>IMAX with Laser</a></li>
            <li><a href="#movies" onClick={(e) => { e.preventDefault(); onNavigate('movies'); }}>Dolby Cinema</a></li>
            <li><a href="#movies" onClick={(e) => { e.preventDefault(); onNavigate('movies'); }}>VIP Recliner Lounge</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Cinema Hotline</h4>
          <ul>
            <li style={{ color: 'var(--muted)' }}>+91 7237017281</li>
            <li style={{ color: 'var(--muted)' }}>hello@cinevault.in</li>
            <li style={{ color: 'var(--muted)' }}>Hazratganj, Lucknow, UP</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 CineVault Cinema Network. All rights reserved. Powered by React & IMDb/OMDb API.</span>
        <span>Built with Luxury Aesthetics & Dolby Precision</span>
      </div>
    </footer>
  );
}
