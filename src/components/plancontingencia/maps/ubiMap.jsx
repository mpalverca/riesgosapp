import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Componente para detectar clics en el mapa y dibujar
function DrawingHandler({ mode, onDrawComplete, color = "#3388ff" }) {
  const [points, setPoints] = useState([]);
  const map = useMapEvents({
    click(e) {
      if (mode === 'point') {
        // Dibujar punto individual
        onDrawComplete({
          type: 'point',
          position: [e.latlng.lat, e.latlng.lng],
          color: color
        });
      } else if (mode === 'polygon' || mode === 'line') {
        // Agregar punto al polígono o línea
        setPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
      }
    },
    keydown(e) {
      // Finalizar dibujo con Enter o Escape
      if ((e.key === 'Enter' || e.key === 'Escape') && points.length > 0) {
        if (mode === 'polygon' && points.length >= 3) {
          onDrawComplete({
            type: 'polygon',
            positions: [...points, points[0]], // Cerrar el polígono
            color: color
          });
        } else if (mode === 'line' && points.length >= 2) {
          onDrawComplete({
            type: 'line',
            positions: points,
            color: color
          });
        }
        setPoints([]);
      }
      
      // Cancelar dibujo con Escape
      if (e.key === 'Escape') {
        setPoints([]);
      }
      
      // Eliminar último punto con Backspace
      if (e.key === 'Backspace' && points.length > 0) {
        setPoints(prev => prev.slice(0, -1));
      }
    }
  });

  // Limpiar puntos cuando cambia el modo
  useEffect(() => {
    setPoints([]);
  }, [mode]);

  return (
    <>
      {/* Mostrar puntos temporales durante el dibujo */}
      {points.map((point, index) => (
        <Marker 
          key={`temp-${index}`} 
          position={point}
          icon={L.divIcon({
            className: 'temporary-point',
            html: `<div style="background-color: ${color}; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [12, 12]
          })}
        />
      ))}
      
      {/* Mostrar línea temporal durante el dibujo */}
      {mode === 'line' && points.length > 1 && (
        <Polyline
          positions={points}
          color={color}
          weight={3}
          opacity={0.7}
          dashArray="5, 5"
        />
      )}
      
      {/* Mostrar polígono temporal durante el dibujo */}
      {mode === 'polygon' && points.length > 2 && (
        <Polygon
          positions={[...points, points[0]]}
          color={color}
          weight={3}
          opacity={0.7}
          fillOpacity={0.1}
          dashArray="5, 5"
        />
      )}
    </>
  );
}

const MapViewer = ({ 
  center, 
  zoom, 
  markers = [], 
  drawings = [], 
  onDrawComplete, 
  drawingMode = null, // 'point', 'polygon', 'line', o null para desactivar
  drawingColor = "#3388ff",
  onClick,
  height = "400px" 
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Handler para clics normales del mapa */}
      {onClick && (
        <MapClickHandler onClick={onClick} />
      )}

      {/* Handler para dibujo cuando hay un modo activo */}
      {drawingMode && onDrawComplete && (
        <DrawingHandler 
          mode={drawingMode} 
          onDrawComplete={onDrawComplete}
          color={drawingColor}
        />
      )}

      {/* Marcadores existentes */}
      {markers.map((marker, index) => (
        <Marker key={`marker-${index}`} position={marker.position}>
          <Popup>
            <strong>{marker.title}</strong>
            <br />
            {marker.description}
          </Popup>
        </Marker>
      ))}

      {/* Dibujos existentes (polígonos, líneas, puntos personalizados) */}
      {drawings.map((drawing, index) => {
        switch (drawing.type) {
          case 'polygon':
            return (
              <Polygon
                key={`drawing-${index}`}
                positions={drawing.positions}
                color={drawing.color || drawingColor}
                weight={3}
                opacity={0.7}
                fillOpacity={0.2}
              >
                <Popup>
                  <strong>Polígono</strong>
                  <br />
                  Puntos: {drawing.positions.length}
                </Popup>
              </Polygon>
            );
          
          case 'line':
            return (
              <Polyline
                key={`drawing-${index}`}
                positions={drawing.positions}
                color={drawing.color || drawingColor}
                weight={3}
                opacity={0.7}
              >
                <Popup>
                  <strong>Línea</strong>
                  <br />
                  Segmentos: {drawing.positions.length - 1}
                </Popup>
              </Polyline>
            );
          
          case 'point':
            return (
              <Marker 
                key={`drawing-${index}`} 
                position={drawing.position}
                icon={L.divIcon({
                  className: 'custom-point',
                  html: `<div style="background-color: ${drawing.color || drawingColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                  iconSize: [16, 16]
                })}
              >
                <Popup>
                  <strong>Punto personalizado</strong>
                  <br />
                  Lat: {drawing.position[0].toFixed(4)}, Lng: {drawing.position[1].toFixed(4)}
                </Popup>
              </Marker>
            );
          
          default:
            return null;
        }
      })}
    </MapContainer>
  );
};

// Componente original para clics simples (mantener compatibilidad)
function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default MapViewer;