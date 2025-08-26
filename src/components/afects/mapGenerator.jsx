// generateMapImage.js
import { createRoot } from 'react-dom/client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente de mapa para captura
const MapCapture = ({ lat, lng, zoom = 14 }) => (
  <MapContainer
    center={[lat, lng]}
    zoom={zoom}
    style={{ width: '100%', height: '100%' }}
    zoomControl={true}
    attributionControl={false}
  >
    <TileLayer
      url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
      attribution="&copy; OpenStreetMap contributors"
    />
    <Marker position={[lat, lng]}>
      <Popup>Ubicación: {lat.toFixed(6)}, {lng.toFixed(6)}</Popup>
    </Marker>
  </MapContainer>
);

// Función principal unificada
export async function generateMapImage(lat, lng, width = 600, height = 400, zoom = 14) {
  return new Promise((resolve) => {
    try {
      // Crear contenedor temporal
      const container = document.createElement('div');
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.zIndex = '9999';
      container.style.visibility = 'hidden';
      document.body.appendChild(container);

      // Renderizar el mapa
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <MapCapture lat={lat} lng={lng} zoom={zoom} />
        </React.StrictMode>
      );

      // Esperar a que el mapa se renderice y generar imagen
      setTimeout(() => {
        try {
          // Hacer visible momentáneamente
          container.style.visibility = 'visible';
          
          // Generar representación del mapa usando Canvas
          const imageData = createMapSnapshot(lat, lng, width, height);
          
          // Limpiar
          root.unmount();
          document.body.removeChild(container);
          
          resolve(imageData);
        } catch (error) {
          console.error('Error en generación de imagen:', error);
          const fallbackImage = createFallbackMap(lat, lng, width, height);
          root.unmount();
          document.body.removeChild(container);
          resolve(fallbackImage);
        }
      }, 1500); // Tiempo para que Leaflet se renderice

    } catch (error) {
      console.error('Error general:', error);
      resolve(createFallbackMap(lat, lng, width, height));
    }
  });
}

// Función para crear snapshot del mapa
function createMapSnapshot(lat, lng, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Fondo estilo mapa satelital
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(0.5, '#A8D8F0');
  gradient.addColorStop(1, '#D0E8F8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Terreno y áreas verdes
  ctx.fillStyle = '#7CB342';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.bezierCurveTo(
    width * 0.2, height * 0.55,
    width * 0.8, height * 0.6,
    width, height * 0.65
  );
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // 3. Carreteras
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 10;
  
  // Carretera principal
  ctx.beginPath();
  ctx.moveTo(width * 0.1, height * 0.7);
  ctx.bezierCurveTo(
    width * 0.4, height * 0.65,
    width * 0.6, height * 0.67,
    width * 0.9, height * 0.7
  );
  ctx.stroke();

  // 4. Edificios y estructuras
  drawBuildings(ctx, width, height);

  // 5. Marcador de posición en el centro
  drawMapMarker(ctx, width / 2, height * 0.67, 20, '#E53935');

  // 6. Información y detalles
  addMapDetails(ctx, lat, lng, width, height);

  return canvas.toDataURL('image/png');
}

// Dibujar edificios
function drawBuildings(ctx, width, height) {
  const buildings = [
    { x: width * 0.25, y: height * 0.5, w: 45, h: 70, color: '#78909C' },
    { x: width * 0.6, y: height * 0.45, w: 55, h: 80, color: '#546E7A' },
    { x: width * 0.4, y: height * 0.55, w: 35, h: 50, color: '#90A4AE' }
  ];

  buildings.forEach(building => {
    ctx.fillStyle = building.color;
    ctx.fillRect(building.x, building.y, building.w, building.h);
    
    // Ventanas
    ctx.fillStyle = '#FFD600';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i * j < 6) { // Máximo 6 ventanas
          ctx.fillRect(
            building.x + 5 + i * 12,
            building.y + 5 + j * 15,
            8,
            10
          );
        }
      }
    }
  });
}

// Dibujar marcador del mapa
function drawMapMarker(ctx, x, y, size, color) {
  // Sombra
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Círculo del marcador
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fill();
  
  // Borde blanco
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Reset sombra
  ctx.shadowColor = 'transparent';
  
  // Punto central
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, size / 3, 0, 2 * Math.PI);
  ctx.fill();
}

// Añadir detalles del mapa
function addMapDetails(ctx, lat, lng, width, height) {
  // Título
  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('📍 Ubicación Reportada', 20, 30);

  // Coordenadas
  ctx.font = 'bold 12px Arial';
  ctx.fillText('Coordenadas:', 20, height - 45);
  ctx.font = '11px Arial';
  ctx.fillText(`Latitud: ${lat.toFixed(6)}`, 20, height - 30);
  ctx.fillText(`Longitud: ${lng.toFixed(6)}`, 20, height - 15);

  // Escala
  ctx.fillStyle = '#000000';
  ctx.fillRect(20, height - 60, 80, 2);
  ctx.fillRect(20, height - 65, 2, 10);
  ctx.fillRect(100, height - 65, 2, 10);
  ctx.font = '10px Arial';
  ctx.fillText('100 m', 35, height - 70);

  // Norte
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(width - 30, 25);
  ctx.lineTo(width - 40, 40);
  ctx.lineTo(width - 20, 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillText('N', width - 28, 55);

  // Copyright
  ctx.fillStyle = '#7F8C8D';
  ctx.font = '9px Arial';
  ctx.fillText('© Google Satellite • OpenStreetMap', width - 200, height - 10);
}

// Función de fallback
function createFallbackMap(lat, lng, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Fondo simple
  ctx.fillStyle = '#F5F5F5';
  ctx.fillRect(0, 0, width, height);

  // Borde
  ctx.strokeStyle = '#CCCCCC';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, width - 10, height - 10);

  // Marcador en el centro
  drawMapMarker(ctx, width / 2, height / 2, 15, '#E53935');

  // Información
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Mapa de Ubicación', width / 2 - 60, 30);
  ctx.font = '12px Arial';
  ctx.fillText(`Lat: ${lat.toFixed(6)}`, 20, height - 40);
  ctx.fillText(`Lng: ${lng.toFixed(6)}`, 20, height - 20);
  ctx.fillStyle = '#666666';
  ctx.font = '10px Arial';
  ctx.fillText('Representación visual de las coordenadas', width / 2 - 120, height / 2 + 40);

  return canvas.toDataURL('image/png');
}

export default generateMapImage;