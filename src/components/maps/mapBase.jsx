import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import fireIconL from "../../assets/fire.png";
import imageLoad from "../../assets/loading_map_3.gif";
import urku from "../../assets/Urku_el_puma.png";
import { fetchData } from "../fire/FireSearch";
import { Box } from "@mui/material";

const n_color = {
  ALTA: "#dc3545",
  MEDIA: "#ffc107",
  BAJA: "#28a745",
  DEFAULT: "#007bff",
};
const MapBase = (props) => {
  let position = [-3.9939, -79.2042];
  console.log(props.dataEvent);
  const renderPolygons = () => {
    return props.data.map((item) => {
      try {
        const coordinates = item.geom.coordinates;
        let leafletCoords = [];
        if (item.geom.type === "Polygon") {
          // Convertir coordenadas GeoJSON (Polygon) a formato Leaflet
          leafletCoords = coordinates[0].map((coord) => [coord[1], coord[0]]);
          return (
            <Polygon
              key={item.id}
              positions={leafletCoords}
              pathOptions={{
                color:
                  item.n_alert == "Alto"
                    ? n_color.ALTA
                    : item.n_alert == "Medio"
                    ? n_color.BAJA
                    : n_color.BAJA,
                fillColor:
                  item.n_alert == "Alto"
                    ? n_color.ALTA
                    : item.n_alert == "Medio"
                    ? n_color.BAJA
                    : n_color.BAJA,
                fillOpacity: 0.2,
                weight: 2,
              }}
            >
              <Popup>
                <div>
                  <h3>{item.id}</h3>
                  <p>
                    <strong>Descripción:</strong> {item.Descripcio}
                  </p>
                </div>
              </Popup>
            </Polygon>
          );
        } else if (item.geom.type === "MultiPolygon") {
          // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
          return coordinates.map((polygon, index) => {
            const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);

            return (
              <Polygon
                eventHandlers={{
                  click: () => {
                    console.log("Marker clicked:", item.id);
                    // Tu lógica aquí
                    props.onSelectParroq(item.id);
                    props.onGetParroqData(item.id);
                    fetchData(item.DPA_DESPAR, props.setEvent);
                  },
                }}
                key={`N° ${item.id}-${index}`}
                positions={polyCoords}
                pathOptions={{
                  color:
                    item.n_alert == "Alto"
                      ? n_color.ALTA
                      : item.n_alert == "Medio"
                      ? n_color.MEDIA
                      : n_color.BAJA,
                  fillColor:
                    item.n_alert == "Alto"
                      ? n_color.ALTA
                      : item.n_alert == "Medio"
                      ? n_color.MEDIA
                      : n_color.BAJA,
                  fillOpacity: 0.2,
                  weight: 2,
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
                    <img
                      src={urku}
                      alt="Icono de alerta"
                      style={{
                        width: "60px",
                        height: "120px",
                        borderRadius: "4px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h4 style={{ marginTop: 0 }}>
                        {item.id} - {item.DPA_DESPAR}
                      </h4>
                      <p>
                        <strong>Nivel Alerta:</strong> {item.n_alert}
                      </p>
                      <p>
                        <strong>Vigencia:</strong> {item.date_init} -{" "}
                        {item.date_end}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          });
        } else {
          console.warn(
            `Tipo de geometría no soportado: ${item.geom.type}`,
            item
          );
          return null;
        }
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

    // Crear el icono de fuego
    const fireIcon = new L.Icon({
      //iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconUrl: fireIconL,
      iconSize: [25, 30],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

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
    // Opcional: Icono personalizado de fuego (puedes reemplazar la URL)
    // const fireIcon = new L.Icon({
    //     iconUrl: 'https://cdn-icons-png.flaticon.com/512/606/606797.png',
    //     iconSize: [30, 30],
    //     iconAnchor: [15, 30],
    //     popupAnchor: [0, -30]
    // });

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
              icon={fireIcon} // Agregado el icono de fuego
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
                    <strong>Afectacion:</strong>{" "}
                    {item.afect || "No disponible"}
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
  if (props.loading)  return (
      <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh" // Ajusta según tu diseño
  >
        <img src={imageLoad} alt="Descripción de la imagen" />
      </Box>
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
