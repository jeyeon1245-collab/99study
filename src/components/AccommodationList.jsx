import React from 'react';
import AccommodationCard from './AccommodationCard';
import './AccommodationList.css';

function AccommodationList({ accommodations }) {
  if (accommodations.length === 0) {
    return <p className="no-results">검색 결과가 없습니다.</p>;
  }

  return (
    <div className="accommodation-list">
      {accommodations.map(acc => (
        <AccommodationCard key={acc['검토 넘버']} accommodation={acc} />
      ))}
    </div>
  );
}

export default AccommodationList;
