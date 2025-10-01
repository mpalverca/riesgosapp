import React, { useEffect, useState } from 'react';

function Geologia() {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // URL de tu Google Apps Script
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbwh2st9wxNwzXstDJwoED_X9ysEf2N4XayqDfqRG0rqmVAR8wuFmjdjOqnYfICNf142/exec';
        
        console.log('Cargando desde Apps Script:', scriptUrl);
        const response = await fetch(scriptUrl);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        //const data = await response.json();
        const data = {};
        if (data.error) {
          throw new Error(data.error);
        }
        
        console.log('Datos cargados exitosamente');
        setGeoData(data);
        
      } catch (error) {
        console.error('Error cargando GeoJSON:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadGeoJSON();
  }, []);

  // Renderizado del componente...
  return (
    <div style={{ padding: '20px' }}>
      <h2>Datos Geológicos</h2>
      
      {loading && <div>Cargando datos...</div>}
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {geoData && (
        <div>
          <h3>GeoJSON Cargado</h3>
          <p><strong>Polígonos:</strong> {geoData.features?.length || 0}</p>
          <details>
            <summary>Ver datos completos</summary>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              overflow: 'auto',
              maxHeight: '400px',
              fontSize: '12px'
            }}>
              {JSON.stringify(geoData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default Geologia;