import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Upload from './components/Upload';
import Filter from './components/Filter';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    OSINT: true,
    HUMINT: true,
    IMINT: true
  });
  const [loading, setLoading] = useState(false);

  // Fetch data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/data`);
      const result = await response.json();
      setData(result);
      applyFilters(result, filters);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = (dataSet, activeFilters) => {
    const filtered = dataSet.filter(item => activeFilters[item.type]);
    setFilteredData(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(data, newFilters);
  };

  // Handle file upload
  const handleUploadSuccess = () => {
    fetchData(); // Refresh data after upload
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Multi-Source Intelligence Fusion Dashboard</h1>
        <p>Real-time intelligence data from multiple sources</p>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <Upload onUploadSuccess={handleUploadSuccess} />
          <Filter filters={filters} onFilterChange={handleFilterChange} />
          <div className="stats">
            <h3>Statistics</h3>
            <p>Total: <strong>{filteredData.length}</strong></p>
            <p>OSINT: <strong>{data.filter(d => d.type === 'OSINT').length}</strong></p>
            <p>HUMINT: <strong>{data.filter(d => d.type === 'HUMINT').length}</strong></p>
            <p>IMINT: <strong>{data.filter(d => d.type === 'IMINT').length}</strong></p>
          </div>
        </aside>

        <main className="main-content">
          {loading ? (
            <div className="loading">Loading data...</div>
          ) : (
            <Map data={filteredData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
