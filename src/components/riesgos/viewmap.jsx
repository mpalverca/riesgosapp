// components/GeoMap.jsx
import React,{useState} from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const GeoMap = ({ geoData }) => {
  if (!geoData || !geoData.features || geoData.features.length === 0) {
    return <div>No hay datos geoespaciales para mostrar</div>;
  }

  // Estilo para las geometrías
  const geoJsonStyle = {
    color: '#3388ff',
    weight: 2,
    opacity: 0.7,
    fillOpacity: 0.1
  };

  // Calcular centro del mapa basado en los datos
  const calculateCenter = () => {
    // Aquí podrías calcular el centro basado en las geometrías
    // Por ahora usamos un centro por defecto de Loja
    return [-3.99313, -79.20422];
  };

  return (
    <div className="geo-map">
      <MapContainer
        center={calculateCenter()}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={geoData}
          style={geoJsonStyle}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const popupContent = Object.entries(feature.properties)
                .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                .join('<br/>');
              layer.bindPopup(popupContent);
            }
          }}
        />
      </MapContainer>
    </div>
  );
};

export default GeoMap;