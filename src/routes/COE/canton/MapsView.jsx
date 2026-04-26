import React, { useState, useMemo, useRef, useCallback } from "react";
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
} from "@mui/icons-material";
import { MarkerSimple } from "../../../components/maps/marker";
import { AfectacionesView } from "./popups/afectaciones";
import { AccionesView } from "./popups/acciones";
import { RequireView } from "./popups/recursos";
import { PolEventView } from "./popups/afectMMT/pol_event";
import ImageUploadDialog from "./popups/inputs/inputsDialog";
import { coordForm } from "../../utils/Coords";

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

// Componente para el estado de carga de capas
const LayerStatus = ({ layers }) => {
  const activeLayers = layers.filter(l => l.active).length;
  const totalLayers = layers.length;
  
  if (activeLayers === 0) return null;
  
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 20,
        left: 10,
        zIndex: 1000,
        bgcolor: "rgba(0,0,0,0.7)",
        color: "white",
        borderRadius: 2,
        px: 1.5,
        py: 0.5,
        fontSize: "0.75rem",
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <LayersIcon sx={{ fontSize: 14 }} />
      <Typography variant="caption">
        {activeLayers} / {totalLayers} capas activas
      </Typography>
    </Box>
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

  // Verificar si hay datos en las capas activas
  const activeLayersStatus = useMemo(() => {
    return [
      { key: "afectaciones", active: selectCapa.afectaciones, count: afectaciones.length },
      { key: "acciones", active: selectCapa.acciones, count: acciones.length },
      { key: "requerimientos", active: selectCapa.requerimientos, count: requiere.length },
      { key: "poligono", active: selectCapa.poligono, count: dataPol?.length || 0 },
    ];
  }, [selectCapa, afectaciones, acciones, requiere, dataPol]);

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

          {/* Capa de calles (opcional, descomentar si se necesita) */}
          {/* <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          /> */}

          <MapClickHandler onMapClick={handleMapClick} />
          <MapCenter center={mapCenter} zoom={mapZoom} />

          {/* Marcador temporal de selección */}
          {coordinates && (
            <MarkerSimple
              iconMark={<LocationOnIcon sx={{ color: "#e6101b", fontSize: 40 }} />}
              position={[coordinates.latlng.lat, coordinates.latlng.lng]}
            />
          )}

          {/* Capas de Datos con memoización */}
          {!loading.loadingAF && selectCapa.afectaciones && afectaciones.length > 0 && (
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

          {!loading.loadingAC && selectCapa.acciones && acciones.length > 0 && (
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

          {!loading.loadingRE && selectCapa.requerimientos && requiere.length > 0 && (
            <RequireView
              recursos={requiere}
              parseByField={parseByField}
              formatDate={formatDate}
              mtt={mtt}
              setOpenDialog={setOpenDialog}
              openDialog={openDialog}
            />
          )}

          {!loading.loadingPol && selectCapa.poligono && dataPol && dataPol.length > 0 && (
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

          {/* Capas adicionales */}
          {selectCapa.parroquia && dataParroquia && dataParroquia.length > 0 && (
            // Aquí puedes agregar el componente para mostrar parroquias
            <></>
          )}

          {selectCapa.afect_register && dataAfectRegister && dataAfectRegister.length > 0 && (
            // Aquí puedes agregar el componente para mostrar afectaciones registradas
            <></>
          )}

          {selectCapa.susceptibilidad && dataSusceptibilidad && dataSusceptibilidad.length > 0 && (
            // Aquí puedes agregar el componente para mostrar susceptibilidad
            <></>
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

        {/* Estado de capas activas */}
        <LayerStatus layers={activeLayersStatus} />

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