import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from 'leaflet';
import { renderToString } from 'react-dom/server';
import {
  FaWater,
  FaMountain,
  FaBuilding,
  FaFire,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FaHouseDamage } from "@react-icons/all-files/fa/FaHouseDamage";
import { cargarDatosafec } from "./script.js";

// Configuración de iconos para Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const color_prioridad = {
  Alta: "#dc3545",
  Media: "#ffc107",
  Baja: "#28a745",
  DEFAULT: "#007bff",
};

const MapAfects = ({afectData,loading,error,coords }) => {
console.log(coords)
  // Estado para controlar qué imagen está expandida
  const [expandedImage, setExpandedImage] = useState(null);
  const position = [-3.9939, -79.2042];
  const extractCoordinates = (geom) => {
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
  const renderAfect = () => {
    return afectData
      .map((item, index) => {
        try {
          const coords = extractCoordinates(item.geom);
          if (!coords) {
            console.warn("Coordenadas inválidas para el item:", item);
            return null;
          }
          const formatCoords = (coord) => {
            return coord.toFixed(6);
          };
          const eventType = item.EVENTO || "DEFAULT";
          const priority = item.PRIORIDAD || "DEFAULT";
          // Dentro de tu componente:
          const getEventIcon = (eventType) => {
            const iconComponent =
              eventType === "Movimiento en masas" ? (
                <FaMountain color="#FF5733"/>
              ) : eventType === "Inundación" ? (
                <FaWater color="Blue"  />
              ) : eventType === "Colapso estructural" ? (
                <FaBuilding color="Blue"  />
              ): (
                <FaExclamationTriangle />
              );

            return divIcon({
              html: renderToString(iconComponent),
              className: "custom-leaflet-icon", // Opcional: añade estilos CSS si necesitas
              iconSize: [30, 30],
              iconAnchor: [15, 30], // Ajusta el tamaño según necesites
            });
          };

          return (
            <Marker
              key={`marker-${item.id || index}`}
              position={[coords.lat, coords.lng]}
              //icon={createCustomIcon(priority, eventType)}
              icon={getEventIcon(eventType)}
              
            >
              {" "}
              <Popup>
                <div>
                  <h4>
                    {item.nombre ||
                      `${item.id} - ${eventType}` ||
                      `Evento ${index + 1}`}
                  </h4>
                  {/* Sección para mostrar imágenes si existen */}
                  {item.ANEX_FOT && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={item.ANEX_FOT}
                        alt={`Imagen de ${item.nombre || "afectación"}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                        }}
                        onClick={() => setExpandedImage(item.ANEX_FOT)}
                      />
                      <p
                        style={{
                          fontSize: "0.8em",
                          color: "#666",
                          textAlign: "center",
                        }}
                      >
                        Haz clic para ampliar
                      </p>
                    </div>
                  )}
                  <p>
                    <strong>fecha:</strong> {item.FECHA}
                  </p>
                  <p>
                    <strong>Sector:</strong> {item.sector_barrio}
                  </p>
                  <p>
                    <strong>ubicación:</strong> {formatCoords(coords.lat)},{" "}
                    {formatCoords(coords.lng)}
                  </p>
                  <p>
                    <strong>Prioridad:</strong>
                    <span
                      style={{
                        color:
                          color_prioridad[priority] || color_prioridad.DEFAULT,
                      }}
                    >
                      {priority}
                    </span>
                  </p>
                  {item.descripcion && (
                    <p>
                      <strong>Descripción:</strong> {item.descripcion}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        } catch (error) {
          console.error("Error al procesar elemento:", item, error);
          return null;
        }
      })
      .filter(Boolean); // Filtramos cualquier marcador nulo
  };

  if (loading) return <div className="loading-message">Cargando mapa...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!afectData.length)
    return <div className="no-data-message">No hay datos de afectaciones</div>;

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* <Marker position={position}>
        <Popup>Ubicación central de referencia</Popup>
      </Marker> */}
      {renderAfect()}
      {/* Modal para imagen expandida */}
      {expandedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setExpandedImage(null)}
        >
          <div
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImage}
              alt="Imagen expandida"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
            />
            <button
              onClick={() => setExpandedImage(null)}
              style={{
                position: "absolute",
                top: "-15px",
                right: "-15px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </MapContainer>
  );
};

export default MapAfects;
