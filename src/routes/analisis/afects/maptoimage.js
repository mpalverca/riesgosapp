//import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Función para capturar un mapa basado en coordenadas y generar un PDF
export async function captureMap(lat, lng, zoom, title) {
  try {
    // Crear un contenedor oculto para el mapa
    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.width = '800px';
    hiddenContainer.style.height = '600px';
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
    
    // Crear PDF
    /*const doc = new jsPDF('landscape', 'mm', 'a4');
    
    /* // Añadir título
    doc.setFontSize(20);
    doc.text(title, 105, 20, { align: 'center' });
    
    // Añadir coordenadas
    doc.setFontSize(12);
    doc.text(`Latitud: ${lat}`, 20, 30);
    doc.text(`Longitud: ${lng}`, 20, 37);
    doc.text(`Zoom: ${zoom}`, 20, 44);
    
    // Añadir fecha
    const fecha = new Date().toLocaleString();
    doc.text(`Generado: ${fecha}`, 20, 51);
    
    // Añadir imagen del mapa
    const imgWidth = 250;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    doc.addImage(imageData, 'PNG', 20, 60, imgWidth, imgHeight);
    
    // Añadir marca de agua
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Generado con React y Leaflet', 270, 200, { align: 'right' });
    
    // Guardar PDF
    doc.save(`mapa-${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    
    // Limpiar
    tempMap.remove();
    document.body.removeChild(hiddenContainer); */
    
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