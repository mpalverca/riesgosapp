// MapMark.jsx - Versión Optimizada
import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import leafletImage from "leaflet-image";
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  MyLocation as MyLocationIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { MarkerSimple } from "../../../components/maps/marker";
import { coordForm } from "../../utils/Coords";
import AfectMarkers from "../../analisis/afects/afect_view/AfectMarkers";
import { cargardatoformId, generarPDF } from "../../analisis/afects/script";
import { useMapIcons } from "../../analisis/afects/afect_view/useMapIcons";
import SucepLayer from "../../analisis/afects/afect_view/PoligonosLayer";
import ParroquiaLayer from "../../analisis/afects/afect_view/ParroquiaLayer";
import { ConMonitView } from "./popups/popPoint";
import { DialogAccion } from "./popups/inputAct";
import MapSearchBar from "../../../components/maps/MapSearchBar";

// ========== UTILIDADES ==========
const extractDataArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data?.datos) return data.datos;
  if (data?.data) return data.data;
  return Object.keys(data || {}).length > 0 ? [data] : [];
};

const formatDate = (dateString) => {
  if (!dateString) return "No disponible";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const parseByField = (byString) => {
  if (typeof byString !== "string") return byString;
  try {
    const fixed = byString
      .replace(/(\w+):/g, '"$1":')
      .replace(/:\s*(\w+)(,|})/g, ': "$1"$2')
      .replace(/'/g, '"');
    return JSON.parse(fixed);
  } catch {
    return { error: "Info no disponible" };
  }
};

// ========== COMPONENTES INTERNOS ==========

// Controles del mapa (simplificado)
const MapControls = ({
  onZoomIn,
  onZoomOut,
  onLocate,
  onDownload,
  isExporting,
}) => (
  <Paper
    elevation={3}
    sx={{
      position: "absolute",
      bottom: 20,
      right: 10,
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
      p: 0.5,
      borderRadius: 3,
      bgcolor: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    }}
  >
    {[
      { icon: <ZoomInIcon />, title: "Acercar", action: onZoomIn },
      { icon: <ZoomOutIcon />, title: "Alejar", action: onZoomOut },
      { icon: <MyLocationIcon />, title: "Mi ubicación", action: onLocate },
      {
        icon: isExporting ? <CircularProgress size={18} /> : <DownloadIcon />,
        title: "Exportar mapa",
        action: onDownload,
        disabled: isExporting,
      },
    ].map((btn, idx) => (
      <Tooltip key={idx} title={btn.title} placement="left" arrow>
        <IconButton
          onClick={btn.action}
          disabled={btn.disabled}
          size="small"
          sx={{
            "&:hover": {
              bgcolor: btn.title === "Mi ubicación" ? "#e7f3ff" : "#f0f2f5",
            },
            color: btn.title === "Mi ubicación" ? "#1877f2" : "inherit",
          }}
        >
          {btn.icon}
        </IconButton>
      </Tooltip>
    ))}
  </Paper>
);

// Eventos del mapa
const MapEvents = ({ onDoubleClick, onContextMenu }) => {
  useMapEvents({
    dblclick: (e) => onDoubleClick?.(e.latlng),
    contextmenu: (e) => {
      e.originalEvent?.preventDefault();
      onContextMenu?.(e.latlng);
    },
  });
  return null;
};

// Centrar mapa
const MapCenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// ========== HOOK PERSONALIZADO ==========
const useUser = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const data = localStorage.getItem("user");
      if (data) setUser(JSON.parse(data));
    } catch {
      console.error("Error al cargar usuario");
    }
  }, []);
  return user;
};

// ========== COMPONENTE PRINCIPAL ==========
function MapMark({
  position,
  zoom,
  dataCon,
  dataPrev,
  dataPrep,
  dataRes,
  dataReq,
  dataPol,
  dataParroquia,
  dataAfectRegister,
  dataSusceptibilidad,
  mtt,
  selectCapa,
  loading,
  onRefreshLayer,
  children,
  member,
  ...props
}) {
  const user = useUser();
  const { getEventIcon, getEventIconPulso, COLOR_PRIORIDAD } = useMapIcons();

  // ========== ESTADOS ==========
  const [coordinates, setCoordinates] = useState(null);
  const [openAccion, setOpenAccion] = useState(false);
  const [dialogCoords, setDialogCoords] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [mapCenter, setMapCenter] = useState(position);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const mapRef = useRef(null);

  // ========== DATOS MEMORIZADOS ==========
  const dataArrays = useMemo(
    () => ({
      con: extractDataArray(dataCon),
      prev: extractDataArray(dataPrev),
      prep: extractDataArray(dataPrep),
      res: extractDataArray(dataRes),
      req: extractDataArray(dataReq),
      pol: extractDataArray(dataPol),
      parroquia: extractDataArray(dataParroquia),
      afect: extractDataArray(dataAfectRegister),
      susceptibilidad: extractDataArray(dataSusceptibilidad),
    }),
    [
      dataCon,
      dataPrev,
      dataPrep,
      dataRes,
      dataReq,
      dataPol,
      dataParroquia,
      dataAfectRegister,
      dataSusceptibilidad,
    ],
  );

  // ========== PROCESAR MARCADORES ==========
  const processMarkers = useCallback((rawData) => {
    const dataArray = extractDataArray(rawData);
    if (!dataArray?.length) return [];

    return dataArray
      .map((item, index) => {
        if (!item?.ubi) return null;
        try {
          const coords = coordForm(item.ubi);
          return coords
            ? { id: item._id || index, position: coords, data: item }
            : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }, []);

  const markers = useMemo(
    () => ({
      con: processMarkers(dataCon),
      prev: processMarkers(dataPrev),
      prep: processMarkers(dataPrep),
      res: processMarkers(dataRes),
      req: processMarkers(dataReq),
    }),
    [dataCon, dataPrev, dataPrep, dataRes, dataReq, processMarkers],
  );

  // ========== HANDLERS ==========
  const handleMapClick = useCallback((latlng) => {
    setCoordinates({
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6),
      latlng,
    });
    // Abrir diálogo de acción al hacer doble click
    setDialogCoords({ lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) });
    setOpenAccion(true);
  }, []);

  const handleZoom = useCallback((delta) => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom() + delta;
      mapRef.current.setZoom(newZoom);
      setMapZoom(newZoom);
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setSnackbar({
        open: true,
        message: "Geolocalización no soportada",
        severity: "error",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setMapCenter([latitude, longitude]);
        setMapZoom(18);
        mapRef.current?.setView([latitude, longitude], 15);
        setSnackbar({
          open: true,
          message: "Ubicación encontrada",
          severity: "success",
        });
      },
      () =>
        setSnackbar({
          open: true,
          message: "No se pudo obtener tu ubicación",
          severity: "error",
        }),
    );
  }, []);

  const handleExportMap = useCallback(() => {
    if (!mapRef.current) {
      setSnackbar({
        open: true,
        message: "El mapa no está listo",
        severity: "error",
      });
      return;
    }
    setIsExporting(true);
    leafletImage(mapRef.current, (err, canvas) => {
      setIsExporting(false);
      if (err) {
        setSnackbar({
          open: true,
          message: "Error al exportar",
          severity: "error",
        });
        return;
      }
      const link = document.createElement("a");
      link.download = `mapa_${new Date().toISOString().slice(0, 19)}.png`;
      link.href = canvas.toDataURL();
      link.click();
      setSnackbar({
        open: true,
        message: "Mapa exportado",
        severity: "success",
      });
    });
  }, []);

  const handleRefreshAll = useCallback(() => {
    const keys = [
      "conoc_monit",
      "prev_mitig",
      "preparacion",
      "respuesta",
      "recuperacion",
      "poligono",
      "parroquia",
      "afect_register",
      "susceptibilidad",
    ];
    keys.forEach(onRefreshLayer);
    setSnackbar({
      open: true,
      message: "Recargando capas...",
      severity: "info",
    });
  }, [onRefreshLayer]);

  const handleLocationSelect = useCallback((location) => {
    const { lat, lng } = location;
    if (lat && lng) {
      setMapCenter([lat, lng]);
      setMapZoom(18);
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

  // ========== RENDER CAPAS ==========
  const renderLayer = (key, markersData, Component, props) => {
    if (!selectCapa[key] || !markersData?.length) return null;
    return <Component {...props} acciones={markersData} />;
  };

  // ========== RENDER ==========
  return (
    <Box
      sx={{
        position: "relative",
        height: "90vh",
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Barra de búsqueda */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: { xs: "90%", sm: "70%", md: "50%" },
        }}
      >
        <MapSearchBar
          onLocationSelect={handleLocationSelect}
          onUseCurrentLocation={handleUseCurrentLocation}
        />
      </Box>

      {/* Panel rápido */}
      <Paper
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          p: 0.5,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Tooltip title="Recargar capas" arrow>
          <IconButton size="small" onClick={handleRefreshAll}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Mapa */}
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={mapZoom}
        doubleClickZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />
        <MapCenter center={mapCenter} zoom={mapZoom} />
        <MapEvents onDoubleClick={handleMapClick} />

        {/* Marcador temporal */}
        {coordinates?.latlng && (
          <MarkerSimple
            iconMark={
              <LocationOnIcon sx={{ color: "#1877f2", fontSize: 40 }} />
            }
            position={[coordinates.latlng.lat, coordinates.latlng.lng]}
          />
        )}

        {/* Capas de análisis */}
        {selectCapa.conoc_monit && markers.con.length > 0 && (
          <ConMonitView
            acciones={markers.con}
            title="Conocimiento y Monitoreo"
            sheet="Conoc_Monit"
            mtt={mtt}
            polAfect={dataArrays.pol}
            member={member}
            formatDate={formatDate}
          />
        )}
        {selectCapa.prev_mitig && markers.prev.length > 0 && (
          <ConMonitView
            acciones={markers.prev}
            title="Prevención y Mitigación"
            sheet="prev_mit"
            mtt={mtt}
            polAfect={dataArrays.pol}
            member={member}
            formatDate={formatDate}
          />
        )}
        {selectCapa.preparacion && markers.prep.length > 0 && (
          <ConMonitView
            acciones={markers.prep}
            title="Preparación"
            sheet="prep"
            mtt={mtt}
            member={member}
            formatDate={formatDate}
          />
        )}
        {selectCapa.respuesta && markers.res.length > 0 && (
          <ConMonitView
            acciones={markers.res}
            title="Respuesta"
            sheet="resp"
            mtt={mtt}
            member={member}
            formatDate={formatDate}
          />
        )}
        {selectCapa.recuperacion && markers.req.length > 0 && (
          <ConMonitView
            acciones={markers.req}
            title="Recuperación"
            sheet="recup"
            mtt={mtt}
            member={member}
            formatDate={formatDate}
          />
        )}

        {/* Capas geográficas */}
        {selectCapa.afect_register && dataArrays.afect.length > 0 && (
          <AfectMarkers
            afectData={dataArrays.afect}
            selectedItem={selectedItem}
            onItemClick={setSelectedItem}
            onGeneratePDF={generarPDF}
            getEventIcon={getEventIcon}
            getEventIconPulso={getEventIconPulso}
            COLOR_PRIORIDAD={COLOR_PRIORIDAD}
            user={user}
            member={member}
          />
        )}
        {selectCapa.susceptibilidad &&
          dataArrays.susceptibilidad.length > 0 && (
            <SucepLayer
              poligonosData={dataArrays.susceptibilidad}
              showLayer={true}
            />
          )}
        {selectCapa.parroquia && dataArrays.parroquia.length > 0 && (
          <ParroquiaLayer parroquia={dataArrays.parroquia} />
        )}

        {children}
      </MapContainer>

      {/* Controles */}
      <MapControls
        onZoomIn={() => handleZoom(1)}
        onZoomOut={() => handleZoom(-1)}
        onLocate={handleLocate}
        onDownload={handleExportMap}
        isExporting={isExporting}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Diálogo de acción */}
      <DialogAccion
        open={openAccion}
        onClose={() => setOpenAccion(false)}
        dialogCoords={dialogCoords}
        mtt={mtt}
        member={member}
        setCache={props.setCache}
        setSnackbar={setSnackbar}
        snackbar={snackbar}
      />
    </Box>
  );
}

export default MapMark;
