// src/components/maps/MapAfects.jsx
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import {
  Slider,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";

// Importaciones locales
import imageLoad from "../../../assets/loading_map_3.gif";
import { cargardatoformId, generarPDF } from "./script.js";
import { cargarDatosPol } from "../../../components/maps/script/script.js";

// Componentes extraídos
import AfectMarkers from "./afect_view/AfectMarkers.jsx";
import SucepLayer from "./afect_view/PoligonosLayer.jsx";
import ParroquiaLayer from "./afect_view/ParroquiaLayer.jsx";
import { useMapIcons } from "./afect_view/useMapIcons.js";

// Estilos CSS de Leaflet
import "leaflet/dist/leaflet.css";

// Configuración de iconos para Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

// Constantes
const DEFAULT_POSITION = [-3.9939, -79.2042];

// Componente de capa de control
const LayerControl = ({ showLayer, onToggle }) => (
  <Box
    sx={{
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1000,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 2,
      boxShadow: 3,
      p: 1,
    }}
  >
    <Typography variant="subtitle2" fontWeight="bold">
      Mostrar polígonos de influencia
    </Typography>
    <input
      type="checkbox"
      checked={showLayer}
      onChange={onToggle}
      style={{ marginLeft: 8 }}
    />
  </Box>
);

// Componente principal
const MapAfects = ({
  afectData = [],
  parroquia = [],
  loading = false,
  error = null,
  coords = [],
  
  selectedDate,
  setSelectedDate,
  minFecha,
  maxFecha,
  radioAfect,
}) => {
  const [user, setUser] = useState(null);
  const [showLayer, setShowLayer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [poligonosData, setPoligonosData] = useState([]);
  const [loadingPoligonos, setLoadingPoligonos] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupElRef = useRef(null);

  // Hook para iconos
  const { getEventIcon, getEventIconPulso, COLOR_PRIORIDAD } = useMapIcons();

  // Función para cerrar popup
  const hidePopup = () => {
    if (mapRef.current) {
      mapRef.current.closePopup();
    }
  };

  // Función para capturar el mapa
  const printToPDF = () => {
    return new Promise(async (resolve, reject) => {
      if (!mapRef.current || !mapContainerRef.current) {
        reject("El mapa no está listo");
        return;
      }
      try {
        const mapElement = mapContainerRef.current;
        const leafletContainer = mapElement.querySelector(".leaflet-container");
        if (!leafletContainer) {
          reject("No se encontró el contenedor de Leaflet");
          return;
        }

        // Forzar visibilidad de capas
        const originalStyles = [];
        const panes = leafletContainer.querySelectorAll(".leaflet-pane");
        panes.forEach((pane) => {
          originalStyles.push({
            element: pane,
            visibility: pane.style.visibility,
            opacity: pane.style.opacity,
          });
          pane.style.visibility = "visible";
          pane.style.opacity = "1";
        });

        await new Promise((r) => setTimeout(r, 500));

        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(leafletContainer, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          allowTaint: false,
          foreignObjectRendering: true,
        });

        // Restaurar estilos
        originalStyles.forEach((style) => {
          style.element.style.visibility = style.visibility;
          style.element.style.opacity = style.opacity;
        });

        const imgData = canvas.toDataURL("image/png");
        resolve(imgData);
      } catch (error) {
        console.error("Error en captura:", error);
        reject(error);
      }
    });
  };

  // Cargar usuario desde localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
      console.log("Usuario cargado:", userData)
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

  const handleItemClick = useCallback(async (itemId) => {
    try {
      const itemData = await cargardatoformId(itemId);
      if (itemData) {
        setSelectedItem(itemData);
      }
    } catch (error) {
      console.error("Error al cargar datos del item:", error);
    }
  }, []);

  const handleGeneratePDF = useCallback(
    (event, lat, lng, selectedItem, user, printToPDF) => {
      generarPDF(event, lat, lng, selectedItem, user, printToPDF);
    },
    []
  );

  

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
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando datos del mapa
        </Typography>
        <img src={imageLoad} alt="Cargando mapa..." />
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

  const handleDateChange = (name, date) => {
    setSelectedDate((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  return (
    <Box sx={{ position: "relative" }} ref={mapContainerRef}>
      <LayerControl
        showLayer={showLayer}
        onToggle={(e) => setShowLayer(e.target.checked)}
      />

      {!afectData.length && (
        <Alert variant="filled" severity="error">
          No se ha encontrado datos de afectaciones. Por favor, intente con otra
          fecha, prioridad o criterios de búsqueda.
        </Alert>
      )}

      <MapContainer
        center={mapCenter}
        ref={mapRef}
        whenCreated={(map) => {
          mapRef.current = map;
          map.on("load", () => {
            console.log("Mapa completamente cargado");
          });
        }}
        zoom={14}
        style={{ height: "75vh", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />

        {/* Componentes extraídos */}
        <AfectMarkers
          afectData={afectData}
          selectedItem={selectedItem}
          onItemClick={handleItemClick}
          onGeneratePDF={handleGeneratePDF}
          getEventIcon={getEventIcon}
          getEventIconPulso={getEventIconPulso}
          COLOR_PRIORIDAD={COLOR_PRIORIDAD}
          user={user}
          printToPDF={printToPDF}
        />

        <SucepLayer
          poligonosData={poligonosData}
          showLayer={showLayer}
          loading={loadingPoligonos}
        />

        <ParroquiaLayer parroquia={parroquia} />

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

      {minFecha && maxFecha && (
        <Box sx={{ width: "100%", margin: "20px auto 0 auto" }}>
          <Slider
            value={selectedDate || maxFecha}
            min={minFecha}
            max={maxFecha}
            step={24 * 60 * 60 * 1000}
            onChange={(_, value) => handleDateChange("selectedDate", value)}
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
              height: 4,
              "& .MuiSlider-thumb": {
                backgroundColor: "#fff",
                border: "2px solid orange",
              },
              "& .MuiSlider-valueLabel": {
                backgroundColor: "orange",
                color: "#fff",
                borderRadius: "4px",
                padding: "4px 4px",
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
  afectData: PropTypes.array,
  parroquia: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  coords: PropTypes.array,

  selectedDate: PropTypes.number,
  setSelectedDate: PropTypes.func,
  minFecha: PropTypes.number,
  maxFecha: PropTypes.number,
  radioAfect: PropTypes.number,
};

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