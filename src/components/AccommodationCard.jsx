import React, { useState } from 'react';
import './AccommodationCard.css';

function AccommodationCard({ accommodation }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (e) => {
    e.stopPropagation(); // Prevent SiteCard's onClick from firing
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <img src={accommodation.검토이미지} alt={accommodation['검토 세부']} className="card-img" />
      <div className="card-body">
        <p className="card-item">검토 넘버: {accommodation['검토 넘버']}</p>
        <p className="card-item">검토 측면: {accommodation['검토 측면']}</p>
        <p className="card-item">검토 세부: {accommodation['검토 세부']}</p>
        
        {isExpanded && (
          <div className="card-details">
            <p className="card-item">검토일: {accommodation.검토일}</p>
            <p className="card-item">동구분: {accommodation.동구분}</p>
            <p className="card-item">층: {accommodation.층}</p>
            <p className="card-item">검토기준: {accommodation.검토기준}</p>
            <p className="card-item">부재구분: {accommodation.부재구분}</p>
            <p className="card-location">위치: {accommodation.위치}</p>
            <p className="card-item">내용: {accommodation.내용}</p>
            <p className="card-item">모델링 기준: {accommodation['모델링 기준']}</p>
            <p className="card-rating">상태: {accommodation.상태}</p>
            <p className="card-item">진행중: {accommodation.진행중}</p>
            <p className="card-area">이슈총량: {accommodation.이슈총량}</p>
            <p className="card-item">진행내용: {accommodation.진행내용}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccommodationCard;
