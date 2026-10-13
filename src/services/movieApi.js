import { initialMovies } from '../data/initialMovies';

// Default working key for OMDb
const DEFAULT_API_KEY = 'trilogy';

export function getApiKey() {
  return localStorage.getItem('omdb_api_key') || DEFAULT_API_KEY;
}

export function setApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem('omdb_api_key', key.trim());
  } else {
    localStorage.removeItem('omdb_api_key');
  }
}

// Generate guaranteed SVG poster when external image fails or is "N/A"
export function createPosterFallback(title, genre = 'Cinema') {
  const cleanTitle = (title || 'Movie').slice(0, 24);
  const cleanGenre = (genre || 'Cinema').split(',')[0].trim();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="562" viewBox="0 0 380 562">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181824"/>
        <stop offset="50%" stop-color="#0f0f15"/>
        <stop offset="100%" stop-color="#08080c"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#E01B1B"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect x="16" y="16" width="348" height="530" rx="12" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
    <circle cx="190" cy="220" r="64" fill="rgba(224,27,27,0.12)" stroke="url(#gold)" stroke-width="2"/>
    <path d="M178 198 L212 220 L178 242 Z" fill="#E01B1B"/>
    <text x="190" y="340" fill="#F5F3EE" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">${cleanTitle.replace(/[&<>"']/g, '')}</text>
    <rect x="130" y="370" width="120" height="26" rx="13" fill="rgba(255,255,255,0.06)"/>
    <text x="190" y="388" fill="#f59e0b" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle" letter-spacing="1">${cleanGenre.toUpperCase()}</text>
    <text x="190" y="440" fill="#666" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">CINEVAULT CINEMA</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Convert OMDb result to app movie model
export function formatOmdbMovie(omdbItem, details = null) {
  const title = omdbItem.Title || 'Unknown Film';
  const poster = (omdbItem.Poster && omdbItem.Poster !== 'N/A') 
    ? omdbItem.Poster 
    : createPosterFallback(title, details?.Genre || 'Cinema');

  const rating = details?.imdbRating && details.imdbRating !== 'N/A' 
    ? details.imdbRating 
    : (7.5 + Math.round((Math.random() * 1.5) * 10) / 10).toFixed(1);

  const duration = details?.Runtime && details.Runtime !== 'N/A' 
    ? details.Runtime 
    : '2h 15m';

  const genre = details?.Genre && details.Genre !== 'N/A' 
    ? details.Genre 
    : 'Action, Drama';

  const primaryGenre = genre.split(',')[0].trim();

  return {
    id: omdbItem.imdbID || `cv-${Date.now()}`,
    imdbID: omdbItem.imdbID,
    title,
    year: omdbItem.Year || '2024',
    genre,
    primaryGenre,
    rating,
    duration,
    price: 320 + Math.floor(Math.random() * 4) * 20,
    director: details?.Director && details.Director !== 'N/A' ? details.Director : 'Acclaimed Director',
    actors: details?.Actors && details.Actors !== 'N/A' ? details.Actors : 'Star-studded Cast',
    plot: details?.Plot && details.Plot !== 'N/A' 
      ? details.Plot 
      : `Experience the captivating story of ${title} on the giant screen with immersive sound.`,
    poster,
    backdrop: poster,
    language: details?.Language && details.Language !== 'N/A' ? details.Language : 'English',
    certificate: details?.Rated && details.Rated !== 'N/A' ? details.Rated : 'UA',
    screen: 'Audi 1 — 4K Dolby Atmos Laser',
    votes: details?.imdbVotes || '10,000+',
    boxOffice: details?.BoxOffice || 'N/A',
    awards: details?.Awards || 'Acclaimed worldwide'
  };
}

// Search movies via OMDb API
export async function searchMoviesOnline(query) {
  if (!query || query.trim().length === 0) {
    return initialMovies;
  }

  const q = query.trim();
  const apiKey = getApiKey();

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(apiKey)}&s=${encodeURIComponent(q)}&type=movie`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    if (data.Response === 'True' && Array.isArray(data.Search)) {
      // Fetch brief details or format items
      return data.Search.slice(0, 10).map(item => formatOmdbMovie(item));
    } else {
      // Local search fallback if not found on OMDb
      const localMatches = initialMovies.filter(m => 
        m.title.toLowerCase().includes(q.toLowerCase()) ||
        m.genre.toLowerCase().includes(q.toLowerCase())
      );
      return localMatches;
    }
  } catch (err) {
    console.warn('OMDb fetch error, falling back to local dataset:', err);
    return initialMovies.filter(m => 
      m.title.toLowerCase().includes(q.toLowerCase()) ||
      m.genre.toLowerCase().includes(q.toLowerCase())
    );
  }
}

// Fetch single movie full details by IMDb ID
export async function fetchMovieDetails(imdbID) {
  // Check if it's already one of our rich initial movies
  const existing = initialMovies.find(m => m.imdbID === imdbID || m.id === imdbID);
  if (existing) {
    return existing;
  }

  const apiKey = getApiKey();
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(apiKey)}&i=${encodeURIComponent(imdbID)}&plot=full`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.Response === 'True') {
      return formatOmdbMovie(data, data);
    }
  } catch (err) {
    console.warn('Failed to fetch full OMDb detail:', err);
  }

  return existing || null;
}
