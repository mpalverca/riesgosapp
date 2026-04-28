import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
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
import { AfectacionesView } from "./popups/afectaciones";
import { AccionesView } from "./popups/acciones";
import { RequireView } from "./popups/recursos";
import { PolEventView } from "./popups/afectMMT/pol_event";
import ImageUploadDialog from "./popups/inputs/inputsDialog";
import { coordForm } from "../../utils/Coords";
import AfectMarkers from "../../analisis/afects/afect_view/AfectMarkers";
import { cargardatoformId, generarPDF } from "../../analisis/afects/script";
import { useMapIcons } from "../../analisis/afects/afect_view/useMapIcons";
import SucepLayer from "../../analisis/afects/afect_view/PoligonosLayer";
import ParroquiaLayer from "../../analisis/afects/afect_view/ParroquiaLayer";
import SusceptibilidadLayer from "./body_accion/SusceptibilidadLayer";

// Componente de controles personalizados
const MapControls = ({ onZoomIn, onZoomOut, onLocate, onDownload }) => {
  return (
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
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
          size="small"
        >
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Alejar" placement="left">
        <IconButton
          onClick={onZoomOut}
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
          size="small"
        >
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Mi ubicación" placement="left">
        <IconButton
          onClick={onLocate}
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
          size="small"
        >
          <MyLocationIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Exportar mapa" placement="left">
        <IconButton
          onClick={onDownload}
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
          size="small"
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// Componente para el estado de carga de capas (actualizado)
const LayerStatus = ({ layers, onRefreshLayer, onToggleVisibility }) => {
  const activeLayers = layers.filter(l => l.active && !l.hidden).length;
  const totalLayers = layers.length;
  
  if (totalLayers === 0) return null;
  
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
        py: 0.75,
        minWidth: 200,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LayersIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">
            {activeLayers} / {totalLayers} capas visibles
          </Typography>
        </Box>
      </Box>
      
      {/* Lista de capas activas para control rápido */}
      <Box sx={{ mt: 1, maxHeight: 150, overflowY: "auto" }}>
        {layers.map((layer) => (
          <Box 
            key={layer.key} 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              mb: 0.5,
              p: 0.25,
              borderRadius: 1,
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: layer.hidden ? "#666" : layer.color || "#999",
                  opacity: layer.hidden ? 0.5 : 1,
                }}
              />
              <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>
                {layer.label}
              </Typography>
              {layer.count > 0 && (
                <Chip
                  label={layer.count}
                  size="small"
                  sx={{ height: 16, fontSize: "0.6rem", minWidth: 24 }}
                />
              )}
            </Box>
            
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <Tooltip title="Recargar capa">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefreshLayer?.(layer.key);
                  }}
                  disabled={layer.isLoading}
                  sx={{ color: "white", p: 0.25 }}
                >
                  <RefreshIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={layer.hidden ? "Mostrar capa" : "Ocultar capa"}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility?.(layer.key);
                  }}
                  sx={{ color: "white", p: 0.25 }}
                >
                  {layer.hidden ? (
                    <VisibilityIcon sx={{ fontSize: 12 }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: 12 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// Componente interno para capturar clicks
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick(e.latlng),
  });
  return null;
};

// Componente para centrar el mapa
const MapCenter = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

function MapMark({
  position,
  zoom,
  dataAF,
  dataAC,
  dataRE,
  dataPol,
  dataParroquia,
  dataAfectRegister,
  dataSusceptibilidad,
  mtt,
  layersConfig,
  selectCapa,
  loading,
  onRefreshLayer, // Nueva prop para recargar capas desde el padre
  children,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [typeInput, setTypeInput] = useState("");
  const [files, setFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isExporting, setIsExporting] = useState(false);
  const [mapCenter, setMapCenter] = useState(position);
  const [mapZoom, setMapZoom] = useState(zoom);
  const mapRef = useRef(null);
  // Estado para ocultar capas individualmente
  const [hiddenLayers, setHiddenLayers] = useState({
    afectaciones: false,
    acciones: false,
    requerimientos: false,
    poligono: false,
    parroquia: false,
    afect_register: false,
    susceptibilidad: false,
  });

  // para las afect register:
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [poligonosData, setPoligonosData] = useState([]);
  const [loadingPoligonos, setLoadingPoligonos] = useState(false);

  const { getEventIcon, getEventIconPulso, COLOR_PRIORIDAD } = useMapIcons();
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
  // Función para ocultar/mostrar una capa
  const handleToggleVisibility = useCallback((layerKey) => {
    setHiddenLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  }, []);

  // Función para recargar una capa específica
  const handleRefreshLayerClick = useCallback((layerKey) => {
    if (onRefreshLayer) {
      onRefreshLayer(layerKey);
      setSnackbar({ 
        open: true, 
        message: `Recargando capa...`, 
        severity: "info" 
      });
    }
  }, [onRefreshLayer]);

  // Función centralizada para procesar cualquier tipo de marcador
  const processMarkers = useCallback((rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData
      .map((item, index) => {
        if (!item.ubi) return null;
        try {
          const coords = coordForm(item.ubi);
          return coords
            ? { id: item._id || index, position: coords, data: item }
            : null;
        } catch (e) {
          console.warn(`Error procesando marcador ${index}:`, e);
          return null;
        }
      })
      .filter(Boolean);
  }, []);

  // Memorizar marcadores para evitar cálculos innecesarios
  const afectaciones = useMemo(() => processMarkers(dataAF), [dataAF, processMarkers]);
  const acciones = useMemo(() => processMarkers(dataAC), [dataAC, processMarkers]);
  const requiere = useMemo(() => processMarkers(dataRE), [dataRE, processMarkers]);

  // Verificar si hay datos en las capas activas (considerando ocultas)
  const activeLayersStatus = useMemo(() => {
    return [
      { 
        key: "afectaciones", 
        label: "Afectaciones",
        active: selectCapa.afectaciones && !hiddenLayers.afectaciones, 
        hidden: hiddenLayers.afectaciones,
        count: afectaciones.length,
        color: "#e6101b",
        isLoading: loading.loadingAF,
      },
      { 
        key: "acciones", 
        label: "Acciones",
        active: selectCapa.acciones && !hiddenLayers.acciones, 
        hidden: hiddenLayers.acciones,
        count: acciones.length,
        color: "#ff8c00",
        isLoading: loading.loadingAC,
      },
      { 
        key: "requerimientos", 
        label: "Requerimientos",
        active: selectCapa.requerimientos && !hiddenLayers.requerimientos, 
        hidden: hiddenLayers.requerimientos,
        count: requiere.length,
        color: "#228b22",
        isLoading: loading.loadingRE,
      },
      { 
        key: "poligono", 
        label: "Polígonos",
        active: selectCapa.poligono && !hiddenLayers.poligono, 
        hidden: hiddenLayers.poligono,
        count: dataPol?.length || 0,
        color: "#3519d2",
        isLoading: loading.loadingPol,
      },
      { 
        key: "parroquia", 
        label: "Parroquias",
        active: selectCapa.parroquia && !hiddenLayers.parroquia, 
        hidden: hiddenLayers.parroquia,
        count: dataParroquia?.length || 0,
        color: "#4caf50",
        isLoading: false,
      },
      { 
        key: "afect_register", 
        label: "Afect. Registradas",
        active: selectCapa.afect_register && !hiddenLayers.afect_register, 
        hidden: hiddenLayers.afect_register,
        count: dataAfectRegister?.length || 0,
        color: "#ff8c00",
        isLoading: false,
      },
      { 
        key: "susceptibilidad", 
        label: "Susceptibilidad",
        active: selectCapa.susceptibilidad && !hiddenLayers.susceptibilidad, 
        hidden: hiddenLayers.susceptibilidad,
        count: dataSusceptibilidad?.length || 0,
        color: "#228b22",
        isLoading: false,
      },
    ];
  }, [selectCapa, hiddenLayers, afectaciones, acciones, requiere, dataPol, dataParroquia, dataAfectRegister, dataSusceptibilidad, loading]);

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

  // --- HANDLERS ---
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

  const handleLayerClick = useCallback((item) => {
    if (!coordinates) return;
    item.accion(coordinates.latlng);
    setMenuAnchor(null);
  }, [coordinates]);

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setZoom(map.getZoom() + 1);
      setMapZoom(map.getZoom() + 1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setZoom(map.getZoom() - 1);
      setMapZoom(map.getZoom() - 1);
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setSnackbar({ open: true, message: "Geolocalización no soportada", severity: "error" });
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
        setSnackbar({ open: true, message: "Ubicación encontrada", severity: "success" });
      },
      () => {
        setSnackbar({ open: true, message: "No se pudo obtener tu ubicación", severity: "error" });
      }
    );
  }, []);

  const handleExportMap = useCallback(() => {
    if (!mapRef.current) {
      setSnackbar({ open: true, message: "El mapa no está listo", severity: "error" });
      return;
    }

    setIsExporting(true);
    const map = mapRef.current;
    
    leafletImage(map, (err, canvas) => {
      setIsExporting(false);
      if (err) {
        console.error("Error exportando mapa:", err);
        setSnackbar({ open: true, message: "Error al exportar el mapa", severity: "error" });
        return;
      }

      const link = document.createElement("a");
      link.download = `mapa_${new Date().toISOString().slice(0, 19)}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      setSnackbar({ open: true, message: "Mapa exportado exitosamente", severity: "success" });
    });
  }, []);

  const handleCopyCoordinates = useCallback(() => {
    if (coordinates) {
      navigator.clipboard.writeText(`${coordinates.lat}, ${coordinates.lng}`);
      setSnackbar({ open: true, message: "Coordenadas copiadas", severity: "success" });
      setMenuAnchor(null);
    }
  }, [coordinates]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
    []
  );

  return (
    <>
      <Box sx={{ position: "relative", height: "90vh", width: "100%" }}>
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        >
          {/* Capa base de Google Maps */}
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          />

          <MapClickHandler onMapClick={handleMapClick} />
          <MapCenter center={mapCenter} zoom={mapZoom} />

          {/* Marcador temporal de selección */}
          {coordinates && (
            <MarkerSimple
              iconMark={<LocationOnIcon sx={{ color: "#e6101b", fontSize: 40 }} />}
              position={[coordinates.latlng.lat, coordinates.latlng.lng]}
            />
          )}

          {/* Capas de Datos con control de visibilidad y recarga */}
          {!loading.loadingAF && selectCapa.afectaciones && !hiddenLayers.afectaciones && afectaciones.length > 0 && (
            <AfectacionesView
              afect={afectaciones}
              parseByField={parseByField}
              formatDate={formatDate}
              mtt={mtt}
              polAfect={dataPol}
              setOpenDialog={setOpenDialog}
              openDialog={openDialog}
              setTypeInput={setTypeInput}
              files={files}
            />
          )}

          {!loading.loadingAC && selectCapa.acciones && !hiddenLayers.acciones && acciones.length > 0 && (
            <AccionesView
              acciones={acciones}
              formatDate={formatDate}
              mtt={mtt}
              polAfect={dataPol}
              setOpenDialog={setOpenDialog}
              openDialog={openDialog}
              setTypeInput={setTypeInput}
            />
          )}

          {!loading.loadingRE && selectCapa.requerimientos && !hiddenLayers.requerimientos && requiere.length > 0 && (
            <RequireView
              recursos={requiere}
              parseByField={parseByField}
              formatDate={formatDate}
              mtt={mtt}
              setOpenDialog={setOpenDialog}
              openDialog={openDialog}
            />
          )}

          {!loading.loadingPol && selectCapa.poligono && !hiddenLayers.poligono && dataPol && dataPol.length > 0 && (
            <PolEventView
              polygon={dataPol}
              formatDate={formatDate}
              mtt={mtt}
              setOpenDialog={setOpenDialog}
              files={files}
              openDialog={openDialog}
              afect={afectaciones}
              acciones={acciones}
              recursos={requiere}
            />
          )}

          {/* Capa de Afectaciones Registradas */}
          {selectCapa.afect_register && !hiddenLayers.afect_register && dataAfectRegister && dataAfectRegister.length > 0 && (
            <AfectMarkers
              afectData={dataAfectRegister}
              selectedItem={selectedItem}
              onItemClick={handleItemClick}
              onGeneratePDF={handleGeneratePDF}
              getEventIcon={getEventIcon}
              getEventIconPulso={getEventIconPulso}
              COLOR_PRIORIDAD={COLOR_PRIORIDAD}
              user={user}
              /* printToPDF={printToPDF} */
            />
          )}

        {/* Capa de Susceptibilidad */}
          <SucepLayer
            poligonosData={dataSusceptibilidad }
            showLayer={selectCapa.susceptibilidad && !hiddenLayers.susceptibilidad}
            loading={loadingPoligonos}
          />

          {/* Capa de Parroquias */}
          {selectCapa.parroquia && !hiddenLayers.parroquia && dataParroquia && dataParroquia.length > 0 && (
            <ParroquiaLayer parroquia={dataParroquia} />
          )}

     

          {children}
        </MapContainer>

        {/* Controles del mapa */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onLocate={handleLocate}
          onDownload={handleExportMap}
        />

        {/* Estado de capas activas con controles de recarga y ocultar */}
        {/* <LayerStatus 
          layers={activeLayersStatus} 
          onRefreshLayer={handleRefreshLayerClick}
          onToggleVisibility={handleToggleVisibility}
        /> */}

        {/* Indicador de carga al exportar */}
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

        {/* Panel flotante de recarga rápida (opcional) */}
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
              onClick={() => {
                const allLayerKeys = ["afectaciones", "acciones", "requerimientos", "poligono", "parroquia", "afect_register", "susceptibilidad"];
                allLayerKeys.forEach(key => onRefreshLayer?.(key));
              }}
              sx={{ bgcolor: "#f0f0f0" }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>
      </Box>

      {/* Diálogo de subida de imágenes */}
      <ImageUploadDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        typeInput={typeInput}
        files={files}
        setFiles={setFiles}
        datapol={dataPol}
        dataGeneral={
          typeInput === "poligono"
            ? dataPol
            : typeInput === "afectaciones"
            ? dataAF
            : typeInput === "acciones"
            ? dataAC
            : dataRE
        }
      />

      {/* Menú Contextual Popover */}
      <Popover
        open={Boolean(menuAnchor)}
        anchorReference="anchorPosition"
        anchorPosition={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{ 
          sx: { 
            width: 260, 
            p: 2, 
            borderRadius: 3,
            boxShadow: 3,
          } 
        }}
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Nueva acción
            </Typography>
            <IconButton size="small" onClick={() => setMenuAnchor(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
            📍 Lat: {coordinates?.lat} | Lng: {coordinates?.lng}
          </Typography>
          
          <Divider sx={{ my: 1.5 }} />
          
          <Stack spacing={1}>
            {layersConfig.map((item) => {
              // Excluir requerimientos si es necesario
              if (item.key === "requerimientos") return null;
              
              // Verificar si el botón debe estar deshabilitado
              const isDisabled = item.key === "afectaciones" && !dataPol?.length;
              
              return (
                <Tooltip 
                  key={item.key}
                  title={isDisabled ? "Debes cargar primero los polígonos de afectación" : ""}
                  placement="right"
                >
                  <span>
                    <Button
                      color={item.key === "afectaciones" ? "error" : "success"}
                      variant="outlined"
                      startIcon={item.icon}
                      fullWidth
                      onClick={() => handleLayerClick(item)}
                      disabled={isDisabled}
                      sx={{ 
                        justifyContent: "flex-start", 
                        textTransform: "none",
                        opacity: isDisabled ? 0.5 : 1,
                      }}
                    >
                      {item.label}
                    </Button>
                  </span>
                </Tooltip>
              );
            })}
          </Stack>
          
          <Divider sx={{ my: 1.5 }} />
          
          <Button
            variant="outlined"
            fullWidth
            size="small"
            startIcon={<ContentCopyIcon fontSize="small" />}
            onClick={handleCopyCoordinates}
          >
            Copiar Coordenadas
          </Button>
        </Box>
      </Popover>

      {/* Snackbar para notificaciones */}
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