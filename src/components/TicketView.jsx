import React, { useMemo } from 'react';
import { Printer, Home, CheckCircle2 } from 'lucide-react';

export default function TicketView({ ticket, onBookAnother }) {
  // Deterministic QR pattern generator based on booking ID
  const qrGrid = useMemo(() => {
    const seed = (ticket.bookingId || 'CV100').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const size = 10;
    const grid = [];
    for (let i = 0; i < size * size; i++) {
      const r = Math.floor(i / size);
      const c = i % size;
      const isCorner = (r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3);
      const isFilled = isCorner ? true : ((seed * (i + 1) * 7) % 3 === 0);
      grid.push(isFilled);
    }
    return grid;
  }, [ticket.bookingId]);

  return (
    <div className="ticket-page">
      <div className="success-animation">
        <div className="success-ring"></div>
        <div className="success-check">✓</div>
      </div>

      <h2 className="ticket-heading">Booking Confirmed!</h2>
      <p style={{ color: 'var(--muted)', marginTop: '-1.5rem', marginBottom: '2rem' }}>
        Show this digital pass at the cinema turnstile for direct entry.
      </p>

      <div className="ticket-card" id="printable-ticket">
        <div className="ticket-top">
          <div className="ticket-logo">CINEVAULT</div>
          <div className="ticket-badge">CONFIRMED PASS</div>
        </div>

        <div className="ticket-movie-name">{ticket.movie}</div>

        <div className="ticket-divider">
          <div className="ticket-notch left"></div>
          <div className="ticket-dotted"></div>
          <div className="ticket-notch right"></div>
        </div>

        <div className="ticket-details-grid">
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Date</div>
            <div className="ticket-detail-value">{ticket.date}</div>
          </div>
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Showtime</div>
            <div className="ticket-detail-value">{ticket.time}</div>
          </div>
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Reserved Seats</div>
            <div className="ticket-detail-value" style={{ color: 'var(--gold)' }}>
              {Array.isArray(ticket.seats) ? ticket.seats.join(', ') : ticket.seats}
            </div>
          </div>
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Format / Audi</div>
            <div className="ticket-detail-value">{ticket.screen || 'Audi 1 — Dolby Atmos'}</div>
          </div>
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Cinema Location</div>
            <div className="ticket-detail-value">{ticket.cinema || 'CineVault Multiplex'}</div>
          </div>
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Amount Paid</div>
            <div className="ticket-detail-value" style={{ color: 'var(--green)' }}>
              ₹{ticket.total}
            </div>
          </div>
        </div>

        <div className="ticket-qr">
          <div className="qr-box">
            {qrGrid.map((filled, idx) => (
              <div 
                key={idx} 
                className="qr-pixel" 
                style={{ background: filled ? '#000' : '#fff' }}
              />
            ))}
          </div>
          <p className="booking-id">Booking ID: {ticket.bookingId}</p>
        </div>
      </div>

      <div className="ticket-actions">
        <button 
          className="btn-primary" 
          onClick={() => window.print()}
        >
          <Printer size={16} /> Print / Save Ticket
        </button>
        <button 
          className="btn-secondary" 
          onClick={onBookAnother}
        >
          <Home size={16} /> Book Another Film
        </button>
      </div>
    </div>
  );
}
