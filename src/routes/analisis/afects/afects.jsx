// src/components/maps/MapAfects.jsx
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import {
  Slider,
  Typography,
  Box,
  Alert,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

// Estilos CSS de Leaflet
import "leaflet/dist/leaflet.css";

// Importaciones locales
import imageLoad from "../../../assets/loading_map_3.gif";
import { cargardatoformId, generarPDF } from "./script.js";
import { cargarDatosPol } from "../../../components/maps/script/script.js";
import AfectMarkers from "./afect_view/AfectMarkers.jsx";
import SucepLayer from "./afect_view/PoligonosLayer.jsx";
import ParroquiaLayer from "./afect_view/ParroquiaLayer.jsx";
import { useMapIcons } from "./afect_view/useMapIcons.js";
import { AffectAdd } from "./addafect/affectAdd.jsx";
import MapSearchBar from "../../../components/maps/MapSearchBar.jsx";

// ============================================================
// CONSTANTES
// ============================================================
const DEFAULT_POSITION = [-3.9939, -79.2042];
const DEFAULT_ZOOM = 14;

// Configuración de iconos para Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================
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
      minWidth: 180,
    }}
  >
    <FormControlLabel
      control={
        <Switch
          checked={showLayer}
          onChange={(e) => onToggle(e.target.checked)}
          color="primary"
        />
      }
      label={
        <Typography variant="body2" fontWeight="500">
          Polígonos de influencia
        </Typography>
      }
    />
  </Box>
);

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    dblclick: (e) => onMapClick(e.latlng),
    contextmenu: (e) => {
      e.originalEvent?.preventDefault();
      onMapClick(e.latlng);
    },
  });
  return null;
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
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
  // ------------------------------------------------------------
  // REFERENCIAS
  // ------------------------------------------------------------
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // ------------------------------------------------------------
  // ESTADOS
  // ------------------------------------------------------------
  const [user, setUser] = useState(null);
  const [showLayer, setShowLayer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [poligonosData, setPoligonosData] = useState([]);
  const [loadingPoligonos, setLoadingPoligonos] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCoords, setDialogCoords] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_POSITION);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  // Estados para geolocalización
  const [geoError, setGeoError] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // ------------------------------------------------------------
  // HOOKS PERSONALIZADOS
  // ------------------------------------------------------------
  const { getEventIcon, getEventIconPulso, COLOR_PRIORIDAD } = useMapIcons();

  // ------------------------------------------------------------
  // FUNCIONES
  // ------------------------------------------------------------
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

        originalStyles.forEach((style) => {
          style.element.style.visibility = style.visibility;
          style.element.style.opacity = style.opacity;
        });

        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        console.error("Error en captura:", error);
        reject(error);
      }
    });
  };

  // ------------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------------
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

  const handleOpenDialog = useCallback((latlng) => {
    if (!latlng) return;
    setDialogCoords({ lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) });
    setDialogOpen(true);
  }, []);

  const handleLocationSelect = useCallback((location) => {
    const { lat, lng } = location;
    if (lat && lng) {
      setMapCenter([lat, lng]);
      setMapZoom(18);
      setGeoError(null); // Limpiar error si el usuario selecciona manualmente
    }
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setMapCenter([coords.latitude, coords.longitude]);
            setMapZoom(18);
          },
          () => console.error("Error obteniendo ubicación"),
        );
      }
    }, []);

  const handleDateChange = useCallback(
    (_, value) => {
      if (setSelectedDate) {
        setSelectedDate(value);
      }
    },
    [setSelectedDate]
  );

  // ------------------------------------------------------------
  // EFECTOS
  // ------------------------------------------------------------
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

  useEffect(() => {
    if (coords && coords.length >= 2) {
      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter([lat, lng]);
        setMapZoom(DEFAULT_ZOOM);
      }
    }
  }, [coords]);

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

  // ------------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // JSX
  // ------------------------------------------------------------
  return (
    <Box sx={{ position: "relative" }} ref={mapContainerRef}>
      {/* Control de capas */}
      <LayerControl
        showLayer={showLayer}
        onToggle={(checked) => setShowLayer(checked)}
      />

      {/* Alerta de sin datos */}
      {!afectData.length && (
        <Alert
          variant="filled"
          severity="error"
          sx={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: { xs: "90%", sm: "70%", md: "50%" },
          }}
        >
          No se encontraron datos de afectaciones. Intenta con otra fecha o
          criterios de búsqueda.
        </Alert>
      )}

      {/* Barra de búsqueda */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: { xs: "90%", sm: "70%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <MapSearchBar
          onLocationSelect={handleLocationSelect}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLoading={gettingLocation}
        />
        {gettingLocation && (
          <CircularProgress size={24} sx={{ ml: 1, color: "primary.main" }} />
        )}
      </Box>

      {/* Alerta de error de geolocalización */}
      {geoError && (
        <Alert
          severity="warning"
          sx={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: { xs: "90%", sm: "70%", md: "50%" },
          }}
          onClose={() => setGeoError(null)}
        >
          {geoError}
        </Alert>
      )}

      {/* Mapa */}
      <MapContainer
        center={mapCenter}
        ref={mapRef}
        zoom={mapZoom}
        doubleClickZoom={false}
        whenCreated={(map) => {
          mapRef.current = map;
          map.on("load", () => {
            console.log("Mapa completamente cargado");
          });
        }}
        style={{ height: "75vh", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />

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

        {user && <MapEvents onMapClick={handleOpenDialog} />}

        <AffectAdd
          dialogOpen={dialogOpen}
          handleCloseDialog={() => setDialogOpen(false)}
          dialogCoords={dialogCoords}
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
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Cargando polígonos...
          </div>
        )}
      </MapContainer>

      {/* Slider de fechas */}
      {minFecha && maxFecha && (
        <Box sx={{ width: "100%", mt: 2, px: 2 }}>
          <Slider
            value={selectedDate || maxFecha}
            min={minFecha}
            max={maxFecha}
            step={24 * 60 * 60 * 1000}
            onChange={handleDateChange}
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
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0 0 0 8px rgba(255, 165, 0, 0.2)",
                },
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
              mt: -1,
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

// ============================================================
// PROPTYPES Y DEFAULTS
// ============================================================
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
  setSelectedDate: null,
  minFecha: null,
  maxFecha: null,
  radioAfect: 1000,
};

export default React.memo(MapAfects);