import html2canvas from "html2canvas";

// Función para capturar un mapa basado en coordenadas y generar un PDF
export async function captureMap(lat, lng, zoom, polygon) {
  try {
    // Crear un contenedor oculto para el mapa
    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "absolute";
    hiddenContainer.style.left = "-9999px";
    hiddenContainer.style.width = "800px";
    hiddenContainer.style.height = "700px";
    document.body.appendChild(hiddenContainer);
    
    // Crear un div para el mapa
    const mapDiv = document.createElement("div");
    mapDiv.style.width = "100%";
    mapDiv.style.height = "100%";
    hiddenContainer.appendChild(mapDiv);
    
    // Cargar Leaflet dinámicamente
    await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
    await loadStyle("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    
    // Inicializar el mapa
    const tempMap = window.L.map(mapDiv, {
      zoomControl: false,
      attributionControl: false,
    });
    
    // Añadir capa de tiles
    window.L.tileLayer(
      "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    ).addTo(tempMap);
    
    if (polygon && Array.isArray(polygon) && polygon.length > 0) {
      // CORREGIR: Invertir coordenadas
      const corregido = polygon.map(coord => [coord[1], coord[0]]);
      
      // Crear polígono
      const polygonLayer = window.L.polygon(corregido, {
        color: "#d82800",
        weight: 5,
        opacity: 0.8,
        fillColor: "#f82d00",
        fillOpacity: 0.3,
      }).addTo(tempMap);
      
      // OPCIÓN 1: Centrar en el polígono (RECOMENDADA)
      const bounds = polygonLayer.getBounds();
      tempMap.fitBounds(bounds, { padding: [30, 30] });
      
      // OPCIÓN 2: Si quieres mantener el punto central como referencia
      // const allPoints = [...corregido, [lat, lng]];
      // const bounds = window.L.latLngBounds(allPoints);
      // tempMap.fitBounds(bounds, { padding: [30, 30] });
      
    } else {
      // Si no hay polígono, usar el centro proporcionado
      tempMap.setView([lat, lng], zoom);
      // Añadir marcador si no hay polígono
      window.L.marker([lat, lng]).addTo(tempMap);
    }
    
    // Esperar carga
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Capturar imagen
    const canvas = await html2canvas(mapDiv, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      scale: 2,
    });

    // Limpiar
    document.body.removeChild(hiddenContainer);
    
    return canvas.toDataURL("image/png");
    
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw error;
  }
}

// Función auxiliar para cargar scripts dinámicamente
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Función auxiliar para cargar estilos dinámicamente
export function loadStyle(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}
