import React, { useState } from 'react';
import AccommodationList from './AccommodationList';
import './SiteCard.css';

function SiteCard({ siteName, reviews }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Assuming the '현장이미지' is the same for all reviews of a site.
  // Taking the first one.
  const siteImage = reviews.length > 0 ? reviews[0]['현장이미지'] : '';

  return (
    <div className="site-card" onClick={handleCardClick}>
      <div className="site-card-header">
        <img src={siteImage} alt={siteName} className="site-card-img" />
        <h2 className="site-card-title">{siteName}</h2>
      </div>
      {isExpanded && (
        <div className="site-card-body">
          <AccommodationList accommodations={reviews} />
        </div>
      )}
    </div>
  );
}

export default SiteCard;
