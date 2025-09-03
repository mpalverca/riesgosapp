import React, { useEffect, useState,useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
} from "react-leaflet";
import L from "leaflet";
import { Slider, Typography, Box, Button } from "@mui/material";
import Clustering, { createCustomMarker, createCircleMarker } from './clustering';
// ...otros imports...
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { renderToString } from "react-dom/server";
import { generarPDF } from "./script.js";
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

const MapAfects = ({
  afectData,
  parroquia,
  loading,
  error,
  coords,
  extractCoordinates,
  selectedDate,
  setSelectedDate,
  minFecha,
  maxFecha,
  radioAfect,
}) => {
  // Estado para controlar qué imagen está expandida
  const [expandedImage, setExpandedImage] = useState(null);
  const [user, setUser] = useState(null);
  const position = [-3.9939, -79.2042];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

   // Función para renderizar marcadores de afectaciones
  const renderAfectMarker = useCallback((item) => {
    if (!item.latitud || !item.longitud) return null;
    
    const position = [parseFloat(item.latitud), parseFloat(item.longitud)];
    
    // Personaliza según tus necesidades
    const popupContent = `
      <div>
        <h3>${item.tipo || 'Afectación'}</h3>
        <p>${item.descripcion || 'Sin descripción'}</p>
        ${item.imagen ? `<img src="${item.imagen}" alt="Imagen" style="max-width: 100px; max-height: 100px; cursor: pointer;" onclick="window.openImage('${item.imagen}')">` : ''}
      </div>
    `;
    
    return createCustomMarker(position, {
      iconUrl: '/marker-icon.png', // Ruta a tu icono personalizado
      popupContent,
      className: 'custom-marker'
    });
  }, []);

  // Función para comparar fechas ignorando la hora
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
          const priority = item.prioridad || "DEFAULT";
          // Dentro de tu componente:
          const getEventIcon = (eventType) => {
            const color = color_prioridad[priority] || color_prioridad.DEFAULT;
            const iconComponent =
              eventType === "Movimiento en masas" ? (
                <FaMountain color="#FF5733" />
              ) : eventType === "Inundación" ? (
                <FaWater color="Blue" />
              ) : eventType === "Colapso estructural" ? (
                <FaBuilding color="Blue" />
              ) : (
                <FaExclamationTriangle />
              );
            // Círculo de color según prioridad
            const circleStyle = {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: color,
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            };

            const html = renderToString(
              <div style={circleStyle}>{iconComponent}</div>
            );

            return divIcon({
              html,
              className: "custom-leaflet-icon", // Opcional: añade estilos CSS si necesitas
              iconSize: [30, 30],
              iconAnchor: [15, 30], // Ajusta el tamaño según necesites
            });
          };

          return (
            <div>
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
                            color_prioridad[priority] ||
                            color_prioridad.DEFAULT,
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
                    {user && (
                      <Button
                        onClick={() =>
                          generarPDF(
                            item.EVENTO,
                            coords.lat,
                            coords.lng,
                            item,
                            user
                          )
                        }
                        fullWidth
                        style={{
                          background:
                            "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
                          //marginTop: "16px",
                          //  padding: "10px 0",
                        }}
                        //size="large"
                        variant="contained"
                      >
                        <strong>Generar Reporte PDF</strong>
                      </Button>
                    )}
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        } catch (error) {
          console.error("Error al procesar elemento:", item, error);
          return null;
        }
      })
      .filter(Boolean); // Filtramos cualquier marcador nulo
  };
  // Función para comparar fechas ignorando la hora
  const renderRadio = () => {
    return radioAfect
      .map((item, index) => {
        try {
          const coords = item.coords;

          if (!coords) {
            console.warn("Coordenadas inválidas para el item:", item);
            return null;
          }
          // Usa el color según la prioridad
          const color =
            color_prioridad[item.prioridad] || color_prioridad.DEFAULT;
          if (item.radio > 0) {
            return (
              <React.Fragment key={`circle-group-${item.id || index}`}>
                {/* Círculo principal */}
                <Circle
                  center={[coords[1], coords[0]]}
                  radius={item.radio}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <p>
                      <strong>Radio:</strong> radio de afectación {item.radio}
                    </p>
                  </Popup>
                </Circle>
                {/* Círculo de pulso */}
                <Circle
                  center={[coords[1], coords[0]]}
                  radius={item.radio * 0.7}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.15,
                    weight: 1,
                  }}
                  className="leaflet-pulse-circle"
                />
              </React.Fragment>
            );
          }
          return null;
        } catch (error) {
          console.error("Error al procesar elemento:", item, error);
          return null;
        }
      })
      .filter(Boolean);
  };

  const renderParroquia = () => {
    return parroquia.map((item, index) => {
      if (item.geom.type === "MultiPolygon") {
        return item.geom.coordinates.map((poly, polyIdx) => {
          const polyCoords = poly[0].map(
            (coord) => [coord[1], coord[0]] // Leaflet usa [lat, lng]
          );
          return (
            <Polygon
              key={`N° ${item.id || index}-${polyIdx}`}
              positions={polyCoords}
              pathOptions={{
                color: "#050505ff",
                fillColor: "#b6b1b1ff",
                fillOpacity: 0.2,
                weight: 2,
              }}
            >
              <Popup>Parroquia: {item.DPA_DESPAR}</Popup>
            </Polygon>
          );
        });
      }
      return null;
    });
  };

  if (loading) return <div className="loading-message">Cargando mapa...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!afectData.length)
    return (
      <div
        className="no-data-message"
        style={{
          textAlign: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <strong>No hay datos de afectaciones </strong>
        <Typography>
          La busqueda realizada no ha encontrado datos de afectaciones, por
          favor intente con otra fecha, Prioridad, estado y afectaciones
        </Typography>
      </div>
    );

  return (
    <div>
      <style>
        {`
        .leaflet-pulse-circle {
          animation: pulse 2s infinite;
          opacity: 0.3;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.9);
            opacity: 0.5;
          }
          70% {
            transform: scale(1.2);
            opacity: 0.2;
          }
          100% {
            transform: scale(0.9);
            opacity: 0.5;
          }
        }
      `}
      </style>
      <MapContainer
        center={[
          coords && coords[0] ? parseFloat(coords[0]) : position[0],
          coords && coords[1] ? parseFloat(coords[1]) : position[1],
        ]}
        zoom={14}
        style={{ height: "75vh", width: "100%" }}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker
          position={[
            coords && coords[0] ? parseFloat(coords[0]) : 0,
            coords && coords[1] ? parseFloat(coords[1]) : 0,
          ]}
        >
        <Popup>Ubicación central de referencia</Popup>
        </Marker>

        {renderAfect()}
         
        {/* Componente de clustering para afectaciones */}
       {/*  <Clustering data={afectData} renderMarker={renderAfectMarker} /> */}
        {renderRadio()}
        {renderParroquia()}
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
      {minFecha && maxFecha && (
        <div style={{ width: "90%", margin: "30px auto 0 auto" }}>
          <Slider
            value={selectedDate || maxFecha}
            min={minFecha}
            max={maxFecha}
            step={24 * 60 * 60 * 1000} // un día en ms
            onChange={(_, value) => setSelectedDate(value)}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) =>
              new Date(v).toLocaleDateString("es-EC", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }
            sx={{
              color: "orange", // Color naranja para la barra
              height: 8, // Grosor de la barra
              "& .MuiSlider-thumb": {
                backgroundColor: "#fff",
                border: "2px solid orange",
              },
              "& .MuiSlider-valueLabel": {
                backgroundColor: "orange",
                color: "#fff",
                borderRadius: "4px",
                padding: "4px 8px",
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "-10px",
              fontSize: "0.75rem",
              color: "text.secondary",
            }}
          >
            <span>
              {new Date(minFecha).toLocaleDateString("es-EC", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>
              {new Date(maxFecha).toLocaleDateString("es-EC", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </Box>
        </div>
      )}
    </div>
  );
};

export default MapAfects;
