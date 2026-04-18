import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import './Map.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Color mapping for intelligence types
const TYPE_COLORS = {
  OSINT: '#3b82f6',    // Blue
  HUMINT: '#fbbf24',   // Yellow
  IMINT: '#ef4444'     // Red
};

const resolveImageSrc = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${API_URL}${imagePath}`;
};

function Map({ data }) {
  // Calculate map center
  const getMapCenter = () => {
    if (data.length === 0) return [20, 0];
    
    const avgLat = data.reduce((sum, d) => sum + d.lat, 0) / data.length;
    const avgLng = data.reduce((sum, d) => sum + d.lng, 0) / data.length;
    return [avgLat, avgLng];
  };

  const center = getMapCenter();

  return (
    <MapContainer
      center={center}
      zoom={4}
      className="map-container"
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {data.map((item) => (
        <CircleMarker
          key={item._id}
          center={[item.lat, item.lng]}
          radius={8}
          fillColor={TYPE_COLORS[item.type] || '#666'}
          color={TYPE_COLORS[item.type] || '#666'}
          weight={2}
          opacity={0.8}
          fillOpacity={0.7}
        >
          <Tooltip>
            <div className="marker-tooltip">
              <h4>{item.title}</h4>
              <p className="marker-type">{item.type}</p>
              {item.description && <p>{item.description}</p>}
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '4px' }} 
                />
              )}
              <p className="marker-coords">
                {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
              </p>
            </div>
          </Tooltip>

          <Popup className="marker-popup">
            <div className="popup-content" style={{ minWidth: '180px' }}>
              <h3>{item.title}</h3>
              <p>
                <strong>Type:</strong>{' '}
                <span
                  style={{
                    background: TYPE_COLORS[item.type] || '#6b7280',
                    color: '#111827',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  {item.type}
                </span>
              </p>
              <p><strong>Location:</strong> {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</p>
              {item.description && (
                <p><strong>Description:</strong> {item.description}</p>
              )}
              {item.image && (
                <img 
                  src={resolveImageSrc(item.image)} 
                  alt={item.title} 
                  width="180"
                  style={{ marginTop: '10px', borderRadius: '6px' }}
                />
              )}
              {item.source && <p className="marker-source">Source: {item.source}</p>}
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {data.length === 0 && (
        <div className="map-empty">
          <p>No intelligence data to display. Upload a file to get started!</p>
        </div>
      )}
    </MapContainer>
  );
}

export default Map;
