import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
//import { fetchData } from "../fire/FireSearch";
import { Box } from "@mui/material";

const n_color = {
  ALTA:"#3538dcff",
  //ALTA: "#dc3545",
  MEDIA: "#ffc107",
  BAJA: "#28a745",
  DEFAULT: "#a9a9aaff",
};
const MapBase = (props) => {
  console.log(props.selectedParroq)
  let position = [-3.9939, -79.2042];
  // console.log(props);
  const renderPolygons = () => {
    return props.data.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;
        let leafletCoords = [];
        const sect = item.properties;
        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);
          return (
            <Polygon
              eventHandlers={{
                click: () => {
                  console.log("Marker clicked:", sect.ID);
                  // Tu lógica aquí
                 // props.onSelectParroq(item.id);
                  props.onGetParroqData(item.id);
                },
              }}
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color:
                  sect.BARRIO == props.selectedParroq
                    ? n_color.ALTA
                    : n_color.DEFAULT,
                fillColor:
                  sect.BARRIO == props.selectedParroq
                    ? n_color.ALTA
                    : n_color.DEFAULT,
                fillOpacity: sect.BARRIO == props.selectedParroq ? 0.4 : 0.2,
                weight: sect.BARRIO == props.selectedParroq ? 3 : 2,
                // Opcional: agregar sombra o efectos
                shadow: sect.BARRIO == props.selectedParroq,
                shadowColor:
                  sect.BARRIO == props.selectedParroq
                    ? n_color.ALTA
                    : "transparent",
                shadowOpacity: 0.5,
                shadowRadius: 10,
              }}
            >
              <Popup>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h4 style={{ marginTop: 0 }}>
                      {sect.ID} - {sect.SECTOR}
                    </h4>
                    <p>
                      <strong>Parroquia:</strong> {sect.PARROQUIA}
                    </p>
                    <p>
                      <strong>Barrio:</strong> {sect.BARRIO}
                    </p>
                    <p>
                      <strong>Dirigente:</strong> {sect.PRESIDENTE}
                    </p>
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  const renderMarker = () => {
    // Verificar que props.dataEvent existe y es un array
    if (!props.dataEvent || !Array.isArray(props.dataEvent)) {
      console.warn("dataEvent no es un array válido:", props.dataEvent);
      return null;
    }
    const formatDate = (dateString) => {
      if (!dateString) return "Fecha no disponible";

      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return props.dataEvent
      .map((item) => {
        try {
          // Verificar que item existe y tiene las propiedades necesarias
          if (!item || item.lat == null || item.lng == null) {
            console.warn("Item inválido o sin coordenadas:", item);
            return null;
          }

          // Convertir a números por si acaso vienen como strings
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lng);

          // Verificar que las coordenadas son números válidos
          if (isNaN(lat) || isNaN(lng)) {
            console.warn("Coordenadas inválidas:", item);
            return null;
          }

          const leafletCoords = [lat, lng]; // CORREGIDO: [lat, lng]

          return (
            <Marker
              key={item.id || `marker-${Math.random()}`}
              position={leafletCoords}

              // pathOptions={{ color:'#ff0000'     }}
            >
              <Popup>
                <div>
                  <h3>
                    {formatDate(item.fecha)} - {item.sector}
                  </h3>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {item.detail || "No disponible"}
                  </p>
                  <p>
                    <strong>Observaciones:</strong>{" "}
                    {item.obs || "No disponible"}
                  </p>
                  <p>
                    <strong>Afectacion:</strong> {item.afect || "No disponible"}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        } catch (error) {
          console.error("Error al procesar marcador:", item, error);
          return null;
        }
      })
      .filter(Boolean); // Filtrar elementos null/undefined
  };
  if (props.loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh" // Ajusta según tu diseño
      ></Box>
    );
  if (props.error) return <div>{props.error}</div>;
  return (
    <MapContainer
      center={position}
      zoom={10}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        attribution="&copy; OpenStreetMap contributors"
      />
      {renderPolygons()}
      {props.dataEvent && renderMarker()}
    </MapContainer>
  );
};

export default MapBase;
