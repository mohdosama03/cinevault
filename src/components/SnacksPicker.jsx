import React, { useState } from 'react';
import { ChevronLeft, Plus, Minus } from 'lucide-react';
import { snackOptions } from '../data/initialMovies';

export default function SnacksPicker({ onBack, onProceedToPayment }) {
  const [quantities, setQuantities] = useState({});

  const updateQuantity = (id, delta) => {
    const current = quantities[id] || 0;
    const next = Math.max(0, current + delta);
    setQuantities({ ...quantities, [id]: next });
  };

  const selectedSnackList = snackOptions
    .filter(s => (quantities[s.id] || 0) > 0)
    .map(s => ({
      ...s,
      qty: quantities[s.id],
      total: s.price * quantities[s.id]
    }));

  const snacksTotal = selectedSnackList.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="snacks-page">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={16} /> Back to Seat Selection
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem' }}>🍿 Cinema Concessions & Combos</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Delivered fresh to your cinema seat before the feature starts</p>
      </div>

      <div className="snacks-grid">
        {snackOptions.map((snack) => {
          const qty = quantities[snack.id] || 0;
          return (
            <div 
              key={snack.id} 
              className={`snack-card ${qty > 0 ? 'active' : ''}`}
            >
              <div>
                <div className="snack-top">
                  <div className="snack-emoji">{snack.emoji}</div>
                  <span className="snack-tag">{snack.tag}</span>
                </div>
                <h3>{snack.name}</h3>
                <p>{snack.desc}</p>
              </div>

              <div className="snack-bottom">
                <strong>₹{snack.price}</strong>
                <div className="snack-counter">
                  <button onClick={() => updateQuantity(snack.id, -1)} aria-label="Decrease">
                    <Minus size={14} />
                  </button>
                  <span>{qty}</span>
                  <button onClick={() => updateQuantity(snack.id, 1)} aria-label="Increase">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="seats-summary">
        <div>
          <span>Combos Added: <strong>{selectedSnackList.length} items</strong></span>
          <span>Snacks Subtotal: <strong>₹{snacksTotal}</strong></span>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => onProceedToPayment(selectedSnackList, snacksTotal)}
          style={{ width: 'auto', padding: '0.85rem 2rem' }}
        >
          {snacksTotal > 0 ? 'Continue with Snacks →' : 'Skip & Continue to Payment →'}
        </button>
      </div>
    </div>
  );
}
