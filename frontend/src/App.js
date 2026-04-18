import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Apply filters
  const applyFilters = useCallback((dataSet, activeFilters) => {
    const filtered = dataSet.filter(item => activeFilters[item.type]);
    setFilteredData(filtered);
  }, []);

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/data`);
      const result = await response.json();
      setData(result);
      applyFilters(result, filtersRef.current);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [applyFilters]);

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
  }, [fetchData]);

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
