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

const SectorMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSector, setSelectedSector] = useState('');
  const [sectorInput, setSectorInput] = useState('');
  const [availableSectors, setAvailableSectors] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [lodLevel, setLodLevel] = useState('medium'); // LOD: low, medium, high

  const sector_url = `https://script.google.com/macros/s/AKfycbzj8eXN23mkkdZypf8yBayEMBA7Bt-MM0D_6Jp-34JxQCsg-8UkjZqM9nBoI6dw8nrK/exec`;

  // Configuración de LOD (Level of Detail)
  const lodConfig = {
    low: {
      simplification: 0.01, // Mayor simplificación
      pointReduction: 0.7,  // Reducir puntos en 70%
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
      
      // Algoritmo de simplificación básico (Douglas-Peucker simplificado)
      const simplified = [];
      const step = Math.ceil(coords.length / config.maxPointsPerPolygon);
      
      for (let i = 0; i < coords.length; i += step) {
        simplified.push(coords[i]);
      }
      
      // Asegurar que el primer y último punto estén incluidos
      if (simplified[simplified.length - 1] !== coords[coords.length - 1]) {
        simplified.push(coords[coords.length - 1]);
      }
      
      return simplified;
    };

    const processCoordinates = (coords) => {
      if (!Array.isArray(coords)) return coords;
      
      if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
        // Array de coordenadas
        return simplifyCoordinates(coords, config.simplification);
      } else {
        // Array de arrays de coordenadas
        return coords.map(innerCoords => processCoordinates(innerCoords));
      }
    };

    return {
      ...geometry,
      coordinates: processCoordinates(geometry.coordinates)
    };
  };

  // Cargar datos GeoJSON solo cuando se solicite
  const loadGeoData = async (sector = '') => {
    if (!sector.trim()) {
      setError('Por favor ingresa un nombre de sector');
      return;
    }

    setLoading(true);
    setError(null);
    setGeoData(null);
    
    try {
      const url = `${sector_url}?SECTOR=${encodeURIComponent(sector)}`;
      
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
        setSelectedSector(sector);
        
        // Actualizar lista de sectores disponibles
        if (!availableSectors.includes(sector)) {
          setAvailableSectors(prev => [...prev, sector].sort());
        }
      } else {
        throw new Error('No se encontraron datos para el sector especificado');
      }
      
    } catch (err) {
      setError(`Error cargando datos: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (sectorInput.trim()) {
      loadGeoData(sectorInput.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSectorInput('');
    setSelectedSector('');
    setGeoData(null);
    setError(null);
    setSelectedFeature(null);
  };

  const handleSectorSelect = (sector) => {
    setSectorInput(sector);
    loadGeoData(sector);
  };

  const handleLodChange = (level) => {
    setLodLevel(level);
    // Recargar datos con nuevo LOD si hay datos cargados
    if (selectedSector) {
      loadGeoData(selectedSector);
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
          Búsqueda de Sectores
        </Typography>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Buscar Sector
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Nombre del Sector"
                value={sectorInput}
                onChange={(e) => setSectorInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Santo Domingo, Norte, etc."
                disabled={loading}
                sx={{ mb: 1 }}
              />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  disabled={loading || !sectorInput.trim()}
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

        {/* Sectores recientes */}
        {availableSectors.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sectores Buscados
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableSectors.map(sector => (
                  <Chip
                    key={sector}
                    label={sector}
                    onClick={() => handleSectorSelect(sector)}
                    variant={selectedSector === sector ? 'filled' : 'outlined'}
                    color={selectedSector === sector ? 'primary' : 'default'}
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
                Estadísticas
              </Typography>
              <Typography variant="body2">
                <strong>Sector:</strong> {selectedSector}
              </Typography>
              <Typography variant="body2">
                <strong>Polígonos:</strong> {geoData?.metadata?.total || 0}
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

        {/* Información del polígono seleccionado */}
        {selectedFeature && (
          <Card sx={{ backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Polígono Seleccionado
              </Typography>
              <Typography variant="body2">
                <strong>Sector:</strong> {selectedFeature.properties?.SECTOR || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Parroquia:</strong> {selectedFeature.properties?.PARROQUIA || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Geometría:</strong> {selectedFeature.geometry?.type || 'N/A'}
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
              Ingresa un nombre de sector para comenzar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Utiliza el panel lateral para buscar sectores específicos
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

export default SectorMap;