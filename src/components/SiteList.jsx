import React from 'react';
import SiteCard from './SiteCard';
import './SiteList.css';

function SiteList({ sites }) {
  const siteNames = Object.keys(sites);

  if (siteNames.length === 0) {
    return <p className="no-results">데이터를 업로드해주세요.</p>;
  }

  return (
    <div className="site-list">
      {siteNames.map(siteName => (
        <SiteCard key={siteName} siteName={siteName} reviews={sites[siteName]} />
      ))}
    </div>
  );
}

export default SiteList;
