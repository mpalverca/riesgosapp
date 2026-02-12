import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
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
  mtt,
  layersConfig,
  selectCapa,
  loading,
  children,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // --- UTILIDADES ---

  // Función centralizada para procesar cualquier tipo de marcador (Afectaciones, Acciones, etc.)
  const processMarkers = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData
      .map((item, index) => {
        if (!item.ubi) return null;
        let coords = null;
       
        try {
          if (typeof item.ubi === "string") {
            const cleanStr = item.ubi.replace(/[\[\]\s]/g, "");
            const parts = cleanStr.split(",");
            if (parts.length >= 2) {
              const lat = parseFloat(parts[0]);
              const lng = parseFloat(parts[1]);
              if (!isNaN(lat) && !isNaN(lng)) coords = [lat, lng];
            }
          } else if (Array.isArray(item.ubi)) {
            coords = item.ubi;
          }

          return coords
            ? { id: item._id || index, position: coords, data: item }
            : null;
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
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
          />
        )}

        {/* Usando la lógica de las nuevas props independientes de loading */}
        {!loading.loadingAC && selectCapa.acciones && (
          <AccionesView
            acciones={acciones}
            parseByField={parseByField}
            formatDate={formatDate}
            mtt={mtt}
          />
        )}

        {!loading.loadingRE && selectCapa.requerimientos && (
          <RequireView
            recursos={requiere}
            parseByField={parseByField}
            formatDate={formatDate}
            mtt={mtt}
          />
        )}

        {children}
      </MapContainer>

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
                color="success"
                  key={item.key}
                  variant="outlined"
                  startIcon={item.icon}
                  fullWidth
                  onClick={() => handleLayerClick(item)}
                  sx={{ justifyContent: "flex-start", textTransform: "none" }}
                >
                  Añadir {item.label}
                </Button>
              ),
            )}
          </Stack>
<Divider sx={{pb:2}} />
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
