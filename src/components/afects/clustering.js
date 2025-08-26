import { useMemo } from 'react';

 const useClusteredData = (data, zoom, options = {}) => {
  const {
    clusterRadius = 0.01, // radio en grados
    minClusterZoom = 10
  } = options;

  return useMemo(() => {
    if (zoom >= minClusterZoom) {
      return data; // Mostrar todos los puntos en zoom alto
    }

    const clusters = [];
    const usedPoints = new Set();

    data.forEach((point, index) => {
      if (usedPoints.has(index)) return;

      // Encontrar puntos cercanos para clusterizar
      const nearbyPoints = data.filter((p, i) => {
        if (usedPoints.has(i)) return false;
        
        const distance = Math.sqrt(
          Math.pow(p.lat - point.lat, 2) + 
          Math.pow(p.lng - point.lng, 2)
        );
        
        return distance < clusterRadius;
      });

      if (nearbyPoints.length > 1) {
        // Crear cluster
        const avgLat = nearbyPoints.reduce((sum, p) => sum + p.lat, 0) / nearbyPoints.length;
        const avgLng = nearbyPoints.reduce((sum, p) => sum + p.lng, 0) / nearbyPoints.length;
        
        clusters.push({
          type: 'cluster',
          lat: avgLat,
          lng: avgLng,
          count: nearbyPoints.length,
          points: nearbyPoints
        });

        // Marcar puntos como usados
        nearbyPoints.forEach((_, i) => {
          const originalIndex = data.findIndex(p => 
            p.lat === nearbyPoints[i].lat && 
            p.lng === nearbyPoints[i].lng
          );
          if (originalIndex !== -1) {
            usedPoints.add(originalIndex);
          }
        });
      } else {
        // Punto individual
        clusters.push({ ...point, type: 'point' });
        usedPoints.add(index);
      }
    });

    return clusters;
  }, [data, zoom, clusterRadius, minClusterZoom]);
};

export default useClusteredData