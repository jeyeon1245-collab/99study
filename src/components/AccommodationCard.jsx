import React from 'react';
import './AccommodationCard.css';

function AccommodationCard({ accommodation }) {
  return (
    <div className="card">
      <img src={accommodation.imageUrl} alt={accommodation.name} className="card-img" />
      <div className="card-body">
        <h3 className="card-title">{accommodation.name}</h3>
        <p className="card-location">{accommodation.location}</p>
        <p className="card-rating"> 검토중요도⭐ {accommodation.rating}</p>
        <p className="card-area">{accommodation.price.toLocaleString()} ㎡ </p>
      </div>
    </div>
  );
}

export default AccommodationCard;
