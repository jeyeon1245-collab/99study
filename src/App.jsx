import { useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

import SearchBar from './components/SearchBar';
import SiteList from './components/SiteList';

function App() {
  const [sites, setSites] = useState({});
  const [filteredSites, setFilteredSites] = useState({});

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
      
      const groupedData = data.reduce((acc, item) => {
        const siteName = item['현장명'];
        if (!acc[siteName]) {
          acc[siteName] = [];
        }
        acc[siteName].push(item);
        return acc;
      }, {});
      
      setSites(groupedData);
      setFilteredSites(groupedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleSearch = (searchCriteria) => {
    const { location } = searchCriteria; // Corresponds to the site name from search bar
    if (location === "") {
      setFilteredSites(sites);
      return;
    }
    const filtered = Object.keys(sites)
      .filter(siteName => siteName.toLowerCase().includes(location.toLowerCase()))
      .reduce((obj, key) => {
        obj[key] = sites[key];
        return obj;
      }, {});
    setFilteredSites(filtered);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>현장리스트</h1>
      </header>
      
      <div className="file-upload-area">
        <label>엑셀 데이터 연동(백엔드):</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>

      <SearchBar onSearch={handleSearch} />
      <SiteList sites={filteredSites} />
    </div>
  );
}

export default App;
