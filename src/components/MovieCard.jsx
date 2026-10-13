import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { createPosterFallback } from '../services/movieApi';

export default function MovieCard({ movie, onSelect }) {
  const [imgSrc, setImgSrc] = useState(movie.poster);

  const handleImageError = () => {
    // Generate clean SVG fallback poster if CDN image fails or has hotlink issue
    setImgSrc(createPosterFallback(movie.title, movie.genre));
  };

  return (
    <div 
      className="movie-card" 
      onClick={() => onSelect(movie)}
      id={`movie-${movie.id || movie.imdbID}`}
    >
      <div className="movie-poster">
        <img 
          src={imgSrc} 
          alt={movie.title}
          className="movie-poster-img"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />
        <div className="movie-poster-overlay"></div>
        
        {movie.rating && (
          <div className="movie-rating-badge">
            <Star size={12} fill="#D4AF37" color="#D4AF37" />
            <span>{movie.rating}</span>
          </div>
        )}

        {movie.imdbID && (
          <span className="movie-imdb-tag">IMDb</span>
        )}
      </div>

      <div className="movie-info">
        <div>
          <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-genre">{movie.primaryGenre || movie.genre?.split(',')[0]}</span>
            <span className="movie-duration">⏱ {movie.duration || '2h 15m'}</span>
            {movie.price && <span className="movie-price-tag">₹{movie.price}</span>}
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(movie);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
