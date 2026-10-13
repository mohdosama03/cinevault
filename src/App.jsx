import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MovieCard from './components/MovieCard';
import MovieDetail from './components/MovieDetail';
import SeatPicker from './components/SeatPicker';
import SnacksPicker from './components/SnacksPicker';
import PaymentView from './components/PaymentView';
import TicketView from './components/TicketView';
import ApiKeyModal from './components/ApiKeyModal';
import MyBookingsModal from './components/MyBookingsModal';
import { initialMovies } from './data/initialMovies';
import { searchMoviesOnline, fetchMovieDetails } from './services/movieApi';
import { Sparkles, Clapperboard, Film, ArrowRight, ShieldCheck, Mail, Phone, MapPin, Clock } from 'lucide-react';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Comedy', 'Thriller'];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [movies, setMovies] = useState(initialMovies);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Booking Flow State
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsTotal, setSeatsTotal] = useState(0);
  const [selectedSnacks, setSelectedSnacks] = useState([]);
  const [snacksTotal, setSnacksTotal] = useState(0);
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  // LocalStorage Bookings
  const [savedBookings, setSavedBookings] = useState(() => {
    try {
      const data = localStorage.getItem('cv_bookings');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  // Contact Form
  const [contactSent, setContactSent] = useState(false);

  // Live IMDb / OMDb Search with Debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMovies(initialMovies);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchMoviesOnline(searchQuery);
        setMovies(results.length > 0 ? results : []);
      } catch (err) {
        console.error('Error during search:', err);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Navigate & scroll to top
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // When user clicks a movie card
  const handleSelectMovie = async (movie) => {
    // If it's a search result without full metadata, fetch full IMDb details
    if (movie.imdbID && (!movie.director || movie.director === 'Acclaimed Director')) {
      const detailed = await fetchMovieDetails(movie.imdbID);
      setSelectedMovie(detailed || movie);
    } else {
      setSelectedMovie(movie);
    }
    navigateTo('detail');
  };

  // Proceed to Seats
  const handleProceedToSeats = (movie, showtime) => {
    setSelectedMovie(movie);
    setSelectedShowtime(showtime);
    navigateTo('seats');
  };

  // Proceed to Snacks
  const handleProceedToSnacks = (seats, total) => {
    setSelectedSeats(seats);
    setSeatsTotal(total);
    navigateTo('snacks');
  };

  // Proceed to Payment
  const handleProceedToPayment = (snacks, total) => {
    setSelectedSnacks(snacks);
    setSnacksTotal(total);
    navigateTo('payment');
  };

  // On Successful Payment
  const handlePaymentSuccess = (ticket) => {
    setConfirmedTicket(ticket);
    const updated = [ticket, ...savedBookings];
    setSavedBookings(updated);
    try {
      localStorage.setItem('cv_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    navigateTo('ticket');
  };

  // Reset booking to start another
  const handleBookAnother = () => {
    setSelectedMovie(null);
    setSelectedShowtime('');
    setSelectedSeats([]);
    setSeatsTotal(0);
    setSelectedSnacks([]);
    setSnacksTotal(0);
    setConfirmedTicket(null);
    navigateTo('home');
  };

  // Filtered movies by genre
  const filteredMovies = movies.filter(m => {
    if (selectedGenre === 'All') return true;
    const g = (m.genre || '') + ' ' + (m.primaryGenre || '');
    return g.toLowerCase().includes(selectedGenre.toLowerCase());
  });

  return (
    <div className="cinevault-app">
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        bookingsCount={savedBookings.length}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      <main style={{ minHeight: '80vh' }}>
        {/* ===== HOME PAGE ===== */}
        {currentPage === 'home' && (
          <div>
            <section className="hero">
              <div className="hero-bg">
                <img 
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80" 
                  alt="Cinema Backdrop"
                  className="hero-backdrop-img"
                />
                <div className="hero-gradient"></div>
                <div className="film-strip top"></div>
                <div className="film-strip bottom"></div>
                <div className="hero-orb orb1"></div>
                <div className="hero-orb orb2"></div>
              </div>

              <div className="hero-content">
                <div className="hero-badge-row">
                  <span className="hero-eyebrow">🎬 CineVault React Premiere</span>
                  <div className="hero-live-indicator">
                    <span className="pulse-dot"></span>
                    <span>IMDb Live Connected</span>
                  </div>
                </div>

                <h1 className="hero-title">
                  Book Your<br /><em>Perfect</em><br />Experience
                </h1>

                <p className="hero-sub">
                  Ultra-luxurious 4K laser projection, Dolby Atmos acoustic precision, and gourmet recliner dining. Book your seats online now.
                </p>

                <div className="hero-actions">
                  <button 
                    className="btn-primary btn-hero"
                    onClick={() => navigateTo('movies')}
                  >
                    Explore All Movies <ArrowRight size={18} />
                  </button>
                  <button 
                    className="btn-secondary btn-hero"
                    onClick={() => handleSelectMovie(initialMovies[0])}
                  >
                    Featured: Oppenheimer
                  </button>
                </div>
              </div>

              <div className="ticker-wrap">
                <div className="ticker">
                  <span>NOW SHOWING</span><span>★</span><span>DOLBY ATMOS 360°</span><span>★</span>
                  <span>IMDb TOP RATED</span><span>★</span><span>4K DUAL LASER</span><span>★</span>
                  <span>VIP RECLINERS</span><span>★</span><span>NOW SHOWING</span><span>★</span>
                  <span>BOOK ONLINE</span><span>★</span><span>DOLBY ATMOS 360°</span><span>★</span>
                  <span>IMAX EXPERIENCE</span><span>★</span><span>CINEVAULT LUXURY</span><span>★</span>
                </div>
              </div>
            </section>

            {/* Featured Movies Section */}
            <section className="movies-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Now Showing</h2>
                  <p className="section-subtitle">Real IMDb ratings, verified posters, and instant seat reservations</p>
                </div>
                <button className="see-all" onClick={() => navigateTo('movies')}>
                  View All Films <ArrowRight size={16} />
                </button>
              </div>

              <div className="movies-grid">
                {initialMovies.slice(0, 4).map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onSelect={handleSelectMovie} 
                  />
                ))}
              </div>
            </section>

            {/* Promo Features */}
            <section className="promo-section">
              <div className="promo-card">
                <div className="promo-icon">🍿</div>
                <h3>Artisanal Concessions</h3>
                <p>Enjoy freshly popped gourmet caramel crunch, warm cheese nachos, and handcrafted milkshakes delivered directly to your recliner.</p>
              </div>
              <div className="promo-card">
                <div className="promo-icon">🎟️</div>
                <h3>Seamless Digital Passes</h3>
                <p>Instant QR ticket generation with Apple/Google wallet compatibility. Skip box office lines and walk directly to your screen.</p>
              </div>
              <div className="promo-card">
                <div className="promo-icon">🔊</div>
                <h3>Dolby Atmos & 4K Laser</h3>
                <p>Cutting-edge Christie dual laser projection and 64-speaker Dolby Atmos surround sound calibrated for total sensory immersion.</p>
              </div>
            </section>
          </div>
        )}

        {/* ===== MOVIES CATALOG PAGE ===== */}
        {currentPage === 'movies' && (
          <div className="movies-section" style={{ paddingTop: '7rem' }}>
            <div className="page-header" style={{ padding: '0 0 2rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 className="section-title">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Movie Catalog'}
                  </h1>
                  <p className="section-subtitle">
                    {filteredMovies.length} title{filteredMovies.length !== 1 ? 's' : ''} available • Live IMDb database enabled
                  </p>
                </div>

                <button 
                  className="btn-secondary" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  onClick={() => setIsApiModalOpen(true)}
                >
                  <ShieldCheck size={14} color="var(--green)" /> API: Connected (OMDb/IMDb)
                </button>
              </div>

              {/* Genre Tabs */}
              <div className="filter-tabs" style={{ marginTop: '1.8rem' }}>
                {GENRES.map((genre) => (
                  <button 
                    key={genre}
                    className={`filter-btn ${selectedGenre === genre ? 'active' : ''}`}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {isSearching ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div className="popup-spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>Searching IMDb and fetching high-resolution movie posters...</p>
              </div>
            ) : filteredMovies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <Film size={48} color="var(--muted)" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>No Films Found</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Try searching for another movie title, actor, or genre.</p>
                <button className="btn-primary" style={{ width: 'auto' }} onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}>
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              <div className="movies-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard 
                    key={movie.id || movie.imdbID} 
                    movie={movie} 
                    onSelect={handleSelectMovie} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MOVIE DETAIL VIEW ===== */}
        {currentPage === 'detail' && selectedMovie && (
          <div style={{ paddingTop: '6.5rem' }}>
            <MovieDetail 
              movie={selectedMovie}
              onBack={() => navigateTo('movies')}
              onProceedToSeats={handleProceedToSeats}
            />
          </div>
        )}

        {/* ===== SEAT SELECTION VIEW ===== */}
        {currentPage === 'seats' && selectedMovie && (
          <div style={{ paddingTop: '6.5rem' }}>
            <SeatPicker 
              movie={selectedMovie}
              showtime={selectedShowtime}
              onBack={() => navigateTo('detail')}
              onProceedToSnacks={handleProceedToSnacks}
            />
          </div>
        )}

        {/* ===== SNACKS VIEW ===== */}
        {currentPage === 'snacks' && (
          <div style={{ paddingTop: '6.5rem' }}>
            <SnacksPicker 
              onBack={() => navigateTo('seats')}
              onProceedToPayment={handleProceedToPayment}
            />
          </div>
        )}

        {/* ===== PAYMENT VIEW ===== */}
        {currentPage === 'payment' && selectedMovie && (
          <div style={{ paddingTop: '6.5rem' }}>
            <PaymentView 
              bookingData={{
                movie: selectedMovie,
                showtime: selectedShowtime,
                selectedSeats,
                seatsTotal,
                selectedSnacks,
                snacksTotal
              }}
              onBack={() => navigateTo('snacks')}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        )}

        {/* ===== TICKET VIEW ===== */}
        {currentPage === 'ticket' && confirmedTicket && (
          <div style={{ paddingTop: '6.5rem' }}>
            <TicketView 
              ticket={confirmedTicket}
              onBookAnother={handleBookAnother}
            />
          </div>
        )}

        {/* ===== CONTACT PAGE ===== */}
        {currentPage === 'contact' && (
          <div className="contact-page" style={{ paddingTop: '7rem' }}>
            <h1 className="page-title">Contact & Cinema Locations</h1>
            
            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <h4>CineVault Multiplex</h4>
                    <p>Grand Arena Mall, MG Road, Hazratganj, Lucknow, UP 226001</p>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <h4>Phone Hotline</h4>
                    <p>+91 7237017281 (24/7 Support)</p>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <h4>Customer Care</h4>
                    <p>hello@cinevault.in</p>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">🕐</span>
                  <div>
                    <h4>Show Timings</h4>
                    <p>Monday – Sunday: 9:30 AM – 1:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-wrap">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '1.2rem' }}>
                  Send Us A Message
                </h3>
                {contactSent ? (
                  <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid var(--green)', padding: '1.5rem', borderRadius: '10px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--green)', fontWeight: 600, fontSize: '1.1rem' }}>✓ Message Received!</p>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Our cinema concierge team will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setContactSent(true); }}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" placeholder="John Doe" required />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="form-group">
                      <label>Message / Inquiries</label>
                      <textarea rows={4} placeholder="Corporate booking, VIP recliners, private screening..." required></textarea>
                    </div>
                    <button type="submit" className="btn-primary">
                      Submit Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Global Modals */}
      <ApiKeyModal 
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onKeyUpdated={() => {
          if (searchQuery) {
            searchMoviesOnline(searchQuery).then(setMovies);
          }
        }}
      />

      <MyBookingsModal 
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={savedBookings}
        onSelectTicket={(ticket) => {
          setConfirmedTicket(ticket);
          navigateTo('ticket');
        }}
      />
    </div>
  );
}
