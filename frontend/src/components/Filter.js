import React from 'react';
import './Filter.css';

function Filter({ filters, onFilterChange }) {
  const handleToggle = (type) => {
    const newFilters = {
      ...filters,
      [type]: !filters[type]
    };
    onFilterChange(newFilters);
  };

  const intelligenceTypes = [
    { key: 'OSINT', label: 'OSINT', color: '#3b82f6', description: 'Open Source Intelligence' },
    { key: 'HUMINT', label: 'HUMINT', color: '#fbbf24', description: 'Human Intelligence' },
    { key: 'IMINT', label: 'IMINT', color: '#ef4444', description: 'Imagery Intelligence' }
  ];

  return (
    <div className="filter-container">
      <h2>🎯 Filters</h2>
      
      <div className="filter-list">
        {intelligenceTypes.map((type) => (
          <div key={type.key} className="filter-item">
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filters[type.key]}
                onChange={() => handleToggle(type.key)}
                className="filter-checkbox"
              />
              <span
                className="filter-color"
                style={{ backgroundColor: type.color }}
              ></span>
              <div className="filter-text">
                <p className="filter-main">{type.label}</p>
                <p className="filter-desc">{type.description}</p>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="filter-info">
        <p className="info-text">
          <strong>💡 Tip:</strong> Use filters to show/hide specific intelligence types
        </p>
      </div>
    </div>
  );
}

export default Filter;
