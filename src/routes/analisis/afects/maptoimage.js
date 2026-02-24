//import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Función para capturar un mapa basado en coordenadas y generar un PDF
export async function captureMap(lat, lng, zoom, polygon, title) {
  try {
    // Crear un contenedor oculto para el mapa
    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.width = '800px';
    hiddenContainer.style.height = '700px';
    document.body.appendChild(hiddenContainer);
    
    // Crear un div para el mapa
    const mapDiv = document.createElement('div');
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    hiddenContainer.appendChild(mapDiv);
    
    // Cargar Leaflet dinámicamente
    await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
    await loadStyle('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    
    // Inicializar el mapa en el div oculto
    const tempMap = window.L.map(mapDiv, {
      zoomControl: false,
      attributionControl: false
    }).setView([lat, lng], zoom);
    
    // Añadir capa de tiles
    window.L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}').addTo(tempMap);

    // Añadir marcador
    window.L.marker([lat, lng]).addTo(tempMap);
    // Verificar si hay polígono y agregarlo
    
    /* if (polygon && Array.isArray(polygon) && polygon.length > 0) {
      // Si el polígono viene como array de coordenadas [lat, lng]
      window.L.polygon(polygon, {
        color: '#FF5733',
        weight: 3,
        opacity: 0.8,
        fillColor: '#FF5733',
        fillOpacity: 0.3
      }).addTo(tempMap);
       // Ajustar el zoom para mostrar todo el polígono y el marcador
      const allPoints = polygon.map(coord => [coord[0], coord[1]]);
      // Agregar también el punto del marcador
      allPoints.push([lat, lng]);
      
      const bounds = window.L.latLngBounds(allPoints);
      tempMap.fitBounds(bounds, { padding: [30, 30] });
    } */
      
      
    // Esperar a que el mapa se cargue completamente
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Capturar el mapa como imagen
    const canvas = await html2canvas(mapDiv, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Obtener la imagen como data URL
    const imageData = canvas.toDataURL('image/png');
        
    return imageData;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  }
}

// Función auxiliar para cargar scripts dinámicamente
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Función auxiliar para cargar estilos dinámicamente
export function loadStyle(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}