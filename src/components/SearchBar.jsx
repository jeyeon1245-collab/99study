import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [location, setLocation] = useState('');

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    onSearch({ location: newLocation.trim() });
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        placeholder="현장 검색" 
        value={location} 
        onChange={handleLocationChange} 
      />
    </div>
  );
}

export default SearchBar;
