import React from "react";
import { GeoJSON, Popup } from "react-leaflet";
import { Divider, Typography } from "@mui/material";

export const PolEventView = ({ polygon, formatDate }) => {
  // Función para determinar el estilo según la alerta
  const getStyle = (alerta) => {
    const colors = {
      roja: "#e6101b",
      naranja: "#ff8c00",
      amarilla: "#ffff00",
      verde: "#228b22",
    };
    
    return {
      fillColor: colors[alerta?.toLowerCase()] || "#3519d2",
      weight: 2,
      opacity: 1,
      color: "white", 
      dashArray: "3",
      fillOpacity: 0.5,
    };
  };

  return (
    <>
      {polygon && Array.isArray(polygon) && polygon.map((item, index) => {
        let geoJsonData = null;
        
        try {
          if (typeof item.Poligono === "string") {
            // El parseo maneja automáticamente los \r\n
            geoJsonData = JSON.parse(item.Poligono);
          } else {
            geoJsonData = item.Poligono;
          }
        } catch (error) {
          console.error("Error parseando GeoJSON:", error);
          return null;
        }

        if (!geoJsonData) return null;

        return (
          <GeoJSON
            key={`poly-${item.id || index}`}
            data={geoJsonData}
            style={() => getStyle(item.alerta)}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#e6101b", textTransform: 'uppercase', fontSize: '1.1rem' }}>
                  {item.event || "Evento"}
                </h3>
                <Typography variant="body2" sx={{ color: "#3519d2", fontWeight: 'bold' }}>
                  Estado: {item.estado} | Alerta: {item.alerta}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <p style={{ margin: "4px 0" }}><strong>Sector:</strong> {item.sector}</p>
                <p style={{ margin: "4px 0" }}><strong>Fecha:</strong> {formatDate(item.date_event)}</p>
                
                <Divider sx={{ my: 1 }} />
                
                <p style={{ fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>
                  <strong>Descripción:</strong> {item.Descripción}
                </p>
              </div>
            </Popup>
          </GeoJSON>
        );
      })}
    </>
  );
};