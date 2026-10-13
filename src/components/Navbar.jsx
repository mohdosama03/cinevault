import React from 'react';
import { Search, Ticket, KeyRound } from 'lucide-react';

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  searchQuery, 
  setSearchQuery, 
  isSearching, 
  bookingsCount, 
  onOpenBookings, 
  onOpenApiModal 
}) {
  return (
    <nav className="nav" id="main-nav">
      <div className="nav-left">
        <div 
          className="nav-logo" 
          onClick={() => setCurrentPage('home')}
        >
          CINE<span>VAULT</span>
          <small>REACT</small>
        </div>

        <div className="nav-links">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${currentPage === 'movies' ? 'active' : ''}`}
            onClick={() => setCurrentPage('movies')}
          >
            Movies
          </button>
          <button 
            className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
            onClick={() => setCurrentPage('contact')}
          >
            Contact
          </button>
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-search">
          <input 
            type="text" 
            placeholder="Search IMDb movies..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentPage !== 'movies' && e.target.value.trim().length > 0) {
                setCurrentPage('movies');
              }
            }}
            id="nav-search-input"
          />
          {isSearching ? (
            <div className="search-spinner"></div>
          ) : (
            <Search className="search-icon" size={16} />
          )}
        </div>

        <button 
          className="nav-btn-icon api-badge"
          onClick={onOpenApiModal}
          title="Configure IMDb / OMDb API Key"
        >
          <KeyRound size={14} />
          <span>IMDb API</span>
        </button>

        <button 
          className="nav-btn-icon" 
          onClick={onOpenBookings}
          title="View Confirmed Tickets"
        >
          <Ticket size={14} />
          <span>Tickets {bookingsCount > 0 && `(${bookingsCount})`}</span>
        </button>
      </div>
    </nav>
  );
}
