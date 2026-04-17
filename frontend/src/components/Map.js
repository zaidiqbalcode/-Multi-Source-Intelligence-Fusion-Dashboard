import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import './Map.css';

// Color mapping for intelligence types
const TYPE_COLORS = {
  OSINT: '#3b82f6',    // Blue
  HUMINT: '#fbbf24',   // Yellow
  IMINT: '#ef4444'     // Red
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
            <div className="popup-content">
              <h3>{item.title}</h3>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Location:</strong> {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</p>
              {item.description && (
                <p><strong>Description:</strong> {item.description}</p>
              )}
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '100%', marginTop: '10px', borderRadius: '4px' }}
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
