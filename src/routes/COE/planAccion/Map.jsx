import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import leafletImage from "leaflet-image";
import L from "leaflet";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Chip,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  MyLocation as MyLocationIcon,
  Layers as LayersIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { MarkerSimple } from "../../../components/maps/marker";
import { coordForm } from "../../utils/Coords";
import AfectMarkers from "../../analisis/afects/afect_view/AfectMarkers";
import { cargardatoformId, generarPDF } from "../../analisis/afects/script";
import { useMapIcons } from "../../analisis/afects/afect_view/useMapIcons";
import SucepLayer from "../../analisis/afects/afect_view/PoligonosLayer";
import ParroquiaLayer from "../../analisis/afects/afect_view/ParroquiaLayer";
import SusceptibilidadLayer from "../canton/body_accion/SusceptibilidadLayer";
import ImageUploadDialog from "../canton/popups/inputs/inputsDialog";
import { ConMonitView } from "./popups/popPoint";
import { AccionesView } from "../canton/popups/acciones";

import { DialogAccion } from "./popups/inputAct";

// ========== FUNCIÓN AUXILIAR PARA EXTRAER DATOS ==========
const extractDataArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.datos && Array.isArray(data.datos)) return data.datos;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (typeof data === "object") {
    return Object.keys(data).length > 0 ? [data] : [];
  }
  return [];
};

// ========== COMPONENTE DE CONTROLES ==========
const MapControls = ({ onZoomIn, onZoomOut, onLocate, onDownload, isExporting }) => (
  <Box
    sx={{
      position: "absolute",
      bottom: 20,
      right: 10,
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: 1,
    }}
  >
    <Tooltip title="Acercar" placement="left">
      <IconButton
        onClick={onZoomIn}
        sx={{ bgcolor: "white", boxShadow: 2, "&:hover": { bgcolor: "#f5f5f5" } }}
        size="small"
      >
        <ZoomInIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Alejar" placement="left">
      <IconButton
        onClick={onZoomOut}
        sx={{ bgcolor: "white", boxShadow: 2, "&:hover": { bgcolor: "#f5f5f5" } }}
        size="small"
      >
        <ZoomOutIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Mi ubicación" placement="left">
      <IconButton
        onClick={onLocate}
        sx={{ bgcolor: "white", boxShadow: 2, "&:hover": { bgcolor: "#f5f5f5" } }}
        size="small"
      >
        <MyLocationIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Exportar mapa" placement="left">
      <IconButton
        onClick={onDownload}
        disabled={isExporting}
        sx={{ bgcolor: "white", boxShadow: 2, "&:hover": { bgcolor: "#f5f5f5" } }}
        size="small"
      >
        {isExporting ? <CircularProgress size={20} /> : <DownloadIcon />}
      </IconButton>
    </Tooltip>
  </Box>
);

// ========== COMPONENTE DE ESTADO DE CAPAS ==========
const LayerStatus = ({ layers, onToggleVisibility }) => {
  const activeLayers = layers.filter((l) => l.active && !l.hidden);
  if (!activeLayers.length) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        position: "absolute",
        bottom: 20,
        left: 10,
        zIndex: 1000,
        bgcolor: "rgba(0,0,0,0.85)",
        color: "white",
        borderRadius: 2,
        px: 1.5,
        py: 1,
        minWidth: 180,
        maxWidth: 280,
        maxHeight: 200,
        overflowY: "auto",
      }}
    >
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>
        Capas activas ({activeLayers.length}/{layers.length})
      </Typography>
      {activeLayers.map((layer) => (
        <Box
          key={layer.key}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 0.25,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: layer.color,
                flexShrink: 0,
              }}
            />
            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
              {layer.label} ({layer.count})
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => onToggleVisibility(layer.key)}
            sx={{ color: 'white', p: 0.25 }}
          >
            {layer.hidden ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </IconButton>
        </Box>
      ))}
    </Paper>
  );
};

// ========== COMPONENTE DE CLICK EN MAPA ==========
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

// ========== COMPONENTE PARA CENTRAR MAPA ==========
const MapCenter = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

// ========== HOOKS ==========
const useUser = () => {
  const [user, setUser] = useState(null);
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
  layersConfig,
  selectCapa,
  loading,
  onRefreshLayer,
  children,
  member
}) {
  const user = useUser();
  const { getEventIcon, getEventIconPulso, COLOR_PRIORIDAD } = useMapIcons();

  // ========== ESTADOS ==========
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAccion, setOpenAccion] = useState(false);
  const [dialogCoords, setDialogCoords] = useState(null);
  const [typeInput, setTypeInput] = useState("");
  const [files, setFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isExporting, setIsExporting] = useState(false);
  const [mapCenter, setMapCenter] = useState(position);
  const [mapZoom, setMapZoom] = useState(zoom);
  const mapRef = useRef(null);

  // Estado para ocultar capas individualmente
  const [hiddenLayers, setHiddenLayers] = useState({
    conoc_monit: false,
    prev_mitig: false,
    preparacion: false,
    respuesta: false,
    recuperacion: false,
    poligono: false,
    parroquia: false,
    afect_register: false,
    susceptibilidad: false,
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingPoligonos, setLoadingPoligonos] = useState(false);

  // ========== PROCESAMIENTO DE DATOS ==========
  const dataConArray = useMemo(() => extractDataArray(dataCon), [dataCon]);
  const dataPrevArray = useMemo(() => extractDataArray(dataPrev), [dataPrev]);
  const dataPrepArray = useMemo(() => extractDataArray(dataPrep), [dataPrep]);
  const dataResArray = useMemo(() => extractDataArray(dataRes), [dataRes]);
  const dataReqArray = useMemo(() => extractDataArray(dataReq), [dataReq]);
  const dataPolArray = useMemo(() => extractDataArray(dataPol), [dataPol]);
  const dataParroquiaArray = useMemo(() => extractDataArray(dataParroquia), [dataParroquia]);
  const dataAfectRegisterArray = useMemo(() => extractDataArray(dataAfectRegister), [dataAfectRegister]);
  const dataSusceptibilidadArray = useMemo(() => extractDataArray(dataSusceptibilidad), [dataSusceptibilidad]);

  // ========== PROCESAR MARCADORES ==========
  const processMarkers = useCallback((rawData) => {
    const dataArray = extractDataArray(rawData);
    if (!dataArray || !Array.isArray(dataArray)) return [];

    return dataArray
      .map((item, index) => {
        if (!item.ubi) return null;
        try {
          const coords = coordForm(item.ubi);
          return coords ? { id: item._id || index, position: coords, data: item } : null;
        } catch (e) {
          console.warn(`Error procesando marcador ${index}:`, e);
          return null;
        }
      })
      .filter(Boolean);
  }, []);

  const marcadoresCon = useMemo(() => processMarkers(dataCon), [dataCon, processMarkers]);
  const marcadoresPrev = useMemo(() => processMarkers(dataPrev), [dataPrev, processMarkers]);
  const marcadoresPrep = useMemo(() => processMarkers(dataPrep), [dataPrep, processMarkers]);
  const marcadoresRes = useMemo(() => processMarkers(dataRes), [dataRes, processMarkers]);
  const marcadoresReq = useMemo(() => processMarkers(dataReq), [dataReq, processMarkers]);

  // ========== ESTADO DE CAPAS ACTIVAS ==========
  const activeLayersStatus = useMemo(() => {
    return [
      {
        key: "conoc_monit",
        label: "Conocimiento y Monitoreo",
        active: selectCapa.conoc_monit && !hiddenLayers.conoc_monit,
        hidden: hiddenLayers.conoc_monit,
        count: marcadoresCon.length,
        color: "#e6101b",
        isLoading: loading.loadingAF,
      },
      {
        key: "prev_mitig",
        label: "Prevención y Mitigación",
        active: selectCapa.prev_mitig && !hiddenLayers.prev_mitig,
        hidden: hiddenLayers.prev_mitig,
        count: marcadoresPrev.length,
        color: "#ff8c00",
        isLoading: loading.loadingAC,
      },
      {
        key: "preparacion",
        label: "Preparación",
        active: selectCapa.preparacion && !hiddenLayers.preparacion,
        hidden: hiddenLayers.preparacion,
        count: marcadoresPrep.length,
        color: "#228b22",
        isLoading: loading.loadingRE,
      },
      {
        key: "respuesta",
        label: "Respuesta",
        active: selectCapa.respuesta && !hiddenLayers.respuesta,
        hidden: hiddenLayers.respuesta,
        count: marcadoresRes.length,
        color: "#ff6b00",
        isLoading: false,
      },
      {
        key: "recuperacion",
        label: "Recuperación",
        active: selectCapa.recuperacion && !hiddenLayers.recuperacion,
        hidden: hiddenLayers.recuperacion,
        count: marcadoresReq.length,
        color: "#0066cc",
        isLoading: false,
      },
      {
        key: "poligono",
        label: "Polígonos",
        active: selectCapa.poligono && !hiddenLayers.poligono,
        hidden: hiddenLayers.poligono,
        count: dataPolArray.length,
        color: "#3519d2",
        isLoading: loading.loadingPol,
      },
      {
        key: "parroquia",
        label: "Parroquias",
        active: selectCapa.parroquia && !hiddenLayers.parroquia,
        hidden: hiddenLayers.parroquia,
        count: dataParroquiaArray.length,
        color: "#4caf50",
        isLoading: false,
      },
      {
        key: "afect_register",
        label: "Afect. Registradas",
        active: selectCapa.afect_register && !hiddenLayers.afect_register,
        hidden: hiddenLayers.afect_register,
        count: dataAfectRegisterArray.length,
        color: "#ff8c00",
        isLoading: false,
      },
      {
        key: "susceptibilidad",
        label: "Susceptibilidad",
        active: selectCapa.susceptibilidad && !hiddenLayers.susceptibilidad,
        hidden: hiddenLayers.susceptibilidad,
        count: dataSusceptibilidadArray.length,
        color: "#228b22",
        isLoading: false,
      },
    ];
  }, [
    selectCapa,
    hiddenLayers,
    marcadoresCon,
    marcadoresPrev,
    marcadoresPrep,
    marcadoresRes,
    marcadoresReq,
    dataPolArray,
    dataParroquiaArray,
    dataAfectRegisterArray,
    dataSusceptibilidadArray,
    loading,
  ]);

  // ========== FUNCIONES AUXILIARES ==========
  const parseByField = useCallback((byString) => {
    if (typeof byString !== "string") return byString;
    try {
      const fixedString = byString
        .replace(/(\w+):/g, '"$1":')
        .replace(/:\s*(\w+)(,|})/g, ': "$1"$2')
        .replace(/'/g, '"');
      return JSON.parse(fixedString);
    } catch {
      return { error: "Info no disponible" };
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "No disponible";
    try {
      const [datePart] = dateString.split(" ");
      const [d, m, y] = datePart.split("/");
      return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  }, []);

  // ========== HANDLERS ==========
  const handleOpenDialog = useCallback((latlng) => {
    if (!latlng) return;
    setDialogCoords({ lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) });
    setOpenAccion(true);
  }, []);

  const handleMapClick = useCallback((latlng) => {
    const mapContainer = document.querySelector(".leaflet-container");
    const rect = mapContainer.getBoundingClientRect();

    setCoordinates({
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6),
      latlng: latlng,
    });

    setMenuAnchor({
      left: rect.left + window.scrollX + 20,
      top: rect.top + window.scrollY + 20,
    });
  }, []);

  const handleToggleVisibility = useCallback((layerKey) => {
    setHiddenLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  }, []);

  const handleLayerClick = useCallback(
    (item) => {
      if (!coordinates) return;
      item.accion(coordinates.latlng);
      setMenuAnchor(null);
    },
    [coordinates],
  );

  const handleZoom = useCallback((delta) => {
    if (mapRef.current) {
      const map = mapRef.current;
      const newZoom = map.getZoom() + delta;
      map.setZoom(newZoom);
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
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setMapZoom(15);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }
        setSnackbar({
          open: true,
          message: "Ubicación encontrada",
          severity: "success",
        });
      },
      () => {
        setSnackbar({
          open: true,
          message: "No se pudo obtener tu ubicación",
          severity: "error",
        });
      },
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
    const map = mapRef.current;

    leafletImage(map, (err, canvas) => {
      setIsExporting(false);
      if (err) {
        console.error("Error exportando mapa:", err);
        setSnackbar({
          open: true,
          message: "Error al exportar el mapa",
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
        message: "Mapa exportado exitosamente",
        severity: "success",
      });
    });
  }, []);

  const handleCopyCoordinates = useCallback(() => {
    if (coordinates) {
      navigator.clipboard.writeText(`${coordinates.lat}, ${coordinates.lng}`);
      setSnackbar({
        open: true,
        message: "Coordenadas copiadas",
        severity: "success",
      });
      setMenuAnchor(null);
    }
  }, [coordinates]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

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
    [],
  );

  const handleRefreshAll = useCallback(() => {
    const allLayerKeys = [
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
    allLayerKeys.forEach((key) => onRefreshLayer?.(key));
    setSnackbar({
      open: true,
      message: "Recargando todas las capas...",
      severity: "info",
    });
  }, [onRefreshLayer]);

  // ========== RENDER ==========
  return (
    <>
      <Box sx={{ position: "relative", height: "90vh", width: "100%" }}>
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={mapZoom}
          doubleClickZoom={false}
          style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        >
          {/* Capa base */}
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          />

          <MapCenter center={mapCenter} zoom={mapZoom} />

          {/* MapEvents - combinado */}
          {user && <MapEvents onMapClick={handleOpenDialog} />}
          <MapEvents onMapClick={handleMapClick} />

          {/* Marcador temporal */}
          {coordinates && (
            <MarkerSimple
              iconMark={
                <LocationOnIcon sx={{ color: "#e6101b", fontSize: 40 }} />
              }
              position={[coordinates.latlng.lat, coordinates.latlng.lng]}
            />
          )}

          {/* ========== CAPAS DE ANÁLISIS ========== */}

          {/* Capa: Conocimiento y Monitoreo */}
          {selectCapa.conoc_monit && !hiddenLayers.conoc_monit && marcadoresCon.length > 0 && (
            <ConMonitView
              afect={marcadoresCon}
              parseByField={parseByField}
              formatDate={formatDate}
              title="Conocimiento y Monitoreo"
              mtt={mtt}
              polAfect={dataPolArray}
              setOpenDialog={setOpenDialog}
              openDialog={openDialog}
              setTypeInput={setTypeInput}
              files={files}
            />
          )}

          {/* Capa: Prevención y Mitigación - Usando AccionesView */}
          {selectCapa.prev_mitig && !hiddenLayers.prev_mitig && marcadoresPrev.length > 0 && (
            <ConMonitView
              acciones={marcadoresPrev}
              formatDate={formatDate}
              title="Prevención y Mitigación"
              mtt={mtt}
              polAfect={dataPolArray}
              setOpenDialog={setOpenDialog}
              openDialog={openDialog}
              setTypeInput={setTypeInput}
            />
          )}

          {/* Capa: Preparación - Usando RequireView */}
          {
            selectCapa.preparacion &&
            !hiddenLayers.preparacion &&
            marcadoresPrep.length > 0 && (
              <ConMonitView
                recursos={marcadoresPrep}
                parseByField={parseByField}
                formatDate={formatDate}
                title="Preparación"
                mtt={mtt}
                setOpenDialog={setOpenDialog}
                openDialog={openDialog}
              />
            )}

          {/* Capa: Respuesta - Usando RequireView */}
          {selectCapa.respuesta &&
            !hiddenLayers.respuesta &&
            marcadoresRes.length > 0 && (
              <ConMonitView
                recursos={marcadoresRes}
                parseByField={parseByField}
                formatDate={formatDate}
                title="Respuesta"
                mtt={mtt}
                setOpenDialog={setOpenDialog}
                openDialog={openDialog}
              />
            )}

          {/* Capa: Recuperación - Usando RequireView */}
          {selectCapa.recuperacion &&
            !hiddenLayers.recuperacion &&
            marcadoresReq.length > 0 && (
              <ConMonitView
                recursos={marcadoresReq}
                parseByField={parseByField}
                formatDate={formatDate}
                title="Recuperación"
                mtt={mtt}
                setOpenDialog={setOpenDialog}
                openDialog={openDialog}
              />
            )}

          {/* ========== CAPAS GEOGRÁFICAS ========== */}

          {/* Capa: Afectaciones Registradas */}
          {selectCapa.afect_register &&
            !hiddenLayers.afect_register &&
            dataAfectRegisterArray.length > 0 && (
              <AfectMarkers
                afectData={dataAfectRegisterArray}
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
                onGeneratePDF={handleGeneratePDF}
                getEventIcon={getEventIcon}
                getEventIconPulso={getEventIconPulso}
                COLOR_PRIORIDAD={COLOR_PRIORIDAD}
                user={user}
              />
            )}

          {/* Capa: Susceptibilidad */}
          <SucepLayer
            poligonosData={dataSusceptibilidadArray}
            showLayer={
              selectCapa.susceptibilidad && !hiddenLayers.susceptibilidad
            }
            loading={loadingPoligonos}
          />

          {/* Capa: Parroquias */}
          {selectCapa.parroquia &&
            !hiddenLayers.parroquia &&
            dataParroquiaArray.length > 0 && (
              <ParroquiaLayer parroquia={dataParroquiaArray} />
            )}

          {children}
        </MapContainer>

        {/* Controles del mapa */}
        <MapControls
          onZoomIn={() => handleZoom(1)}
          onZoomOut={() => handleZoom(-1)}
          onLocate={handleLocate}
          onDownload={handleExportMap}
          isExporting={isExporting}
        />

        {/* Estado de capas activas */}
        <LayerStatus
          layers={activeLayersStatus}
          onToggleVisibility={handleToggleVisibility}
        />

        {/* Indicador de carga */}
        {isExporting && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2000,
              bgcolor: "rgba(0,0,0,0.7)",
              borderRadius: 2,
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={24} />
            <Typography color="white">Exportando mapa...</Typography>
          </Box>
        )}

        {/* Panel de recarga rápida */}
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            bgcolor: "white",
            borderRadius: 2,
            p: 1,
            display: "flex",
            gap: 0.5,
          }}
        >
          <Tooltip title="Recargar todas las capas">
            <IconButton
              size="small"
              onClick={handleRefreshAll}
              sx={{ bgcolor: "#f0f0f0" }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>
      </Box>

      <DialogAccion
        open={openAccion}
        onClose={() => setOpenAccion(false)}
        dialogCoords={dialogCoords}
        mtt={mtt}
        member={member}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MapMark;