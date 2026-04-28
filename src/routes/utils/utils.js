import { useCallback } from "react";

export const parseByField = (byString) => {
  if (typeof byString !== "string") return byString;
  
  try {
    // Remover las llaves {} y espacios
    const cleanString = byString.replace(/[{}]/g, '').trim();
    
    // Separar por comas y crear objeto
    const obj = {};
    cleanString.split(',').forEach(pair => {
      const [key, ...valueParts] = pair.trim().split('=');
      let value = valueParts.join('=').trim();
      
      // Limpiar valores que pueden tener comillas
      value = value.replace(/^["']|["']$/g, '');
      
      // Convertir números si es posible
      if (!isNaN(value) && value !== '') {
        obj[key] = Number(value);
      } else {
        obj[key] = value;
      }
    });
    
    return obj;
  } catch (error) {
    console.error("Error parsing by field:", error);
    return { error: "Info no disponible" };
  }
};


export const extractCoordinates = (geom) => {
    if (!geom || !geom.coordinates) return null;
    try {
      // Para Point: [lng, lat]
      if (geom.type === "Point") {
        if (
          geom.coordinates.length >= 2 &&
          !isNaN(geom.coordinates[0]) &&
          !isNaN(geom.coordinates[1])
        ) {
          return { lat: geom.coordinates[1], lng: geom.coordinates[0] };
        }
      }
      // Para Polygon: coordinates[0][0] = primer punto del primer anillo
      if (
        geom.type === "Polygon" &&
        Array.isArray(geom.coordinates[0]) &&
        Array.isArray(geom.coordinates[0][0]) &&
        geom.coordinates[0][0].length >= 2
      ) {
        const [lng, lat] = geom.coordinates[0][0];
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
      // Para MultiPolygon: coordinates[0][0][0] = primer punto del primer anillo del primer polígono
      if (
        geom.type === "MultiPolygon" &&
        Array.isArray(geom.coordinates[0]) &&
        Array.isArray(geom.coordinates[0][0]) &&
        Array.isArray(geom.coordinates[0][0][0]) &&
        geom.coordinates[0][0][0].length >= 2
      ) {
        const [lng, lat] = geom.coordinates[0][0][0];
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
      return null;
    } catch (e) {
      console.error("Error al procesar geometría:", geom, e);
      return null;
    }
  };

 const useFormatCoords = () => {
  const format = useCallback((coords) => {
    // ... lógica
  }, []);
  return format;
};