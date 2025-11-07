import { useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

import SearchBar from './components/SearchBar';
import AccommodationList from './components/AccommodationList';

function App() {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      // Assuming the excel columns match the object keys
      setAccommodations(data);
      setFilteredAccommodations(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleSearch = (searchCriteria) => {
    const { location } = searchCriteria;
    if (location === "") {
      setFilteredAccommodations(accommodations);
      return;
    }
    const filtered = accommodations.filter(acc => 
      // Ensure acc.location exists and is a string before calling toLowerCase
      acc.location && acc.location.toString().toLowerCase().includes(location.toLowerCase())
    );
    setFilteredAccommodations(filtered);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>엑셀 데이터 연동</h1>
      </header>
      
      <div className="file-upload-area">
        <label>검토 엑셀 데이터 연동:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>

      <SearchBar onSearch={handleSearch} />
      <AccommodationList accommodations={filteredAccommodations} />
    </div>
  );
}

export default App;
