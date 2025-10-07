// components/GeoDataViewer.jsx
import React, { useState } from 'react';

const GeoDataViewer = ({ onSearch }) => {
  const [parroquia, setParroquia] = useState('');
  const [sector, setSector] = useState('');
const [clave, setClave] = useState('');
const [tramite, setTramite] = useState('');
  const parroquiasDisponibles = [
    'sucre', 'punzara', 'el_valle', 
    'san_sebastian', 'sagrario', 'carigan'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parroquia) {
      console.log('🔍 Iniciando búsqueda:', { parroquia, sector });
      onSearch(parroquia, sector);
    }
  };

  const handleParroquiaChange = (e) => {
    const nuevaParroquia = e.target.value;
    setParroquia(nuevaParroquia);
    // Si cambia la parroquia, limpiar el sector
    setSector('');
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
            onChange={handleParroquiaChange}
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
          <label htmlFor="sector">Sector:</label>
          <input
            id="sector"
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="Ej: centro, norte, etc."
          />
          <label htmlFor="Tramite">Trámite:</label>
          <input
            id="sector"
            type="text"
            value={sector}
            onChange={(e) => setTramite(e.target.value)}
            placeholder="Ej: 12435-2025, 12345-2024, etc."
          />
          <label htmlFor="Clave catastral">Clave catastral:</label>
          <input
            id="sector"
            type="text"
            value={sector}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Ej: centro, norte, etc."
          />
        </div>
        

        <button 
          type="submit" 
          disabled={!parroquia}
          className="search-button"
        >
          Consultar Datos
        </button>
      </form>

      <div className="search-info">
        <p><strong>Parroquia seleccionada:</strong> {parroquia || 'Ninguna'}</p>
        <p><strong>Sector:</strong> {sector || 'Todos'}</p>
      </div>
    </div>
  );
};

export default GeoDataViewer;