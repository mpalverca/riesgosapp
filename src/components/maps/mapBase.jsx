import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import urku from "../../assets/Urku_el_puma.png";
const n_color = {
  ALTA: "#dc3545",
  MEDIA: "#ffc107",
  BAJA: "#28a745",
  DEFAULT: "#007bff",
};
const MapBase = (props) => {
  let position = [-3.9939, -79.2042];
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
  if (props.loading) return <div>Cargando mapa...</div>;
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
    </MapContainer>
  );
};

export default MapBase;
