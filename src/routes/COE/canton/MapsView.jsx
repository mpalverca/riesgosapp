import React, { useState, useMemo, useRef } from "react";
import { LayersControl, MapContainer, TileLayer, useMapEvents, } from "react-leaflet";
import leafletImage from 'leaflet-image';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { MarkerSimple } from "../../../components/maps/marker";
import { AfectacionesView } from "./popups/afectaciones";
import { AccionesView } from "./popups/acciones";
import { RequireView } from "./popups/recursos";
import { PolEventView } from "./popups/afectMMT/pol_event";
import ImageUploadDialog from "./popups/inputs/inputsDialog";
import { coordForm } from "../../utils/Coords";

// Componente interno para capturar clicks
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick(e.latlng),
  });
  return null;
};

function MapMark({
  position,
  zoom,
  dataAF,
  dataAC,
  dataRE,
  dataPol,
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
  // --- UTILIDADES ---
  // Función centralizada para procesar cualquier tipo de marcador (Afectaciones, Acciones, etc.)
  const processMarkers = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData
      .map((item, index) => {
        if (!item.ubi) return null;
       // let coords = null;

        try {
          const coords=coordForm(item.ubi)
          return coords
            ? { id: item._id || index, position: coords, data: item }
            : null;
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  };

   const mapRef = useRef(null); // da valor l mapa para print
   
   const printToPDF = () => {
    if (!mapRef.current) {
      alert("El mapa no está listo aún");
      return;
    }
    const map = mapRef.current;
    leafletImage(map, (err, canvas) => {
      if (err) {
        console.error("Error:", err);
        return;
      }
      
      const imgData = canvas.toDataURL('image/png');
      return imgData
    });
  };
  
  // Memorizar marcadores para evitar cálculos innecesarios
  const afectaciones = useMemo(() => processMarkers(dataAF), [dataAF]);
  const acciones = useMemo(() => processMarkers(dataAC), [dataAC]);
  const requiere = useMemo(() => processMarkers(dataRE), [dataRE]);

  const parseByField = (byString) => {
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
  };

  const formatDate = (dateString) => {
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
  };

  // --- HANDLERS ---

  const handleMapClick = (latlng) => {
    const mapContainer = document.querySelector(".leaflet-container");
    const rect = mapContainer.getBoundingClientRect();

    setCoordinates({
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6),
      latlng: latlng,
    });

    setMenuAnchor({
      left: rect.left + window.scrollX + 20, // offset para no tapar el click
      top: rect.top + window.scrollY + 20,
    });
  };

  const handleLayerClick = (item) => {
    item.accion(coordinates.latlng);
    setMenuAnchor(null);
  };

  return (
    <>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: "90vh", width: "100%", borderRadius: "8px" }}
      >
        {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />

        <MapClickHandler onMapClick={handleMapClick} />

        {/* Marcador temporal de selección */}
        {coordinates && (
          <MarkerSimple
            iconMark={<LocationOnIcon color="primary" />}
            position={[coordinates.latlng.lat, coordinates.latlng.lng]}
          />
        )}

        {/* Capas de Datos */}
        {!loading.loadingAF && selectCapa.afectaciones && (
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

        {/* Usando la lógica de las nuevas props independientes de loading */}
        {!loading.loadingAC && selectCapa.acciones && (
          <AccionesView
            acciones={acciones}
            parseByField={parseByField}
            formatDate={formatDate}
            mtt={mtt}
            polAfect={dataPol}
            setOpenDialog={setOpenDialog}
            openDialog={openDialog}
            setTypeInput={setTypeInput}
          />
        )}

        {!loading.loadingRE && selectCapa.requerimientos && (
          <RequireView
            recursos={requiere}
            parseByField={parseByField}
            formatDate={formatDate}
            mtt={mtt}
            setOpenDialog={setOpenDialog}
            openDialog={openDialog}
          />
        )}
        {!loading.loadingPol && selectCapa.poligono && (
          <PolEventView
            polygon={dataPol}
            parseByField={parseByField}
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
        {children}
        <LayersControl position="topright">
          <LayersControl.Overlay name="Poligono de afectación">
            {!loading.loadingPol && selectCapa.poligono && (
              <PolEventView
                polygon={dataPol}
                parseByField={parseByField}
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
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
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
        PaperProps={{ sx: { width: 200, p: 2, borderRadius: 3 } }}
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Añadir nuevo punto
            </Typography>
            <IconButton size="small" onClick={() => setMenuAnchor(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="caption" display="block" color="text.secondary">
            Lat: {coordinates?.lat} | Lng: {coordinates?.lng}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Stack spacing={1}>
            {layersConfig.map((item) =>
              // CORRECCIÓN AQUÍ: usa ===
              item.key === "requerimientos" ? null : (
                <Button
                  color= {item.key === "afectaciones"? "error":"success"}
                  key={item.key}
                  variant="outlined"
                  startIcon={item.icon}
                  fullWidth
                  onClick={() => handleLayerClick(item)}
                  sx={{ justifyContent: "flex-start", textTransform: "none" }}
                >
                  {item.label}
                </Button>
              ),
            )}
          </Stack>
          <Divider sx={{ pb: 2 }} />
          <Button
            variant="outlined"
            fullWidth
            size="small"
            startIcon={<ContentCopyIcon fontSize="small" />}
            sx={{ mt: 2 }}
            onClick={() =>
              navigator.clipboard.writeText(
                `${coordinates?.lat}, ${coordinates?.lng}`,
              )
            }
          >
            Copiar Coordenadas
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default MapMark;
