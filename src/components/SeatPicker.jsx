import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cinemaSeatLayout } from '../data/initialMovies';

export default function SeatPicker({ movie, showtime, onBack, onProceedToSnacks }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (rowLetter, seatNumber, multiplier) => {
    const seatId = `${rowLetter}${seatNumber}`;
    const exists = selectedSeats.find(s => s.id === seatId);

    if (exists) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    } else {
      const price = Math.round(movie.price * multiplier);
      setSelectedSeats([...selectedSeats, { id: seatId, row: rowLetter, number: seatNumber, price }]);
    }
  };

  const totalPrice = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat before continuing!');
      return;
    }
    onProceedToSnacks(selectedSeats, totalPrice);
  };

  return (
    <div className="seats-page">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={16} /> Back to Film Details
      </button>

      <div className="seats-info">
        <h2>{movie.title}</h2>
        <p>{showtime} &nbsp;|&nbsp; Audi 1 — Dolby Atmos & Laser</p>
      </div>

      <div className="screen-wrap">
        <div className="screen">
          <span>CINEMA SCREEN</span>
          <div className="screen-glow"></div>
        </div>
      </div>

      <div className="seat-legend">
        <span className="legend-item">
          <span className="legend-dot available"></span> Available
        </span>
        <span className="legend-item">
          <span className="legend-dot booked"></span> Reserved
        </span>
        <span className="legend-item">
          <span className="legend-dot selected"></span> Selected
        </span>
      </div>

      <div className="seats-container">
        {cinemaSeatLayout.map((row) => {
          const half = Math.floor(row.seats / 2);
          const firstHalf = Array.from({ length: half }, (_, i) => i + 1);
          const secondHalf = Array.from({ length: row.seats - half }, (_, i) => i + half + 1);

          const renderSeatButton = (num) => {
            const isBooked = row.booked.includes(num);
            const seatId = `${row.row}${num}`;
            const isSelected = selectedSeats.some(s => s.id === seatId);

            let btnClass = 'seat available';
            if (isBooked) btnClass = 'seat booked';
            else if (isSelected) btnClass = 'seat selected';

            return (
              <button
                key={num}
                className={btnClass}
                disabled={isBooked}
                onClick={() => toggleSeat(row.row, num, row.priceMultiplier)}
                title={`${row.row}${num} (${row.type} - ₹${Math.round(movie.price * row.priceMultiplier)})`}
              >
                {num}
              </button>
            );
          };

          return (
            <div key={row.row} className="seat-row">
              <span className="row-label">{row.row}</span>
              {firstHalf.map(renderSeatButton)}
              <div className="seat-gap"></div>
              {secondHalf.map(renderSeatButton)}
            </div>
          );
        })}
      </div>

      <div className="seats-summary">
        <div>
          <span>Selected Seats: <strong>{selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : 'None'}</strong></span>
          <span>Seat Subtotal: <strong>₹{totalPrice}</strong></span>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleContinue}
          style={{ width: 'auto', padding: '0.85rem 2rem' }}
        >
          Add Snacks & Continue →
        </button>
      </div>
    </div>
  );
}
