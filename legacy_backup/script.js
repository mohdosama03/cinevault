// ===== MOVIE DATA =====
const movies = [
  {
    id: 1, title: "DARK NEXUS", genre: "Sci-Fi",
    rating: "8.9", duration: "2h 28m",
    emoji: "🌌", price: 350,
    desc: "In a future where consciousness can be uploaded, one hacker discovers the dark truth behind humanity's digital afterlife. A visceral neo-noir thriller that questions the very nature of identity.",
    color: "#1a1a3e",
    cast: "Keanu Morales, Zara Chen, Dev Patel",
    language: "English",
    certificate: "UA",
  },
  {
    id: 2, title: "INFERNO RISING", genre: "Action",
    rating: "8.2", duration: "2h 10m",
    emoji: "🔥", price: 300,
    desc: "A retired mercenary is forced back into action when a global criminal network threatens to detonate a chain of super-volcanoes. Non-stop adrenaline from start to finish.",
    color: "#3e1a1a",
    cast: "Marcus Kane, Priya Sharma, Jin-ho Park",
    language: "English | Hindi",
    certificate: "A",
  },
  {
    id: 3, title: "THE SILENCE BETWEEN", genre: "Drama",
    rating: "9.1", duration: "1h 58m",
    emoji: "🎭", price: 280,
    desc: "Two strangers meet on a train from Mumbai to Delhi and over 18 hours, reveal secrets that will change both their lives forever. A masterpiece of quiet human connection.",
    color: "#1e1e1a",
    cast: "Deepika Nair, Irrfan Shah, Neha Kapoor",
    language: "Hindi",
    certificate: "U",
  },
  {
    id: 4, title: "HOLLOW GROUND", genre: "Horror",
    rating: "7.8", duration: "1h 52m",
    emoji: "👁️", price: 320,
    desc: "A family's move to an isolated farmhouse turns nightmarish when they discover the land beneath has a horrifying memory. Slow-burn dread at its most suffocating.",
    color: "#1a1e1a",
    cast: "Anya Winters, Thomas Reed, Mira Gupta",
    language: "English",
    certificate: "A",
  },
  {
    id: 5, title: "LUCKY BREAKS", genre: "Comedy",
    rating: "7.5", duration: "1h 45m",
    emoji: "😂", price: 250,
    desc: "When a down-on-his-luck wedding planner accidentally books five couples for the same day, chaos and love collide in the most hilarious way possible.",
    color: "#1e1a2e",
    cast: "Ranveer Malhotra, Katrina Joshi, Ayush Trivedi",
    language: "Hindi",
    certificate: "U/A",
  },
  {
    id: 6, title: "ORBIT SEVEN", genre: "Sci-Fi",
    rating: "8.5", duration: "2h 35m",
    emoji: "🚀", price: 380,
    desc: "Earth's last defense station goes dark. A rescue mission reveals a truth that will rewrite the history of space exploration—and human civilization itself.",
    color: "#0e1e2e",
    cast: "Sofia Alves, James Okafor, Liu Wei",
    language: "English",
    certificate: "UA",
  },
];

const timings = ["10:00 AM", "1:00 PM", "4:00 PM", "6:30 PM", "9:30 PM"];
const seatLayout = [
  { row: "A", seats: 10, booked: [2, 5] },
  { row: "B", seats: 10, booked: [1, 3, 7] },
  { row: "C", seats: 12, booked: [4, 8, 11] },
  { row: "D", seats: 12, booked: [2, 6, 9, 12] },
  { row: "E", seats: 14, booked: [5, 7, 13] },
  { row: "F", seats: 14, booked: [1, 4, 10] },
  { row: "G", seats: 14, booked: [3, 8, 14] },
  { row: "H", seats: 12, booked: [2, 6, 11] },
];

// ===== STATE =====
let currentPage = 'home';
let previousPage = 'home';
let selectedMovie = null;
let selectedTime = null;
let selectedSeats = [];
let selectedSnacks = [];
let snacksTotal = 0;
let paymentTimer = null;

// ===== PAGE NAVIGATION =====
function showPage(page) {
  previousPage = currentPage;
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'payment') startPaymentTimer();
}

function goBack() {
  showPage(previousPage === currentPage ? 'home' : previousPage);
}

// ===== RENDER MOVIES =====
function renderMovieCard(movie, delay = 0) {
  return `
    <div class="movie-card" onclick="openMovieDetail(${movie.id})" style="animation-delay:${delay}s">
      <div class="movie-poster">
        <div class="movie-poster-bg" style="background: linear-gradient(135deg, ${movie.color} 0%, #111 100%)">
          <span>${movie.emoji}</span>
          <div class="movie-poster-overlay"></div>
        </div>
        <div class="movie-rating-badge">⭐ ${movie.rating}</div>
      </div>
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-meta">
          <span class="movie-genre">${movie.genre}</span>
          <span class="movie-duration">⏱ ${movie.duration}</span>
        </div>
        <button class="btn-primary" onclick="event.stopPropagation(); openMovieDetail(${movie.id})">Book Now</button>
      </div>
    </div>
  `;
}

function initMovieGrids() {
  const homeGrid = document.getElementById('homeMoviesGrid');
  const allGrid = document.getElementById('allMoviesGrid');
  homeGrid.innerHTML = movies.slice(0, 4).map((m, i) => renderMovieCard(m, i * 0.08)).join('');
  allGrid.innerHTML = movies.map((m, i) => renderMovieCard(m, i * 0.06)).join('');
}

// ===== FILTER =====
function filterMovies(query) {
  const q = query.toLowerCase();
  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q)
  );
  document.getElementById('allMoviesGrid').innerHTML =
    filtered.map((m, i) => renderMovieCard(m, i * 0.05)).join('');
  if (query && currentPage !== 'movies') showPage('movies');
}

function filterByGenre(genre, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const list = genre === 'All' ? movies : movies.filter(m => m.genre === genre);
  document.getElementById('allMoviesGrid').innerHTML =
    list.map((m, i) => renderMovieCard(m, i * 0.06)).join('');
}

// ===== MOVIE DETAIL =====
function openMovieDetail(id) {
  selectedMovie = movies.find(m => m.id === id);
  selectedTime = null;
  const d = selectedMovie;
  document.getElementById('movieDetail').innerHTML = `
    <div class="detail-hero">
      <div class="detail-poster" style="background: linear-gradient(135deg, ${d.color} 0%, #0a0a0a 100%)">
        <span>${d.emoji}</span>
        <div class="detail-poster-overlay"></div>
      </div>
      <div class="detail-info">
        <div class="detail-title">${d.title}</div>
        <div class="detail-meta-row">
          <span class="detail-rating">⭐ ${d.rating}</span>
          <span class="detail-genre">${d.genre}</span>
          <span class="detail-duration">⏱ ${d.duration}</span>
          <span class="detail-genre">${d.certificate}</span>
        </div>
        <p class="detail-desc">${d.desc}</p>
        <div class="detail-price-bar">
          <div>
            <p class="price-label">Starting from</p>
            <p class="price-value">₹${d.price}</p>
          </div>
        </div>
        <p class="detail-section-label">Select Show Time</p>
        <div class="timings-row" id="timingsRow">
          ${timings.map(t => `<button class="timing-btn" onclick="selectTiming(this, '${t}')">${t}</button>`).join('')}
        </div>
        <p class="detail-section-label">Language: ${d.language} &nbsp;|&nbsp; Cast: ${d.cast}</p>
        <br>
        <button class="detail-book-btn" onclick="goToSeats()">🎟️ Select Seats</button>
      </div>
    </div>
    <div class="trailer-section">
      <h3>Trailer</h3>
      <div class="trailer-box">
        <div class="trailer-play" onclick="alert('Trailer would play here in a full build!')">▶</div>
        <p class="trailer-label">Official Trailer • ${d.duration}</p>
      </div>
    </div>
    <div style="max-width:1200px;margin:2rem auto;padding:0 2rem;">
      <div class="cinema-info">
        <span class="cinema-icon">📍</span>
        <div class="cinema-details">
          <h4>CineVault Multiplex — Hazratganj</h4>
          <p>MG Road, Hazratganj, Lucknow, UP 226001 &nbsp;|&nbsp; Dolby Atmos • 4K Laser • Recliner Seats</p>
        </div>
      </div>
    </div>
  `;
  showPage('detail');
}

function selectTiming(btn, time) {
  document.querySelectorAll('.timing-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedTime = time;
}

function goToSeats() {
  if (!selectedTime) {
    alert('Please select a show time first!');
    return;
  }
  selectedSeats = [];
  renderSeats();
  document.getElementById('seatMovieTitle').textContent = selectedMovie.title;
  document.getElementById('seatShowTime').textContent = `${selectedTime} — ₹${selectedMovie.price} per seat`;
  showPage('seats');
}

// ===== SEAT LAYOUT =====
function renderSeats() {
  const container = document.getElementById('seatsContainer');
  container.innerHTML = seatLayout.map(row => {
    const half = Math.floor(row.seats / 2);
    const firstHalf = Array.from({ length: half }, (_, i) => i + 1);
    const secondHalf = Array.from({ length: row.seats - half }, (_, i) => i + half + 1);

    function seatBtn(n) {
      const isBooked = row.booked.includes(n);
      const cls = isBooked ? 'booked' : 'available';
      return `<button class="seat ${cls}" id="seat-${row.row}${n}" title="${row.row}${n}"
        ${isBooked ? 'disabled' : `onclick="toggleSeat('${row.row}', ${n})"`}>${row.row}${n}</button>`;
    }

    return `<div class="seat-row">
      <span class="row-label">${row.row}</span>
      ${firstHalf.map(seatBtn).join('')}
      <div class="seat-gap"></div>
      ${secondHalf.map(seatBtn).join('')}
    </div>`;
  }).join('');
  updateSeatSummary();
}

function toggleSeat(row, num) {
  const id = `${row}${num}`;
  const btn = document.getElementById(`seat-${id}`);
  const idx = selectedSeats.indexOf(id);
  if (idx === -1) {
    selectedSeats.push(id);
    btn.classList.remove('available');
    btn.classList.add('selected');
  } else {
    selectedSeats.splice(idx, 1);
    btn.classList.remove('selected');
    btn.classList.add('available');
  }
  updateSeatSummary();
}

function updateSeatSummary() {
  const total = selectedSeats.length * selectedMovie.price;
  document.getElementById('selectedSeatsDisplay').textContent =
    selectedSeats.length ? selectedSeats.join(', ') : 'None';
  document.getElementById('totalPriceDisplay').textContent = `₹${total}`;
}

function proceedToSnacks() {
  if (!selectedSeats.length) {
    alert('Please select at least one seat!');
    return;
  }
  selectedSnacks = [];
  snacksTotal = 0;
  document.querySelectorAll('.snack-card').forEach(c => c.classList.remove('active'));
  document.getElementById('snacksTotalDisplay').textContent = '₹0';
  showPage('snacks');
}

// ===== SNACKS =====
function toggleSnack(card, name, price) {
  card.classList.toggle('active');
  const idx = selectedSnacks.findIndex(s => s.name === name);
  if (idx === -1) {
    selectedSnacks.push({ name, price });
    snacksTotal += price;
  } else {
    selectedSnacks.splice(idx, 1);
    snacksTotal -= price;
  }
  document.getElementById('snacksTotalDisplay').textContent = `₹${snacksTotal}`;
}

// ===== PAYMENT =====
function buildPaymentSummary() {
  const ticketTotal = selectedSeats.length * selectedMovie.price;
  const grandTotal = ticketTotal + snacksTotal;
  const rows = [
    ['Movie', selectedMovie.title],
    ['Date', new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Time', selectedTime],
    ['Seats', selectedSeats.join(', ')],
    ['Tickets', `${selectedSeats.length} × ₹${selectedMovie.price}`],
  ];
  if (selectedSnacks.length) {
    selectedSnacks.forEach(s => rows.push([s.name, `₹${s.price}`]));
  }
  rows.push(['TOTAL', `₹${grandTotal}`]);

  return rows.map((r, i) => `
    <div class="summary-row ${i === rows.length - 1 ? 'summary-total' : ''}">
      <span class="summary-label">${r[0]}</span>
      <span class="summary-value">${r[1]}</span>
    </div>
  `).join('');
}

// Intercept showPage for payment
const _showPage = showPage;
window.showPage = function(page) {
  if (page === 'payment') {
    document.getElementById('paymentSummary').innerHTML = buildPaymentSummary();
  }
  _showPage(page);
};

function selectMethod(btn, method) {
  document.querySelectorAll('.method-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.method-form').forEach(f => f.classList.remove('active'));
  document.getElementById(`method-${method}`).classList.add('active');
}

function formatCard(input) {
  let v = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
  let matches = v.match(/\d{4,16}/g);
  let match = (matches && matches[0]) || '';
  let parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  input.value = parts.length ? parts.join(' ') : v;
}

function startPaymentTimer() {
  if (paymentTimer) clearInterval(paymentTimer);
  let seconds = 600;
  function tick() {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const el = document.getElementById('paymentTimer');
    if (el) el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (seconds <= 0) {
      clearInterval(paymentTimer);
      alert('Session expired! Please start over.');
      resetAndGoHome();
    }
    seconds--;
  }
  tick();
  paymentTimer = setInterval(tick, 1000);
}

function processPayment() {
  const popup = document.getElementById('successPopup');
  popup.style.display = 'flex';
  clearInterval(paymentTimer);
  setTimeout(() => {
    popup.style.display = 'none';
    generateTicket();
    showPage('ticket');
  }, 2500);
}

// ===== TICKET =====
function generateTicket() {
  const bookingId = 'CV' + Date.now().toString(36).toUpperCase();
  const ticketTotal = selectedSeats.length * selectedMovie.price + snacksTotal;
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  document.getElementById('ticketMovieName').textContent = selectedMovie.title;
  document.getElementById('bookingIdDisplay').textContent = `Booking ID: ${bookingId}`;

  const details = [
    ['Date', date],
    ['Time', selectedTime],
    ['Seats', selectedSeats.join(', ')],
    ['Screen', 'Audi 3 — Dolby Atmos'],
    ['Cinema', 'CineVault Hazratganj'],
    ['Total Paid', `₹${ticketTotal}`],
  ];

  document.getElementById('ticketDetails').innerHTML = details.map(d => `
    <div class="ticket-detail-item">
      <div class="ticket-detail-label">${d[0]}</div>
      <div class="ticket-detail-value">${d[1]}</div>
    </div>
  `).join('');

  // Generate fake QR
  generateQR(bookingId);

  // Save to localStorage
  const bookings = JSON.parse(localStorage.getItem('cvBookings') || '[]');
  bookings.push({ bookingId, movie: selectedMovie.title, date, time: selectedTime, seats: selectedSeats, total: ticketTotal });
  localStorage.setItem('cvBookings', JSON.stringify(bookings));
}

function generateQR(id) {
  const qr = document.getElementById('qrCode');
  qr.innerHTML = '';
  // Simple deterministic QR-like pattern from booking ID
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const size = 10;
  for (let i = 0; i < size * size; i++) {
    const px = document.createElement('div');
    px.className = 'qr-pixel';
    // Corner markers
    const r = Math.floor(i / size), c = i % size;
    const isCorner = (r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3);
    const val = isCorner ? 1 : ((seed * (i + 1) * 7) % 3 === 0 ? 1 : 0);
    px.style.background = val ? '#000' : '#fff';
    qr.appendChild(px);
  }
}

function printTicket() {
  window.print();
}

function resetAndGoHome() {
  selectedMovie = null;
  selectedTime = null;
  selectedSeats = [];
  selectedSnacks = [];
  snacksTotal = 0;
  clearInterval(paymentTimer);
  showPage('home');
}

// ===== INIT =====
initMovieGrids();
