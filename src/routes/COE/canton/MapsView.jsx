import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { AfectacionesView } from "./popups/afectaciones";
import { useEffect, useState } from "react";
import { AccionesView } from "./popups/acciones";
import { RecursosView } from "./popups/recursos";
import { Box, Button, IconButton, Popover, Stack, Typography } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MarkerSimple } from "../../../components/maps/marker";
// Componente para manejar eventos del mapa
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);

    },
  });
  return null;
};
function MapMark({ position, zoom, dataAF, mtt, dataAC, dataRE, layersConfig,...props }) {
  // Estado para almacenar los marcadores procesados
  const [afectaciones, setAfect] = useState([]);
  const [acciones, setAcc] = useState([]);
  const [recursos, setRec] = useState([]);
  //click dar para evento
  const [clickPosition, setClickPosition] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  // Efecto para procesar dataAF y convertir ubi de string a array
  useEffect(() => {
    if (dataAF && Array.isArray(dataAF) && dataAF.length > 0) {
      const processedMarkers = dataAF
        .map((item, index) => {
          if (!item.ubi) return null;

          try {
            // Convertir la cadena "[lat, lng]" a array de números
            let coordinates;

            if (typeof item.ubi === "string") {
              // Remover corchetes y espacios, luego dividir por coma
              const cleanStr = item.ubi.replace(/[\[\]\s]/g, "");
              const parts = cleanStr.split(",");

              if (parts.length >= 2) {
                coordinates = [parseFloat(parts[0]), parseFloat(parts[1])];

                // Validar que sean números válidos
                if (!isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
                  return {
                    id: index,
                    position: coordinates,
                    data: item,
                  };
                }
              }
            } else if (Array.isArray(item.ubi)) {
              // Si ya es un array, usarlo directamente
              coordinates = item.ubi;
              return {
                id: index,
                position: coordinates,
                data: item,
              };
            }
          } catch (error) {
            console.error(`Error procesando ubi del item ${index}:`, error);
          }

          return null;
        })
        .filter((marker) => marker !== null);
      setAfect(processedMarkers);
    } else {
      setAfect([]);
    }
  }, [dataAF]);
  useEffect(() => {
    if (dataAC && Array.isArray(dataAC) && dataAC.length > 0) {
      const processedMarkers = dataAC
        .map((item, index) => {
          if (!item.ubi) return null;

          try {
            // Convertir la cadena "[lat, lng]" a array de números
            let coordinates;

            if (typeof item.ubi === "string") {
              // Remover corchetes y espacios, luego dividir por coma
              const cleanStr = item.ubi.replace(/[\[\]\s]/g, "");
              const parts = cleanStr.split(",");

              if (parts.length >= 2) {
                coordinates = [parseFloat(parts[0]), parseFloat(parts[1])];

                // Validar que sean números válidos
                if (!isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
                  return {
                    id: index,
                    position: coordinates,
                    data: item,
                  };
                }
              }
            } else if (Array.isArray(item.ubi)) {
              // Si ya es un array, usarlo directamente
              coordinates = item.ubi;
              return {
                id: index,
                position: coordinates,
                data: item,
              };
            }
          } catch (error) {
            console.error(`Error procesando ubi del item ${index}:`, error);
          }

          return null;
        })
        .filter((marker) => marker !== null);
      setAcc(processedMarkers);
    } else {
      setAcc([]);
    }
  }, [dataAC]);
  useEffect(() => {
    if (dataRE && Array.isArray(dataRE) && dataRE.length > 0) {
      console.log(dataRE);
      const processedMarkers = dataRE
        .map((item, index) => {
          if (!item.ubi) return null;
          try {
            // Convertir la cadena "[lat, lng]" a array de números
            let coordinates;
            if (typeof item.ubi === "string") {
              // Remover corchetes y espacios, luego dividir por coma
              const cleanStr = item.ubi.replace(/[\[\]\s]/g, "");
              const parts = cleanStr.split(",");
              if (parts.length >= 2) {
                coordinates = [parseFloat(parts[0]), parseFloat(parts[1])];
                // Validar que sean números válidos
                if (!isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
                  return {
                    id: index,
                    position: coordinates,
                    data: item,
                  };
                }
              }
            } else if (Array.isArray(item.ubi)) {
              // Si ya es un array, usarlo directamente
              coordinates = item.ubi;
              return {
                id: index,
                position: coordinates,
                data: item,
              };
            }
          } catch (error) {
            console.error(`Error procesando ubi del item ${index}:`, error);
          }

          return null;
        })
        .filter((marker) => marker !== null);
      setRec(processedMarkers);
    } else {
      setRec([]);
    }
  }, [dataRE]);
  // Función para parsear el campo 'by' que también es string
  const parseByField = (byString) => {
    try {
      if (typeof byString === "string") {
        // Reemplazar comillas simples por dobles y nombres sin comillas
        const fixedString = byString
          .replace(/(\w+):/g, '"$1":') // Agregar comillas a las keys
          .replace(/:\s*(\w+)(,|})/g, ': "$1"$2') // Agregar comillas a valores simples
          .replace(/:(\d+)(,|})/g, ": $1$2") // No agregar comillas a números
          .replace(/'/g, '"'); // Reemplazar comillas simples

        return JSON.parse(fixedString);
      }
      return byString;
    } catch (error) {
      //console.error("Error parseando campo 'by':", error);
      return { error: "No se pudo parsear la información" };
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";

    try {
      // Separar fecha y hora
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/");

      // Crear fecha manualmente
      const date = new Date(year, month - 1, day);

      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };
  //funcion to clcik interaction map
  const handleMapClick = (latlng) => {
    // Convertir coordenadas Leaflet a posición en pantalla
    const mapContainer = document.querySelector(".leaflet-container");
    const rect = mapContainer.getBoundingClientRect();

    setCoordinates({
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6),
      latlng: latlng,
    });

    setMenuAnchor({
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    });

    setClickPosition(latlng);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setCoordinates(null);
  };

  const handleLayerClick = (item) => {
    item.accion(coordinates);
    handleMenuClose();
  };
  return (
    <>
    <MapContainer
      center={position}
      zoom={zoom}
      
      style={{ height: "90vh", width: "100%" }}
      scrollWheelZoom={true}
    >
        {coordinates && <MarkerSimple iconMark={<LocationOnIcon/>} position={coordinates} />}
        <MapClickHandler onMapClick={handleMapClick} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Mostrar todos los marcadores procesados */}
      {props.loading.loadingAF == false && props.selectCapa.afectaciones && (
        <AfectacionesView
          afect={afectaciones}
          parseByField={parseByField}
          formatDate={formatDate}
          mtt={mtt}
        />
      )}
      {props.loading.loadingAC == false && props.selectCapa.acciones && (
        <AccionesView
          acciones={acciones}
          parseByField={parseByField}
          formatDate={formatDate}
        />
      )}
      {props.loading.loadingRE == false &&
        props.selectCapa.recursos &&
        recursos && (
          <RecursosView
            recursos={recursos}
            parseByField={parseByField}
            formatDate={formatDate}
          />
        )}
      {/* Otras capas personalizadas */}
      {props.children}
    </MapContainer>
    {/* Menú contextual */}
      <Popover
        open={Boolean(menuAnchor)}
        anchorReference="anchorPosition"
        anchorPosition={menuAnchor}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 280,
            maxHeight: 400,
            overflow: 'auto',
            mt: 1,
            ml: 1
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header con coordenadas */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Coordenadas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                Lat: {coordinates?.lat}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                Lng: {coordinates?.lng}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleMenuClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Botones de capas */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Acciones en esta ubicación:
          </Typography>
          
          <Stack spacing={1}>
            {layersConfig.map((item) => (
              <Button
                key={item.key}
                variant="outlined"
                startIcon={item.icon}
                onClick={() => handleLayerClick(item)}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  py: 1,
                  textTransform: 'none',
                  fontSize: '0.875rem'
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Botón para copiar coordenadas */}
          <Button
            variant="contained"
            fullWidth
            size="small"
            startIcon={<ContentCopyIcon fontSize="small" />}
            onClick={() => {
              navigator.clipboard.writeText(`${coordinates?.lat}, ${coordinates?.lng}`);
            }}
            sx={{ mt: 2 }}
          >
            Copiar Coordenadas
          </Button>
        </Box>
      </Popover></>
  );
}
export default MapMark;
