import React from 'react';
import { X, Ticket, Calendar, Clock, MapPin, Printer } from 'lucide-react';

export default function MyBookingsModal({ isOpen, onClose, bookings, onSelectTicket }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(224, 27, 27, 0.15)', padding: '0.6rem', borderRadius: '10px', color: 'var(--red)' }}>
            <Ticket size={24} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.04em' }}>
              My Booked Tickets
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
              Your confirmed CineVault cinema reservations
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No tickets booked yet</p>
            <p style={{ fontSize: '0.85rem' }}>Select a film and reserve your seats to see your tickets here!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((b) => (
              <div 
                key={b.bookingId}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: 'var(--red)', 
                      color: 'white', 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '4px', 
                      fontWeight: 700 
                    }}>
                      {b.bookingId}
                    </span>
                    <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{b.movie}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} /> {b.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} /> {b.time}
                    </span>
                    <span>Seats: <strong style={{ color: 'var(--white)' }}>{b.seats.join(', ')}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Total Paid</div>
                    <strong style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>₹{b.total}</strong>
                  </div>
                  <button 
                    className="btn-secondary"
                    style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      onSelectTicket(b);
                      onClose();
                    }}
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
