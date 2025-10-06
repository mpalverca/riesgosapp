// components/GeoDataViewer.jsx
import React, { useState } from 'react';
import { useGeoData } from './useGeoData';

const GeoDataViewer = () => {
  const [parroquia, setParroquia] = useState('');
  const [sector, setSector] = useState('');
  
  const { data, loading, error } = useGeoData(parroquia, sector);

  const parroquiasDisponibles = [
    'sucre', 'punzara', 'el_valle', 
    'san_sebastian', 'sagrario', 'carigan'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // El hook se ejecutará automáticamente cuando cambien parroquia/sector
  };

  return (
    <div className="geo-data-viewer">
      <h2>Consulta de Datos Geoespaciales</h2>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="parroquia">Parroquia:</label>
          <select
            id="parroquia"
            value={parroquia}
            onChange={(e) => setParroquia(e.target.value)}
            required
          >
            <option value="">Selecciona una parroquia</option>
            {parroquiasDisponibles.map(p => (
              <option key={p} value={p}>
                {p.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sector">Sector (opcional):</label>
          <input
            id="sector"
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="Ej: centro, norte, etc."
          />
        </div>

        <button type="submit" disabled={loading || !parroquia}>
          {loading ? 'Cargando...' : 'Consultar'}
        </button>
      </form>

      {loading && <div className="loading">Cargando datos...</div>}
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div className="results">
          <h3>Resultados</h3>
          <div className="metadata">
            <p><strong>Parroquia:</strong> {data.metadata?.parroquia}</p>
            <p><strong>Sector:</strong> {data.metadata?.sector}</p>
            <p><strong>Total de elementos:</strong> {data.metadata?.total_features}</p>
            <p><strong>Archivos cargados:</strong> {data.metadata?.archivos_cargados}</p>
          </div>
          
          <div className="features-list">
            <h4>Features encontrados: {data.features?.length || 0}</h4>
            {/* Aquí puedes mostrar la lista de features o el mapa */}
            {data.features?.slice(0, 5).map((feature, index) => (
              <div key={index} className="feature-item">
                <pre>{JSON.stringify(feature.properties, null, 2)}</pre>
              </div>
            ))}
            {data.features && data.features.length > 5 && (
              <p>... y {data.features.length - 5} más</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoDataViewer;