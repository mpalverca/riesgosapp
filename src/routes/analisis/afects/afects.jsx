import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  Slider,
  Typography,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  FaWater,
  FaMountain,
  FaBuilding,
  FaExclamationTriangle,
} from "react-icons/fa";
import { renderToString } from "react-dom/server";
import { divIcon } from "leaflet";
import PropTypes from "prop-types";

// Importaciones locales
import imageLoad from "../../../assets/loading_map_3.gif";
import { cargardatoformId, generarPDF } from "./script.js";
import { cargarDatosPol } from "../../../components/maps/script/script.js";

// Estilos CSS de Leaflet
import "leaflet/dist/leaflet.css";

// Configuración de iconos para Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

// Constantes y configuraciones
const DEFAULT_POSITION = [-3.9939, -79.2042];
const COLOR_PRIORIDAD = {
  Alta: "#dc3545",
  Media: "#ffc107",
  Baja: "#28a745",
  DEFAULT: "#007bff",
};

const POLYGON_COLORS = {
  tipo1: { color: "#ffff00", fillColor: "#ffff00", fillOpacity: 0.2 },
  tipo2: { color: "#0000ff", fillColor: "#0000ff", fillOpacity: 0.2 },
  parroquia: { color: "#050505", fillColor: "#b6b1b1", fillOpacity: 0.2 },
};

const EVENT_ICONS = {
  "Movimiento en masas": { icon: FaMountain, color: "#FF5733" },
  Inundación: { icon: FaWater, color: "Blue" },
  "Colapso estructural": { icon: FaBuilding, color: "Blue" },
  default: { icon: FaExclamationTriangle, color: "#080808" },
};

// Componente para imagen expandida
const ExpandedImageModal = ({ src, onClose }) => (
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
    onClick={onClose}
    role="dialog"
    aria-label="Imagen expandida"
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
        src={src}
        alt="Imagen expandida"
        style={{
          maxWidth: "100%",
          maxHeight: "90vh",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      />
      <button
        onClick={onClose}
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
        aria-label="Cerrar imagen"
      >
        ×
      </button>
    </div>
  </div>
);

ExpandedImageModal.propTypes = {
  src: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Componente de capa de control
const LayerControl = ({ showLayer, onToggle }) => (
  <Paper
    sx={{
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1000,
      padding: 2,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 2,
      boxShadow: 3,
      minWidth: 200,
    }}
  >
    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      Control de Capas
    </Typography>
    <FormControlLabel
      control={
        <Checkbox
          checked={showLayer}
          onChange={onToggle}
          color="primary"
          aria-label="Mostrar capa de polígonos"
        />
      }
      label="Mostrar capa de polígonos"
    />
  </Paper>
);

LayerControl.propTypes = {
  showLayer: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

// Componente principal
const MapAfects = ({
  afectData = [],
  parroquia = [],
  loading = false,
  error = null,
  coords = [],
  extractCoordinates,
  selectedDate,
  setSelectedDate,
  minFecha,
  maxFecha,
}) => {
  const [expandedImage, setExpandedImage] = useState(null);
  const [user, setUser] = useState(null);
  const [showLayer, setShowLayer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [poligonosData, setPoligonosData] = useState([]);
  const [loadingPoligonos, setLoadingPoligonos] = useState(false);

  // Cargar usuario desde localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  }, []);

  // Cargar datos de polígonos cuando se activa la capa
  useEffect(() => {
    const loadPoligonos = async () => {
      if (showLayer && poligonosData.length === 0) {
        setLoadingPoligonos(true);
        try {
          const data = await cargarDatosPol();
          setPoligonosData(data || []);
        } catch (error) {
          console.error("Error al cargar polígonos:", error);
        } finally {
          setLoadingPoligonos(false);
        }
      }
    };

    loadPoligonos();
  }, [showLayer, poligonosData.length]);

  const handleIconClick = useCallback(async (itemId) => {
    try {
      const itemData = await cargardatoformId(itemId);
      if (itemData) {
        setSelectedItem(itemData);
      }
    } catch (error) {
      console.error("Error al cargar datos del item:", error);
    }
  }, []);

  const formatCoords = useCallback((coord) => {
    return typeof coord === "number" ? coord.toFixed(6) : "0.000000";
  }, []);

  const getEventIcon = useCallback((eventType, priority) => {
    const color = COLOR_PRIORIDAD[priority] || COLOR_PRIORIDAD.DEFAULT;
    const eventConfig = EVENT_ICONS[eventType] || EVENT_ICONS.default;
    const IconComponent = eventConfig.icon;

    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: color,
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    };

    const html = renderToString(
      <div style={circleStyle}>
        <IconComponent color={eventConfig.color} size={14} />
      </div>,
    );

    return divIcon({
      html,
      className: "custom-leaflet-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }, []);

  const getEventIconPulso = useCallback((eventType, priority, radio) => {
    const color = COLOR_PRIORIDAD[priority] || COLOR_PRIORIDAD.DEFAULT;
    const eventConfig = EVENT_ICONS[eventType] || EVENT_ICONS.default;
    const IconComponent = eventConfig.icon;

    // Calcular tamaño basado en el radio
    const baseSize = 40; // Tamaño base en píxeles
    const radioFactor = radio / 25; //Math.min(Math.max(radio / 100, 1), 5); // Factor entre 1 y 5
    const calculatedSize = baseSize * radioFactor;

    // Tamaños proporcionales
    const outerCircleSize = calculatedSize;
    const middleCircleSize = calculatedSize * 0.75;
    const innerCircleSize = calculatedSize * 0.6;

    const html = renderToString(
      <div
        style={{
          position: "relative",
          width: `${outerCircleSize}px`,
          height: `${outerCircleSize}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Círculos concéntricos animados - tamaño basado en radio */}
        <div
          style={{
            position: "absolute",
            width: `${outerCircleSize}px`,
            height: `${outerCircleSize}px`,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: 0.3,
            animation: "pulse 2s infinite",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: `${middleCircleSize}px`,
            height: `${middleCircleSize}px`,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: 0.5,
            animation: "pulse 2s infinite",
            animationDelay: "0.5s",
          }}
        />

        {/* Círculo central con icono */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: color,
            borderRadius: "50%",
            width: `24px`,
            height: `24px`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
            position: "relative",
          }}
        >
          <IconComponent color="white" size={12} />
        </div>
      </div>,
    );

    return divIcon({
      html,
      className: `custom-leaflet-icon emergency-alert radio-${Math.round(radio)}`,
      iconSize: [outerCircleSize, outerCircleSize],
      iconAnchor: [outerCircleSize / 2, outerCircleSize],
    });
  }, []);

  const renderAfectMarkers = useMemo(() => {
    return afectData
      .map((item, index) => {
        try {
          if (!item?.geom) {
            console.warn("Item sin geometría:", item);
            return null;
          }

          const coords = extractCoordinates?.(item.geom);
          if (
            !coords ||
            typeof coords.lat !== "number" ||
            typeof coords.lng !== "number"
          ) {
            console.warn("Coordenadas inválidas para el item:", item);
            return null;
          }

          const eventType = item.event || "default";
          const priority = item.prioridad || "DEFAULT";
          return (
            <Marker
              key={`marker-${item.id || `index-${index}`}`}
              position={[coords.lat, coords.lng]}
              icon={
                item.radio > 0 &&
                priority == "Alta" &&
                item.estado == "Pendiente"
                  ? getEventIconPulso(eventType, priority, item.radio)
                  : getEventIcon(eventType, priority)
              }
              eventHandlers={{
                click: () => handleIconClick(item.id),
              }}
            >
              {selectedItem?.id === item.id && (
                <Popup>
                  <div>
                    <h4>{`${item.id} - ${eventType}`}</h4>

                    {selectedItem.anex_foto && (
                      <div style={{ marginTop: "10px", position: "relative" }}>
                        {/* Dividir las URLs por coma y procesarlas */}
                        {(() => {
                          // Procesar las imágenes
                          const images = selectedItem.anex_foto
                            .split(",")
                            .map((url) => url.trim())
                            .filter((url) => url.length > 0);

                          // Si solo hay una imagen, mostrarla directamente
                          if (images.length === 1) {
                            return (
                              <div>
                                <img
                                  src={images[0]}
                                  alt={`Imagen de ${selectedItem.nombre || "afectación"}`}
                                  style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "contain",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                    cursor: "pointer",
                                    backgroundColor: "#f5f5f5",
                                  }}
                                  onClick={() => setExpandedImage(images[0])}
                                />
                                <p
                                  style={{
                                    fontSize: "0.8em",
                                    color: "#666",
                                    textAlign: "center",
                                    marginTop: "4px",
                                  }}
                                >
                                  Haz clic para ampliar
                                </p>
                              </div>
                            );
                          }

                          // Si hay múltiples imágenes, crear carrusel con JavaScript
                          let currentIndex = 0;

                          return (
                            <div style={{ height: "220px" }}>
                              {/* Contenedor principal con altura fija */}
                              <div
                                id="imageCarousel"
                                style={{
                                  position: "relative",
                                  height: "200px",
                                }}
                              >
                                {/* Botones de navegación */}
                                {images.length > 1 && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const carousel =
                                          document.getElementById(
                                            "imageCarousel",
                                          );
                                        const img =
                                          carousel.querySelector("img");
                                        currentIndex =
                                          currentIndex === 0
                                            ? images.length - 1
                                            : currentIndex - 1;
                                        img.src = images[currentIndex];
                                        const indicator =
                                          document.getElementById(
                                            "currentIndicator",
                                          );
                                        if (indicator)
                                          indicator.textContent = `${currentIndex + 1}/${images.length}`;
                                      }}
                                      style={{
                                        position: "absolute",
                                        left: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        zIndex: 2,
                                        background: "rgba(0,0,0,0.5)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      &lt;
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const carousel =
                                          document.getElementById(
                                            "imageCarousel",
                                          );
                                        const img =
                                          carousel.querySelector("img");
                                        currentIndex =
                                          currentIndex === images.length - 1
                                            ? 0
                                            : currentIndex + 1;
                                        img.src = images[currentIndex];
                                        const indicator =
                                          document.getElementById(
                                            "currentIndicator",
                                          );
                                        if (indicator)
                                          indicator.textContent = `${currentIndex + 1}/${images.length}`;
                                      }}
                                      style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        zIndex: 2,
                                        background: "rgba(0,0,0,0.5)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      &gt;
                                    </button>
                                  </>
                                )}

                                {/* Imagen principal */}
                                <img
                                  src={images[0]}
                                  alt={`Imagen 1 de ${images.length}`}
                                  style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "contain",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                    cursor: "pointer",
                                    backgroundColor: "#f5f5f5",
                                  }}
                                  onClick={() =>
                                    setExpandedImage(images[currentIndex])
                                  }
                                />

                                {/* Indicador de posición */}
                                {images.length > 1 && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      bottom: "10px",
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      background: "rgba(0,0,0,0.7)",
                                      color: "white",
                                      padding: "2px 10px",
                                      borderRadius: "10px",
                                      fontSize: "0.8em",
                                    }}
                                  >
                                    <span id="currentIndicator">
                                      1/{images.length}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Puntos indicadores */}
                              {images.length > 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "6px",
                                    marginTop: "8px",
                                    height: "12px",
                                  }}
                                >
                                  {images.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const carousel =
                                          document.getElementById(
                                            "imageCarousel",
                                          );
                                        const img =
                                          carousel.querySelector("img");
                                        currentIndex = index;
                                        img.src = images[currentIndex];
                                        const indicator =
                                          document.getElementById(
                                            "currentIndicator",
                                          );
                                        if (indicator)
                                          indicator.textContent = `${currentIndex + 1}/${images.length}`;
                                      }}
                                      style={{
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "50%",
                                        border: "none",
                                        backgroundColor:
                                          index === currentIndex
                                            ? "orange"
                                            : "#ccc",
                                        cursor: "pointer",
                                        padding: 0,
                                      }}
                                      aria-label={`Ir a imagen ${index + 1}`}
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Texto instructivo */}
                              <p
                                style={{
                                  fontSize: "0.8em",
                                  color: "#666",
                                  textAlign: "center",
                                  marginTop: "4px",
                                }}
                              >
                                Haz clic en la imagen para ampliar
                              {/*   {images.length > 1 &&
                                  ` (usa las flechas para navegar)`} */}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <p>
                      <strong>Fecha:</strong>{" "}
                      {selectedItem.date || "No disponible"}
                    </p>
                    <p>
                      <strong>Sector:</strong>{" "}
                      {selectedItem.sector || "No disponible"}
                    </p>
                    <p>
                      <strong>Ubicación:</strong> {formatCoords(coords.lat)},{" "}
                      {formatCoords(coords.lng)}
                    </p>
                    <p>
                      <strong>Prioridad:</strong>
                      <span
                        style={{
                          color:
                            COLOR_PRIORIDAD[priority] ||
                            COLOR_PRIORIDAD.DEFAULT,
                        }}
                      >
                        {" "}
                        {priority}
                      </span>
                    </p>

                    {selectedItem.descripcio && (
                      <p>
                        <strong>Descripción:</strong> {selectedItem.descripcio}
                      </p>
                    )}

                    {user && (
                      <Button
                        onClick={() =>
                          generarPDF(
                            selectedItem.event,
                            coords.lat,
                            coords.lng,
                            selectedItem,
                            user,
                          )
                        }
                        fullWidth
                        sx={{
                          background:
                            "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
                          marginTop: "16px",
                          fontWeight: "bold",
                        }}
                        variant="contained"
                      >
                        Generar Reporte PDF
                      </Button>
                    )}
                  </div>
                </Popup>
              )}
            </Marker>
          );
        } catch (error) {
          console.error("Error al renderizar marcador:", item, error);
          return null;
        }
      })
      .filter(Boolean);
  }, [
    afectData,
    selectedItem,
    user,
    formatCoords,
    getEventIcon,
    handleIconClick,
    extractCoordinates,
  ]);

  const renderPoligonos = useMemo(() => {
    if (!showLayer || loadingPoligonos) return null;

    return poligonosData
      .flatMap((item, index) => {
        try {
          if (!item?.geom?.coordinates) return null;

          return item.geom.coordinates.map((polygon, polyIndex) => {
            const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);
            const colors =
              item.tipo === 1 ? POLYGON_COLORS.tipo1 : POLYGON_COLORS.tipo2;

            return (
              <Polygon
                key={`poligono-${item.id}-${index}-${polyIndex}`}
                positions={polyCoords}
                pathOptions={{
                  color: colors.color,
                  fillColor: colors.fillColor,
                  fillOpacity: colors.fillOpacity,
                  weight: 2,
                }}
              >
                <Popup>
                  <div>
                    <h4>Polígono {item.id}</h4>
                    <p>
                      <strong>Descripción:</strong>{" "}
                      {item.Descripcio || "Sin descripción"}
                    </p>
                  </div>
                </Popup>
              </Polygon>
            );
          });
        } catch (error) {
          console.error("Error al renderizar polígono:", item, error);
          return null;
        }
      })
      .filter(Boolean);
  }, [poligonosData, showLayer, loadingPoligonos]);

  const renderParroquiaPolygons = useMemo(() => {
    return parroquia
      .flatMap((item, index) => {
        if (!item?.geom || item.geom.type !== "MultiPolygon") return null;

        return item.geom.coordinates.map((poly, polyIdx) => {
          const polyCoords = poly[0].map((coord) => [coord[1], coord[0]]);

          return (
            <Polygon
              key={`parroquia-${item.id || index}-${polyIdx}`}
              positions={polyCoords}
              pathOptions={{
                color: POLYGON_COLORS.parroquia.color,
                fillColor: POLYGON_COLORS.parroquia.fillColor,
                fillOpacity: POLYGON_COLORS.parroquia.fillOpacity,
                weight: 2,
              }}
            >
              <Popup>
                <strong>Parroquia:</strong> {item.DPA_DESPAR || "Sin nombre"}
              </Popup>
            </Polygon>
          );
        });
      })
      .filter(Boolean);
  }, [parroquia]);

  // Calcular posición del mapa
  const mapCenter = useMemo(() => {
    if (coords && coords.length >= 2) {
      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
    return DEFAULT_POSITION;
  }, [coords]);

  // Estados de carga y error
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <img
          src={imageLoad}
          alt="Cargando mapa..."
          //style={{ maxWidth: "200px" }}
        />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando datos del mapa...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  if (!afectData.length) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        textAlign="center"
        p={3}
      >
        <Typography variant="h5" gutterBottom color="textSecondary">
          No hay datos de afectaciones
        </Typography>
        <Typography variant="body1" color="textSecondary">
          La búsqueda realizada no ha encontrado datos de afectaciones. Por
          favor, intente con otra fecha, prioridad o criterios de búsqueda.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
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

      <LayerControl
        showLayer={showLayer}
        onToggle={(e) => setShowLayer(e.target.checked)}
      />

      <MapContainer
        center={mapCenter}
        zoom={14}
        style={{ height: "75vh", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />

        {renderAfectMarkers}
        {renderPoligonos}
        {renderParroquiaPolygons}

        {loadingPoligonos && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 1000,
              background: "white",
              padding: "5px 10px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            Cargando polígonos...
          </div>
        )}
      </MapContainer>

      {expandedImage && (
        <ExpandedImageModal
          src={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      )}

      {minFecha && maxFecha && (
        <Box sx={{ width: "90%", margin: "30px auto 0 auto" }}>
          <Slider
            value={selectedDate || maxFecha}
            min={minFecha}
            max={maxFecha}
            step={24 * 60 * 60 * 1000}
            onChange={(_, value) => setSelectedDate(value)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) =>
              new Date(value).toLocaleDateString("es-EC", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }
            sx={{
              color: "orange",
              height: 8,
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
        </Box>
      )}
    </Box>
  );
};

// PropTypes para validación de props
MapAfects.propTypes = {
  afectData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      geom: PropTypes.string,
      event: PropTypes.string,
      prioridad: PropTypes.string,
    }),
  ),
  parroquia: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      geom: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.array,
      }),
      DPA_DESPAR: PropTypes.string,
    }),
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  coords: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  extractCoordinates: PropTypes.func.isRequired,
  selectedDate: PropTypes.number,
  setSelectedDate: PropTypes.func,
  minFecha: PropTypes.number,
  maxFecha: PropTypes.number,
  radioAfect: PropTypes.number,
};

// Valores por defecto
MapAfects.defaultProps = {
  afectData: [],
  parroquia: [],
  loading: false,
  error: null,
  coords: [],
  selectedDate: null,
  minFecha: null,
  maxFecha: null,
  radioAfect: 1000,
};

export default React.memo(MapAfects);
