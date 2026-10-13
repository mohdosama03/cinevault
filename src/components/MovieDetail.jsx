import React, { useState } from 'react';
import { Star, Clock, Calendar, Film, MapPin, ChevronLeft, Play } from 'lucide-react';
import { showTimings } from '../data/initialMovies';
import { createPosterFallback } from '../services/movieApi';

export default function MovieDetail({ movie, onBack, onProceedToSeats }) {
  const [selectedTime, setSelectedTime] = useState(showTimings[1]);
  const [imgSrc, setImgSrc] = useState(movie.poster);
  const [showTrailerAlert, setShowTrailerAlert] = useState(false);

  const handleImageError = () => {
    setImgSrc(createPosterFallback(movie.title, movie.genre));
  };

  const handleSelectSeats = () => {
    onProceedToSeats(movie, selectedTime);
  };

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={16} /> Back to Movies
      </button>

      <div className="detail-hero">
        <div className="detail-poster-wrap">
          <img 
            src={imgSrc} 
            alt={movie.title}
            onError={handleImageError}
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>

          <div className="detail-meta-row">
            <span className="detail-rating">
              <Star size={14} fill="#000" color="#000" />
              {movie.rating} IMDb
            </span>
            <span className="detail-genre">{movie.genre}</span>
            <span className="detail-duration">⏱ {movie.duration}</span>
            <span className="detail-genre">{movie.certificate || 'UA'}</span>
            <span className="detail-duration">📅 {movie.year}</span>
          </div>

          <p className="detail-desc">{movie.plot}</p>

          <div className="detail-crew">
            <div>
              <div className="crew-label">Director</div>
              <div className="crew-val">{movie.director || 'Nolan Studio'}</div>
            </div>
            <div>
              <div className="crew-label">Cast & Stars</div>
              <div className="crew-val">{movie.actors || 'Top Ensemble'}</div>
            </div>
          </div>

          <div className="detail-price-bar">
            <div>
              <p className="price-label">Ticket Base Price</p>
              <p className="price-value">₹{movie.price}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="price-label">Format & Screen</p>
              <p style={{ color: 'var(--white)', fontWeight: 600, fontSize: '0.95rem' }}>
                {movie.screen || 'Audi 1 — 4K Laser Dolby Atmos'}
              </p>
            </div>
          </div>

          <p className="detail-section-label">Select Show Time</p>
          <div className="timings-row">
            {showTimings.map((t) => (
              <button 
                key={t}
                className={`timing-btn ${selectedTime === t ? 'selected' : ''}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="detail-book-btn" onClick={handleSelectSeats}>
              🎟️ Select Seats for {selectedTime}
            </button>
            <button 
              className="btn-secondary" 
              style={{ padding: '1rem 1.6rem', borderRadius: '12px' }}
              onClick={() => setShowTrailerAlert(true)}
            >
              <Play size={16} fill="white" /> Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {showTrailerAlert && (
        <div className="modal-overlay" onClick={() => setShowTrailerAlert(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '1rem' }}>
              Official Trailer — {movie.title}
            </h3>
            <div style={{ 
              width: '100%', 
              aspectRatio: '16/9', 
              background: '#0a0a0f', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid var(--border)',
              marginBottom: '1.5rem'
            }}>
              <div>
                <Play size={48} color="var(--red)" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>4K Dolby Cinema Preview</p>
              </div>
            </div>
            <button className="btn-primary" onClick={() => setShowTrailerAlert(false)}>
              Close Trailer
            </button>
          </div>
        </div>
      )}

      {/* Cinema Hall Information */}
      <div style={{ marginTop: '3rem' }}>
        <div className="cinema-info">
          <span className="cinema-icon">📍</span>
          <div className="cinema-details">
            <h4>CineVault Multiplex — Hazratganj Grand Arena</h4>
            <p>MG Road, Hazratganj, Lucknow, UP 226001 &nbsp;|&nbsp; Dolby Atmos 360° • 4K Dual Laser Projection • Ultra Plush Recliners</p>
          </div>
        </div>
      </div>
    </div>
  );
}
