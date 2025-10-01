import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon,
  Popup,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SectorMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSector, setSelectedSector] = useState('');
  const [availableSectors, setAvailableSectors] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzj8eXN23mkkdZypf8yBayEMBA7Bt-MM0D_6Jp-34JxQCsg-8UkjZqM9nBoI6dw8nrK/exec';

  // Cargar datos GeoJSON
  const loadGeoData = async (sector = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const url = sector 
        ? `${SCRIPT_URL}?SECTOR=${encodeURIComponent(sector)}`
        : SCRIPT_URL;
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setGeoData(data);
      
      // Extraer sectores únicos si es la primera carga
      if (availableSectors.length === 0 && data.features) {
        const sectors = [...new Set(data.features.map(feature => 
          feature.properties?.SECTOR || 
          feature.properties?.sector ||
          feature.properties?.Sector || 
          'Sin sector'
        ))];
        setAvailableSectors(sectors.sort());
      }
      
    } catch (err) {
      setError(`Error cargando datos: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGeoData();
  }, []);

  const handleSectorChange = (sector) => {
    setSelectedSector(sector);
    setSelectedFeature(null);
    loadGeoData(sector);
  };

  // Componente para ajustar el mapa a los datos
  const MapBoundsAdjuster = ({ data }) => {
    const map = useMap();
    
    useEffect(() => {
      if (data && data.features && data.features.length > 0) {
        const bounds = data.features.reduce((acc, feature) => {
          if (feature.geometry && feature.geometry.coordinates) {
            const coords = getCoordinatesFromGeometry(feature.geometry);
            coords.forEach(coord => {
              if (Array.isArray(coord) && coord.length >= 2) {
                acc.push([coord[1], coord[0]]); // [lat, lng] - CORREGIDO
              }
            });
          }
          return acc;
        }, []);
        
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      }
    }, [data, map]);
    
    return null;
  };

  // Función helper para extraer coordenadas de diferentes tipos de geometría
  const getCoordinatesFromGeometry = (geometry) => {
    if (!geometry || !geometry.coordinates) return [];
    
    const coords = [];
    const extractCoords = (arr) => {
      if (Array.isArray(arr)) {
        if (Array.isArray(arr[0]) && Array.isArray(arr[0][0])) {
          // Polygon o MultiPolygon
          arr.forEach(ring => {
            ring.forEach(coord => {
              if (Array.isArray(coord) && coord.length >= 2) {
                coords.push(coord);
              }
            });
          });
        } else if (Array.isArray(arr[0]) && typeof arr[0][0] === 'number') {
          // LineString o Polygon simple
          arr.forEach(coord => {
            if (Array.isArray(coord) && coord.length >= 2) {
              coords.push(coord);
            }
          });
        } else if (typeof arr[0] === 'number') {
          // Point
          coords.push(arr);
        }
      }
    };
    
    extractCoords(geometry.coordinates);
    return coords;
  };

  // Convertir coordenadas GeoJSON a formato Leaflet [lat, lng]
  const convertGeoJSONCoordsToLeaflet = (geoJSONCoords) => {
    return geoJSONCoords.map(coord => [coord[1], coord[0]]);
  };

  // Renderizar polígonos individualmente
  const renderPolygons = () => {
    if (!geoData || !geoData.features) return null;

    return geoData.features.map((feature, index) => {
      const { geometry, properties } = feature;
      const isSelected = selectedFeature && selectedFeature === feature;
      
      // Colores por sector
      const colorMap = {
        'NORTE': '#3388ff',
        'SUR': '#ff3333', 
        'ESTE': '#33ff33',
        'OESTE': '#ff33ff',
        'CENTRO': '#ffff33'
      };
      
      const sector = properties?.SECTOR || properties?.sector || properties?.Sector;
      const baseColor = colorMap[sector] || '#8977b9ff';
      
      const pathOptions = {
        color: isSelected ? '#ff9900' : '#ffffff',
        fillColor: isSelected ? '#ff9900' : baseColor,
        fillOpacity: isSelected ? 0.7 : 0.5,
        weight: isSelected ? 4 : 2,
        opacity: 1,
        dashArray: isSelected ? '' : '3'
      };

   

        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return geometry.coordinates.map((polygon, polyIndex) => {
          const polyCoords = polygon[0].map(coord => [coord[1], coord[0]]);
          console.log(polyCoords)
          return (
            <Polygon
              key={`multipolygon-${index}-${polyIndex}`}
              positions={polyCoords}
              pathOptions={pathOptions}
              eventHandlers={{
                click: () => {
                  setSelectedFeature(feature);
                }
              }}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3>Información del Polígono</h3>
                  <p><strong>Sector:</strong> {sector || 'N/A'}</p>
                  <p><strong>Fase:</strong> {properties?.FASE || properties?.fase || properties?.Fase || 'N/A'}</p>
                  <p><strong>ID:</strong> {properties?.ID || properties?.id || 'N/A'}</p>
                  {properties?.NOMBRE && <p><strong>Nombre:</strong> {properties.NOMBRE}</p>}
                  {properties?.AREA && <p><strong>Área:</strong> {properties.AREA} m²</p>}
                  <p><em>Parte {polyIndex + 1} de MultiPolygon</em></p>
                </div>
              </Popup>
            </Polygon>
          );
        });
      return null;
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <div>Cargando datos geoespaciales...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => loadGeoData(selectedSector)}>Reintentar</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Panel lateral */}
      <div style={{ 
        width: '350px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5',
        overflowY: 'auto',
        borderRight: '1px solid #ddd'
      }}>
        <h2>Filtro por SECTOR</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Seleccionar SECTOR:
          </label>
          <select 
            value={selectedSector}
            onChange={(e) => handleSectorChange(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="">Todos los sectores</option>
            {availableSectors.map(sector => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>Estadísticas</h3>
          <p><strong>Polígonos mostrados:</strong> {geoData?.metadata?.total || 0}</p>
          <p><strong>Sector filtrado:</strong> {selectedSector || 'Todos'}</p>
          <p><strong>Total original:</strong> {geoData?.metadata?.originalTotal || 0}</p>
        
        </div>

        {selectedFeature && (
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '15px', 
            borderRadius: '4px',
            border: '2px solid #2196f3'
          }}>
            <h3>Polígono Seleccionado</h3>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>
              <strong>Sector:</strong> {selectedFeature.properties?.SECTOR || 'N/A'}<br/>
             <strong>Parroquia:</strong> {selectedFeature.properties?.PARROQUIA || 'N/A'}<br/>
               <strong>Tipo Geometría:</strong> {selectedFeature.geometry?.type || 'N/A'}
            </div>
            <button 
              onClick={() => setSelectedFeature(null)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* Mapa */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[-3.995927, -79.201903]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {geoData && (
            <>
              {renderPolygons()}
              <MapBoundsAdjuster data={geoData} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default SectorMap;