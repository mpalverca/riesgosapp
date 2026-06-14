import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Card, CardContent, Chip, List, ListItem, ListItemText, Typography, LinearProgress, Alert } from '@mui/material';
import L from 'leaflet';

// Fix para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Función para determinar el color basado en el porcentaje
const getColorByPercentage = (porcentaje) => {
  if (porcentaje === 0) return '#4caf50';      // Verde - Óptimo
  if (porcentaje >= 70) return '#f44336';      // Rojo - Crítico (70% o más)
  if (porcentaje >= 40) return '#ff9800';      // Naranja - Atención media
  return '#ffeb3b';                             // Amarillo - Atención baja
};

// Función para determinar si debe tener animación pulsante
const shouldPulse = (porcentaje) => {
  return porcentaje >= 70;  // Pulsa desde 70% hasta 100%
};

// Función para crear iconos personalizados según el tipo y porcentaje
const getMarkerIcon = (tipo, porcentaje) => {
  if (tipo === 'pozo') {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #2196f3; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transition: transform 0.2s ease;"></div>`,
      iconSize: [18, 18],
      popupAnchor: [0, -9]
    });
  } else if (tipo === 'sumidero') {
    const color = getColorByPercentage(porcentaje);
    const pulse = shouldPulse(porcentaje);
    const animation = pulse ? 'animation: pulse 1.5s infinite;' : '';
    
    // Tamaño del marcador según porcentaje (más grande si es crítico)
    const size = porcentaje >= 70 ? 20 : 16;
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); ${animation} cursor: pointer; transition: all 0.3s ease;"></div>`,
      iconSize: [size + 4, size + 4],
      popupAnchor: [0, -(size / 2)]
    });
  }
  return null;
};

const MapView = ({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];
  
  // Filtrar marcadores (pozos y sumideros)
  const markers = useMemo(
    () => safeData.filter((item) => item?.tipo === 'pozo' || item?.tipo === 'sumidero'),
    [safeData]
  );

  // Filtrar tuberías
  const tuberias = useMemo(
    () => safeData.filter((item) => item?.tipo === 'tuberia'),
    [safeData]
  );

  // Calcular estadísticas de obstrucción
  const obstructionStats = useMemo(() => {
    const sumideros = markers.filter(m => m.tipo === 'sumidero' && m?.total !== undefined);
    if (sumideros.length === 0) return null;
    
    const critical = sumideros.filter(m => Number(m.total) >= 70).length;
    const medium = sumideros.filter(m => Number(m.total) >= 40 && Number(m.total) < 70).length;
    const low = sumideros.filter(m => Number(m.total) < 40 && Number(m.total) > 0).length;
    const optimal = sumideros.filter(m => Number(m.total) === 0).length;
    
    return { critical, medium, low, optimal, total: sumideros.length };
  }, [markers]);

  // Calcular centro del mapa
  const center = useMemo(() => {
    if (!markers.length) return [4.710989, -74.072090];
    const validMarkers = markers.filter(item => {
      const lat = Number(item?.cord_xi);
      const lng = Number(item?.Cord_yi);
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });
    
    if (!validMarkers.length) return [4.710989, -74.072090];
    
    const latSum = validMarkers.reduce((acc, item) => acc + Number(item.cord_xi), 0);
    const lngSum = validMarkers.reduce((acc, item) => acc + Number(item.Cord_yi), 0);
    return [latSum / validMarkers.length, lngSum / validMarkers.length];
  }, [markers]);

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
      <Box flex={1} minHeight={500}>
        {/* Alerta de elementos críticos */}
        {obstructionStats && obstructionStats.critical > 0 && (
          <Alert severity="error" sx={{ mb: 2, position: 'absolute', top: 10, right: 10, zIndex: 1000, width: 'auto' }}>
            ⚠️ {obstructionStats.critical} sumidero(s) con obstrucción crítica (&gt;70%)
          </Alert>
        )}
        
        <MapContainer center={center} zoom={14} style={{ width: '100%', height: '100%', minHeight: '500px' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Dibujar tuberías como líneas */}
          {tuberias.map((item, index) => {
            const startLat = Number(item?.cord_xi);
            const startLng = Number(item?.Cord_yi);
            const endLat = Number(item?.cord_xF);
            const endLng = Number(item?.Cord_yF);
            
            if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) return null;
            
            const positions = [[startLat, startLng], [endLat, endLng]];
            
            return (
              <Polyline
                key={`tuberia-${index}`}
                positions={positions}
                color="#2196f3"
                weight={3}
                opacity={0.7}
              >
                <Popup>
                  <Typography variant="subtitle2" fontWeight="bold">📏 Tubería</Typography>
                  <Typography variant="body2"><strong>Material:</strong> {item?.material || 'N/E'}</Typography>
                  <Typography variant="body2"><strong>Tipo material:</strong> {item?.tipo_material || 'N/E'}</Typography>
                  <Typography variant="body2"><strong>Capacidad:</strong> {item?.capacidad || 'N/E'} L</Typography>
                  <Typography variant="body2"><strong>Dimensiones:</strong> {item?.dimenciones || 'N/E'}</Typography>
                </Popup>
              </Polyline>
            );
          })}
          
          {/* Marcadores de pozos y sumideros */}
          {markers.map((item, index) => {
            const lat = Number(item?.cord_xi);
            const lng = Number(item?.Cord_yi);
            if (isNaN(lat) || isNaN(lng)) return null;
            
            const position = [lat, lng];
            const porcentaje = item?.total !== undefined ? Number(item.total) : -1;
            const icon = getMarkerIcon(item?.tipo, porcentaje);
            
            if (!icon) return null;
            
            return (
              <Marker 
                key={`${item?.tipo}-${item?.id || index}`} 
                position={position}
                icon={icon}
              >
                <Popup>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {item?.tipo === 'pozo' ? '💧 Pozo' : '🚰 Sumidero'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nombre:</strong> {item?.nombre || item?.label || 'Sin nombre'}
                  </Typography>
                  {item?.tipo === 'sumidero' && item?.total !== undefined && (
                    <>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Obstrucción:</strong> {porcentaje}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={porcentaje} 
                        sx={{ 
                          mt: 1, 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getColorByPercentage(porcentaje),
                            borderRadius: 5
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {porcentaje === 0 ? '✓ Óptimo - Sin obstrucción' : 
                         porcentaje >= 70 ? '⚠ Crítico - Requiere atención inmediata' : 
                         porcentaje >= 40 ? '◔ Atención - Monitorear regularmente' : 
                         '◔ Atención baja - Requiere mantenimiento'}
                      </Typography>
                    </>
                  )}
                  {item?.tipo === 'pozo' && (
                    <>
                      <Typography variant="body2">
                        <strong>Profundidad:</strong> {item?.altitude_i || 'N/E'} m
                      </Typography>
                      <Typography variant="body2">
                        <strong>Material:</strong> {item?.material || 'N/E'}
                      </Typography>
                    </>
                  )}
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    📅 {item?.date || 'Fecha no registrada'}
                  </Typography>
                  {item?.by && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      👤 Registrado por: {item.by}
                    </Typography>
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Box>

      <Box width={{ xs: '100%', md: 380 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📋 Resumen de elementos
            </Typography>
            
            {/* Estadísticas de obstrucción */}
            {obstructionStats && (
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  🚰 Estado de Sumideros
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">🟢 Óptimo (0%):</Typography>
                  <Typography variant="body2" fontWeight="bold">{obstructionStats.optimal}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">🟡 Atención baja (&lt;40%):</Typography>
                  <Typography variant="body2" fontWeight="bold">{obstructionStats.low}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">🟠 Atención media (40-69%):</Typography>
                  <Typography variant="body2" fontWeight="bold">{obstructionStats.medium}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">🔴 Crítico (≥70%):</Typography>
                  <Typography variant="body2" fontWeight="bold" color="error">{obstructionStats.critical}</Typography>
                </Box>
              </Box>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                💧 Pozos ({markers.filter(m => m.tipo === 'pozo').length})
              </Typography>
              <List dense>
                {markers.filter(m => m.tipo === 'pozo').map((item, index) => (
                  <ListItem key={`pozo-${item?.id || index}`} divider>
                    <ListItemText
                      primary={item?.nombre || item?.label || `Pozo ${index + 1}`}
                      secondary={`Profundidad: ${item?.altitude_i || 'N/E'}m | Material: ${item?.material || 'N/E'}`}
                    />
                    <Chip label="pozo" color="info" size="small" />
                  </ListItem>
                ))}
                {markers.filter(m => m.tipo === 'pozo').length === 0 && (
                  <Typography variant="body2" color="text.secondary">No hay pozos registrados</Typography>
                )}
              </List>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>
                🚰 Sumideros ({markers.filter(m => m.tipo === 'sumidero').length})
              </Typography>
              <List dense>
                {markers.filter(m => m.tipo === 'sumidero').map((item, index) => {
                  const porcentaje = item?.total !== undefined ? Number(item.total) : -1;
                  let color = 'default';
                  let statusText = '';
                  
                  if (porcentaje === 0) {
                    color = 'success';
                    statusText = 'Óptimo';
                  } else if (porcentaje >= 70) {
                    color = 'error';
                    statusText = 'Crítico';
                  } else if (porcentaje >= 40) {
                    color = 'warning';
                    statusText = 'Atención';
                  } else if (porcentaje > 0) {
                    color = 'info';
                    statusText = 'Monitoreo';
                  }
                  
                  return (
                    <ListItem key={`sumidero-${item?.id || index}`} divider>
                      <ListItemText
                        primary={item?.nombre || item?.label || `Sumidero ${index + 1}`}
                        secondary={`Obstrucción: ${porcentaje}% - ${statusText}`}
                      />
                      <Chip 
                        label={`${porcentaje}%`} 
                        color={color} 
                        size="small" 
                        variant={porcentaje >= 70 ? "filled" : "outlined"}
                      />
                    </ListItem>
                  );
                })}
                {markers.filter(m => m.tipo === 'sumidero').length === 0 && (
                  <Typography variant="body2" color="text.secondary">No hay sumideros registrados</Typography>
                )}
              </List>
            </Box>

            <Typography variant="subtitle2" color="secondary" gutterBottom>
              📏 Tuberías ({tuberias.length})
            </Typography>
            <List dense>
              {tuberias.length > 0 ? (
                tuberias.map((item, index) => (
                  <ListItem key={`tuberia-${item?.id || index}`} divider>
                    <ListItemText
                      primary={item?.nombre || item?.label || `Tubería ${index + 1}`}
                      secondary={
                        <>
                          {item?.tipo_material || 'Material N/E'} | 
                          {item?.capacidad ? ` ${item.capacidad}L` : ' Capacidad N/E'}
                        </>
                      }
                    />
                    <Chip label="tubería" color="secondary" size="small" />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay tuberías en los datos.
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Box>
      
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
            box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
          }
        }
        
        .custom-div-icon {
          background: transparent;
          border: none;
        }
        
        .custom-div-icon div {
          transition: transform 0.2s ease;
        }
        
        .custom-div-icon div:hover {
          transform: scale(1.3);
          z-index: 1000;
        }
      `}</style>
    </Box>
  );
};

export default MapView;