import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
//se instalo npm install leaflet.markercluster

// Importar la librería de markercluster (necesitarás instalarla)
let MarkerCluster;
if (typeof window !== 'undefined') {
  MarkerCluster = require('leaflet.markercluster');
}

const Clustering = ({ data, renderMarker }) => {
  const map = useMap();
  const clusterRef = useRef(null);

  useEffect(() => {
    // Inicializar el grupo de clusters si no existe
    if (!clusterRef.current && MarkerCluster) {
      clusterRef.current = new MarkerCluster.Group({
        chunkedLoading: true,
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        animate: true,
        animateAddingMarkers: true
      });
      
      // Añadir el grupo de clusters al mapa
      map.addLayer(clusterRef.current);
    }

    // Función para limpiar marcadores anteriores
    const clearMarkers = () => {
      if (clusterRef.current) {
        clusterRef.current.clearLayers();
      }
    };

    // Función para añadir marcadores al cluster
    const addMarkersToCluster = () => {
      if (!clusterRef.current || !data || !renderMarker) return;

      data.forEach(item => {
        const marker = renderMarker(item);
        if (marker) {
          clusterRef.current.addLayer(marker);
        }
      });
    };

    // Limpiar y volver a añadir marcadores cuando los datos cambien
    clearMarkers();
    addMarkersToCluster();

    // Cleanup al desmontar el componente
    return () => {
      if (clusterRef.current) {
        clearMarkers();
        map.removeLayer(clusterRef.current);
        clusterRef.current = null;
      }
    };
  }, [data, map, renderMarker]);

  return null;
};

// Función de utilidad para crear un marcador personalizado
export const createCustomMarker = (position, options = {}) => {
  const { iconUrl, iconSize, popupContent, className } = options;
  
  let icon = L.Icon.Default;
  if (iconUrl) {
    icon = L.icon({
      iconUrl,
      iconSize: iconSize || [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      className: className || ''
    });
  }

  const marker = L.marker(position, { icon });
  
  if (popupContent) {
    marker.bindPopup(popupContent);
  }

  return marker;
};

// Función de utilidad para crear un círculo marcador
export const createCircleMarker = (position, options = {}) => {
  const { radius, color, fillColor, fillOpacity, popupContent } = options;
  
  const circle = L.circleMarker(position, {
    radius: radius || 8,
    color: color || '#3388ff',
    fillColor: fillColor || '#3388ff',
    fillOpacity: fillOpacity || 0.2
  });
  
  if (popupContent) {
    circle.bindPopup(popupContent);
  }

  return circle;
};

export default Clustering;