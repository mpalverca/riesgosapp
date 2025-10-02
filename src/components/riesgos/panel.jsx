import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon,
  Popup,
  useMap
} from 'react-leaflet';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { Search, Clear, MyLocation } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';

let position = [-3.9939, -79.2042];

const CatastroMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClaveCata, setSelectedClaveCata] = useState('');
  const [claveCataInput, setClaveCataInput] = useState('');
  const [availableClavesCata, setAvailableClavesCata] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [lodLevel, setLodLevel] = useState('medium');

  const catastro_url = `https://script.google.com/macros/s/AKfycbzLimEiQHmryQDuU6w6o1mGscpBxPDxXxDrweZXrw7jy55_duEHZ8q3cTcW061Kzr8A/exec`;

  // Configuración de LOD (Level of Detail)
  const lodConfig = {
    low: {
      simplification: 0.01,
      pointReduction: 0.7,
      maxPointsPerPolygon: 50
    },
    medium: {
      simplification: 0.005,
      pointReduction: 0.4,
      maxPointsPerPolygon: 100
    },
    high: {
      simplification: 0.001,
      pointReduction: 0,
      maxPointsPerPolygon: Infinity
    }
  };

  // Función para simplificar geometría según LOD
  const simplifyGeometry = (geometry, lod) => {
    const config = lodConfig[lod];
    if (!geometry || !geometry.coordinates) return geometry;

    const simplifyCoordinates = (coords, tolerance) => {
      if (coords.length <= config.maxPointsPerPolygon) return coords;
      
      const simplified = [];
      const step = Math.ceil(coords.length / config.maxPointsPerPolygon);
      
      for (let i = 0; i < coords.length; i += step) {
        simplified.push(coords[i]);
      }
      
      if (simplified[simplified.length - 1] !== coords[coords.length - 1]) {
        simplified.push(coords[coords.length - 1]);
      }
      
      return simplified;
    };

    const processCoordinates = (coords) => {
      if (!Array.isArray(coords)) return coords;
      
      if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
        return simplifyCoordinates(coords, config.simplification);
      } else {
        return coords.map(innerCoords => processCoordinates(innerCoords));
      }
    };

    return {
      ...geometry,
      coordinates: processCoordinates(geometry.coordinates)
    };
  };

  // Cargar datos GeoJSON por clave_cata
  const loadGeoData = async (claveCata = '') => {
    if (!claveCata.trim()) {
      setError('Por favor ingresa una clave catastral');
      return;
    }

    setLoading(true);
    setError(null);
    setGeoData(null);
    
    try {
      const url = `${catastro_url}?clave_cata=${encodeURIComponent(claveCata)}`;
      console.log('Solicitando URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Aplicar LOD a los datos
      if (data.features) {
        const processedData = {
          ...data,
          features: data.features.map(feature => ({
            ...feature,
            geometry: simplifyGeometry(feature.geometry, lodLevel)
          })),
          metadata: {
            ...data.metadata,
            lodLevel,
            originalFeatures: data.features.length,
            processedFeatures: data.features.length
          }
        };
        
        setGeoData(processedData);
        setSelectedClaveCata(claveCata);
        
        // Actualizar lista de claves catastrales disponibles
        if (!availableClavesCata.includes(claveCata)) {
          setAvailableClavesCata(prev => [...prev, claveCata].sort());
        }
      } else {
        throw new Error('No se encontraron datos para la clave catastral especificada');
      }
      
    } catch (err) {
      setError(`Error cargando datos: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (claveCataInput.trim()) {
      loadGeoData(claveCataInput.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setClaveCataInput('');
    setSelectedClaveCata('');
    setGeoData(null);
    setError(null);
    setSelectedFeature(null);
  };

  const handleClaveCataSelect = (claveCata) => {
    setClaveCataInput(claveCata);
    loadGeoData(claveCata);
  };

  const handleLodChange = (level) => {
    setLodLevel(level);
    if (selectedClaveCata) {
      loadGeoData(selectedClaveCata);
    }
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
                acc.push([coord[0][1], coord[0][0]]);
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

  // Función helper para extraer coordenadas
  const getCoordinatesFromGeometry = (geometry) => {
    if (!geometry || !geometry.coordinates) return [];
    
    const coords = [];
    const extractCoords = (arr) => {
      if (Array.isArray(arr)) {
        if (Array.isArray(arr[0]) && Array.isArray(arr[0][0])) {
          arr.forEach(ring => {
            ring.forEach(coord => {
              if (Array.isArray(coord) && coord.length >= 2) {
                coords.push(coord);
              }
            });
          });
        } else if (Array.isArray(arr[0]) && typeof arr[0][0] === 'number') {
          arr.forEach(coord => {
            if (Array.isArray(coord) && coord.length >= 2) {
              coords.push(coord);
            }
          });
        } else if (typeof arr[0] === 'number') {
          coords.push(arr);
        }
      }
    };
    
    extractCoords(geometry.coordinates);
    return coords;
  };

  // Renderizar polígonos individualmente
  const renderPolygons = () => {
    if (!geoData || !geoData.features) return null;

    return geoData.features.map((feature, index) => {
      const { geometry, properties } = feature;
      const isSelected = selectedFeature && selectedFeature === feature;
      
      // Colores basados en propiedades catastrales
      const colorMap = {
        'URBANO': '#3388ff',
        'RURAL': '#33ff33',
        'ESPECIAL': '#ff33ff',
        'INDUSTRIAL': '#ff9933',
        'COMERCIAL': '#ff3333'
      };
      
      const tipo = properties?.tipo || properties?.TIPO || properties?.uso || 'URBANO';
      const baseColor = colorMap[tipo] || '#8977b9ff';
      
      const pathOptions = {
        color: isSelected ? '#ff9900' : '#ffffff',
        fillColor: isSelected ? '#ff9900' : baseColor,
        fillOpacity: isSelected ? 0.7 : 0.5,
        weight: isSelected ? 4 : 2,
        opacity: 1,
        dashArray: isSelected ? '' : '3'
      };

      if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates.map((polygon, polyIndex) => {
          const polyCoords = polygon[0].map(coord => [coord[1], coord[0]]);
          
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
                <div style={{ minWidth: '250px' }}>
                  <h3>Información Catastral</h3>
                  <p><strong>Clave Catastral:</strong> {properties?.clave_cata || properties?.CLAVE_CATA || 'N/A'}</p>
                  <p><strong>Propietario:</strong> {properties?.propietario || properties?.PROPIETARIO || properties?.nombre || 'N/A'}</p>
                  <p><strong>Área:</strong> {properties?.area || properties?.AREA || properties?.superficie || 'N/A'} m²</p>
                  <p><strong>Uso:</strong> {properties?.uso || properties?.USO || tipo || 'N/A'}</p>
                  <p><strong>Valor:</strong> {properties?.valor || properties?.VALOR || properties?.avaluo || 'N/A'}</p>
                  {properties?.direccion && <p><strong>Dirección:</strong> {properties.direccion}</p>}
                  {properties?.sector && <p><strong>Sector:</strong> {properties.sector}</p>}
                  {properties?.parroquia && <p><strong>Parroquia:</strong> {properties.parroquia}</p>}
                  <p><em>Parte {polyIndex + 1} de MultiPolygon</em></p>
                </div>
              </Popup>
            </Polygon>
          );
        });
      } else if (geometry.type === 'Polygon') {
        const polyCoords = geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
        
        return (
          <Polygon
            key={`polygon-${index}`}
            positions={polyCoords}
            pathOptions={pathOptions}
            eventHandlers={{
              click: () => {
                setSelectedFeature(feature);
              }
            }}
          >
            <Popup>
              <div style={{ minWidth: '250px' }}>
                <h3>Información Catastral</h3>
                <p><strong>Clave Catastral:</strong> {properties?.clave_cata || properties?.CLAVE_CATA || 'N/A'}</p>
                <p><strong>Propietario:</strong> {properties?.propietario || properties?.PROPIETARIO || properties?.nombre || 'N/A'}</p>
                <p><strong>Área:</strong> {properties?.area || properties?.AREA || properties?.superficie || 'N/A'} m²</p>
                <p><strong>Uso:</strong> {properties?.uso || properties?.USO || tipo || 'N/A'}</p>
                <p><strong>Valor:</strong> {properties?.valor || properties?.VALOR || properties?.avaluo || 'N/A'}</p>
                {properties?.direccion && <p><strong>Dirección:</strong> {properties.direccion}</p>}
                {properties?.sector && <p><strong>Sector:</strong> {properties.sector}</p>}
                {properties?.parroquia && <p><strong>Parroquia:</strong> {properties.parroquia}</p>}
              </div>
            </Popup>
          </Polygon>
        );
      }
      
      return null;
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Panel lateral */}
      <div style={{ 
        width: '400px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5',
        overflowY: 'auto',
        borderRight: '1px solid #ddd'
      }}>
        <Typography variant="h4" gutterBottom>
          Búsqueda Catastral
        </Typography>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Buscar por Clave Catastral
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Clave Catastral"
                value={claveCataInput}
                onChange={(e) => setClaveCataInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: 123-456-789, CATA-001, etc."
                disabled={loading}
                sx={{ mb: 1 }}
              />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  disabled={loading || !claveCataInput.trim()}
                  sx={{ flex: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Buscar'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClear}
                  disabled={loading}
                >
                  Limpiar
                </Button>
              </Box>
            </Box>

            {/* Selector de LOD */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Nivel de Detalle:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['low', 'medium', 'high'].map(level => (
                  <Chip
                    key={level}
                    label={
                      level === 'low' ? 'Bajo' : 
                      level === 'medium' ? 'Medio' : 'Alto'
                    }
                    color={lodLevel === level ? 'primary' : 'default'}
                    onClick={() => handleLodChange(level)}
                    variant={lodLevel === level ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {lodLevel === 'low' ? 'Rápido, menos detalle' : 
                 lodLevel === 'medium' ? 'Balanceado' : 
                 'Lento, máximo detalle'}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Claves catastrales recientes */}
        {availableClavesCata.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Búsquedas Recientes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableClavesCata.map(claveCata => (
                  <Chip
                    key={claveCata}
                    label={claveCata}
                    onClick={() => handleClaveCataSelect(claveCata)}
                    variant={selectedClaveCata === claveCata ? 'filled' : 'outlined'}
                    color={selectedClaveCata === claveCata ? 'primary' : 'default'}
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Estadísticas */}
        {geoData && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de la Consulta
              </Typography>
              <Typography variant="body2">
                <strong>Clave Catastral:</strong> {selectedClaveCata}
              </Typography>
              <Typography variant="body2">
                <strong>Predios encontrados:</strong> {geoData?.metadata?.total || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Nivel LOD:</strong> {lodLevel.toUpperCase()}
              </Typography>
              {geoData?.metadata?.originalFeatures && (
                <Typography variant="caption" color="text.secondary">
                  Geometrías optimizadas para mejor rendimiento
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Información del predio seleccionado */}
        {selectedFeature && (
          <Card sx={{ backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Predio Seleccionado
              </Typography>
              <Typography variant="body2">
                <strong>Clave:</strong> {selectedFeature.properties?.clave_cata || selectedFeature.properties?.CLAVE_CATA || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Propietario:</strong> {selectedFeature.properties?.propietario || selectedFeature.properties?.PROPIETARIO || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Área:</strong> {selectedFeature.properties?.area || selectedFeature.properties?.AREA || 'N/A'} m²
              </Typography>
              <Typography variant="body2">
                <strong>Uso:</strong> {selectedFeature.properties?.uso || selectedFeature.properties?.USO || 'N/A'}
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setSelectedFeature(null)}
                sx={{ mt: 1 }}
              >
                Cerrar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Mensajes de error */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </div>

      {/* Mapa */}
      <div style={{ flex: 1, position: 'relative' }}>
        {!geoData && !loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 1000,
              backgroundColor: 'rgba(255,255,255,0.9)',
              padding: 4,
              borderRadius: 2
            }}
          >
            <MyLocation sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Sistema de Consulta Catastral
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Ingresa una clave catastral para visualizar el predio
            </Typography>
          </Box>
        )}
        
        <MapContainer
          center={position}
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

export default CatastroMap;