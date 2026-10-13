import React, { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard, Smartphone, Banknote, ShieldCheck } from 'lucide-react';

export default function PaymentView({ 
  bookingData, 
  onBack, 
  onPaymentSuccess 
}) {
  const { movie, showtime, selectedSeats, seatsTotal, selectedSnacks, snacksTotal } = bookingData;
  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('Alex Mercer');
  const [upiId, setUpiId] = useState('alex@oksbi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isProcessing, setIsProcessing] = useState(false);

  const convenienceFee = 30;
  const grandTotal = seatsTotal + snacksTotal + convenienceFee;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('Booking session has expired! Please start over.');
          onBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onBack]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCardInput = (e) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = clean.match(/.{1,4}/g)?.join(' ') || clean;
    setCardNumber(formatted);
  };

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const bookingId = 'CV' + Date.now().toString(36).toUpperCase();
      const confirmedBooking = {
        bookingId,
        movie: movie.title,
        year: movie.year,
        genre: movie.genre,
        poster: movie.poster,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: showtime,
        seats: selectedSeats.map(s => s.id),
        screen: movie.screen || 'Audi 1 — IMAX Laser & Dolby Atmos',
        cinema: 'CineVault Multiplex — Hazratganj',
        snacks: selectedSnacks,
        total: grandTotal,
        paymentMethod: method.toUpperCase(),
        timestamp: Date.now()
      };
      onPaymentSuccess(confirmedBooking);
    }, 2000);
  };

  return (
    <div className="payment-page">
      <div style={{ gridColumn: '1 / -1' }}>
        <button className="back-btn" onClick={onBack} style={{ margin: '0 0 1.5rem 0' }}>
          <ChevronLeft size={16} /> Back to Concessions
        </button>
      </div>

      <div className="payment-summary-card">
        <h3>Order Summary</h3>

        <div className="summary-row">
          <span className="summary-label">Movie</span>
          <span className="summary-value">{movie.title}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Screen</span>
          <span className="summary-value">{movie.screen || 'Audi 1'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Showtime</span>
          <span className="summary-value">{showtime}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Seats ({selectedSeats.length})</span>
          <span className="summary-value">{selectedSeats.map(s => s.id).join(', ')}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Tickets Subtotal</span>
          <span className="summary-value">₹{seatsTotal}</span>
        </div>

        {selectedSnacks.length > 0 && (
          <div style={{ margin: '0.6rem 0', padding: '0.6rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>
              Snacks & Combos:
            </span>
            {selectedSnacks.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                <span style={{ color: '#ccc' }}>{s.qty} × {s.name}</span>
                <span style={{ color: 'var(--gold)' }}>₹{s.total}</span>
              </div>
            ))}
          </div>
        )}

        <div className="summary-row">
          <span className="summary-label">Convenience Fee & GST</span>
          <span className="summary-value">₹{convenienceFee}</span>
        </div>

        <div className="summary-row summary-total" style={{ marginTop: '0.8rem', paddingTop: '0.8rem' }}>
          <span>Total Payable</span>
          <span>₹{grandTotal}</span>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.75rem' }}>
          <ShieldCheck size={16} color="var(--green)" />
          <span>256-Bit Encrypted Secure Checkout</span>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Payment Method</h3>

        <div className="method-tabs">
          <button 
            type="button"
            className={`method-tab ${method === 'card' ? 'active' : ''}`}
            onClick={() => setMethod('card')}
          >
            <CreditCard size={15} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} /> Card
          </button>
          <button 
            type="button"
            className={`method-tab ${method === 'upi' ? 'active' : ''}`}
            onClick={() => setMethod('upi')}
          >
            <Smartphone size={15} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} /> UPI
          </button>
          <button 
            type="button"
            className={`method-tab ${method === 'cash' ? 'active' : ''}`}
            onClick={() => setMethod('cash')}
          >
            <Banknote size={15} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} /> Cash
          </button>
        </div>

        <form onSubmit={handlePay}>
          {method === 'card' && (
            <div>
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  placeholder="4532 8912 3456 7890" 
                  value={cardNumber} 
                  onChange={handleCardInput} 
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    maxLength={5} 
                    value={expiry} 
                    onChange={(e) => setExpiry(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input 
                    type="password" 
                    placeholder="•••" 
                    maxLength={4} 
                    value={cvv} 
                    onChange={(e) => setCvv(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input 
                  type="text" 
                  value={cardName} 
                  onChange={(e) => setCardName(e.target.value)} 
                  required 
                />
              </div>
            </div>
          )}

          {method === 'upi' && (
            <div>
              <div className="form-group">
                <label>Virtual Payment Address (VPA / UPI ID)</label>
                <input 
                  type="text" 
                  value={upiId} 
                  onChange={(e) => setUpiId(e.target.value)} 
                  placeholder="name@okaxis" 
                  required 
                />
              </div>
              <div className="upi-apps">
                {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                  <span 
                    key={app}
                    className={`upi-app ${selectedUpiApp === app ? 'selected' : ''}`}
                    onClick={() => setSelectedUpiApp(app)}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {method === 'cash' && (
            <div className="cash-info">
              <div className="cash-icon">💵</div>
              <h4>Pay at Cinema Counter</h4>
              <p>Your seats will be reserved immediately. Present your Booking ID at the box office 20 minutes before showtime.</p>
            </div>
          )}

          <div className="timer-bar">
            <span>⏳ Reservation locked for</span>
            <span className="timer-count">{formatTimer(timeLeft)}</span>
          </div>

          <button type="submit" className="btn-primary btn-pay">
            Pay ₹{grandTotal} & Confirm Tickets
          </button>
        </form>
      </div>

      {isProcessing && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div className="popup-spinner"></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.4rem' }}>
              Confirming Reservation...
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Securing seats & issuing CineVault cinema ticket
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
