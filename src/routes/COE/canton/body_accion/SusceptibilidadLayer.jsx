import React from 'react';
import { GeoJSON } from 'react-leaflet';

function SusceptibilidadLayer({ susceptibilidad }) {
  if (!susceptibilidad || susceptibilidad.length === 0) return null;

  // Función para definir el estilo según el nivel de susceptibilidad
  const getStyle = (feature) => {
    const nivel = feature.properties?.nivel || feature.properties?.susceptibilidad;
    let color = "#ffeb3b"; // Amarillo - medio
    
    if (nivel === "alto" || nivel === "Alto") color = "#f44336";
    else if (nivel === "bajo" || nivel === "Bajo") color = "#4caf50";
    else if (nivel === "medio" || nivel === "Medio") color = "#ff9800";
    
    return {
      fillColor: color,
      weight: 1,
      opacity: 0.7,
      color: color,
      fillOpacity: 0.4,
    };
  };

  return (
    <>
      {susceptibilidad.map((item, index) => (
        <GeoJSON
          key={index}
          data={item.geometry || item}
          style={getStyle(item)}
          attribution="Susceptibilidad del terreno"
        />
      ))}
    </>
  );
}

export default SusceptibilidadLayer;