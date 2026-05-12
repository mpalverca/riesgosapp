import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Place as PlaceIcon,
  MyLocation as MyLocationIcon,
} from "@mui/icons-material";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapViewer from "./maps/ubiMap";
import ShapeTable from "./maps/shapeTable";
import InfoBase, { SpaceData } from "./general/infoBase";
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import 'leaflet-easyprint';

const InformacionGeneral = () => {
  const [formData, setFormData] = useState({
    nombreEvento: "",
    organizador: "",
    empresaSeguridad: "",
    representanteLegal: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    ubicacion: "",
    barrio: "",
    parroquia: "",
    espacio: {
      privado: false,
      publico: false,
    },
    tipoEspacio: {
      casaComunal: false,
      viaPublica: false,
      parque: false,
      predio: false,
      infraestructuraMovil: false,
      comercial: false,
      otro: false,
    },
    comercial: "",
    otroEspacio: "",
    coordenadas: [-4.007, -79.211], // Coordenadas de Loja, Ecuador por defecto
  });
  const [drawings, setDrawings] = useState([]);
  const [drawingMode, setDrawingMode] = useState(null); // 'point', 'polygon', 'line'

  const handleDrawComplete = (drawing) => {
    setDrawings((prev) => [...prev, drawing]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        tipoEspacio: {
          ...prev.tipoEspacio,
          [name]: checked,
        },
        espacio: {
          ...prev.espacio,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  /*  const handleEspacioChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        espacio: {
          ...prev.espacio,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }; */

  /* const handleMapClick = (coords) => {
    setFormData((prev) => ({
      ...prev,
      coordenadas: coords,
    }));
  }; */

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            coordenadas: [latitude, longitude],
          }));
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          alert(
            "No se pudo obtener la ubicación actual. Asegúrate de permitir el acceso a la ubicación.",
          );
        },
      );
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  };

  return (
    <Box sx={{ p: 3, margin: "auto" }}>
      <InfoBase formData={formData} handleInputChange={handleInputChange} />
      <SpaceData formData={formData} handleInputChange={handleInputChange} />

      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Divider sx={{ mb: 3 }} />
        <Box>
          <Typography variant="h5" gutterBottom>
            Ubicación en Mapa
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecciona la ubicación exacta del evento en el mapa o utiliza tu
            ubicación actual
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <TextField
              sx={{ mr: 2, width: 200 }}
              label="Latitud"
              value={formData.coordenadas[0]}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ mr: 2, width: 200 }}
              label="Longitud"
              value={formData.coordenadas[1]}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<MyLocationIcon />}
              onClick={handleGetCurrentLocation}
            >
              Mi ubicación
            </Button>
          </Box>

          {/* <Box
            sx={{
              height: 400,
              borderRadius: 1,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <div>
                 <IconButton onClick={() => setDrawingMode("point")}>
                Punto
              </IconButton> 
              <IconButton onClick={() => setDrawingMode("polygon")}>
                Polígono
              </IconButton>
              <IconButton onClick={() => setDrawingMode("line")}>
                Línea
              </IconButton>
              <IconButton onClick={() => setDrawingMode(null)}>
                Cancelar
              </IconButton>
            </div>
             <MapViewer
              center={[-3.996568, -79.201696]}
              zoom={10}
              drawingMode={drawingMode}
              drawings={drawings}
              onDrawComplete={handleDrawComplete}
              drawingColor="#ff0000"
              height="800px"
            /> 
           
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Haz clic en el mapa para establecer la ubicación exacta del evento
          </Typography> */}
        </Box>
        {/* <ShapeTable shape={drawings} /> */}

         <MapEditor />
      </Paper>
    </Box>
  );
};

export default InformacionGeneral;

// Solución para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});


// Componente que agrega el screenshoter al mapa
const MapScreenshoter = ({ onScreenshotReady }) => {
  const map = useMap();
  
  useEffect(() => {
    // Inicializar el plugin de screenshot
    const screenshoter = L.simpleMapScreenshoter({
      // Opcional: ocultar ciertos elementos antes de capturar
      hiddenCSS: { display: 'none' }
    }).addTo(map);
    
    // Guardar referencia para usarla desde fuera
    if (onScreenshotReady) {
      onScreenshotReady(screenshoter);
    }
    
    return () => {
      map.removeControl(screenshoter);
    };
  }, [map, onScreenshotReady]);
  
  return null;
};


const EasyPrintControl = ({ position = 'topleft', sizeModes, exportOnly = true, title = 'Exportar como PNG' }) => {
  const map = useMap();
  
  useEffect(() => {
    const control = L.easyPrint({
      position,
      sizeModes,
      exportOnly,
      title
    }).addTo(map);
    
    return () => {
      map.removeControl(control);
    };
  }, [map, position, sizeModes, exportOnly, title]);
  
  return null;
};


const MapEditor = () => {
  const [polygonPoints, setPolygonPoints] = useState([]);

  const _onCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      // Extraer las coordenadas del polígono dibujado
      const latlngs = layer.getLatLngs()[0];
      console.log("Coordenadas del polígono:", latlngs);
      setPolygonPoints(latlngs);
    }
    // Si necesitas capturar una línea (polyline)
    if (layerType === 'polyline') {
      const latlngs = layer.getLatLngs();
      console.log("Coordenadas de la línea:", latlngs);
    }
  };

  const _onEdited = (e) => {
    // Lógica para cuando se edita una figura
    const layers = e.layers;
    layers.eachLayer(layer => {
      if (layer.editing) {
        const updatedPoints = layer.editing.latlngs[0];
        setPolygonPoints(updatedPoints);
      }
    });
  };

  const _onDeleted = () => {
    setPolygonPoints([]);
  };

  const screenshoterRef = useRef(null);
  
  // Función para exportar la imagen
  const handleExportImage = async () => {
    console.log("Exportando imagen del mapa...")
    if (screenshoterRef.current) {
      try {
        // Captura la pantalla del mapa
        const imageData = await screenshoterRef.current.takeScreen('image/png');
        
        // Crear enlace para descargar
        const link = document.createElement('a');
        link.download = 'mi-mapa.png';
        link.href = imageData;
        link.click();
      } catch (error) {
        console.error('Error al capturar el mapa:', error);
      }
    }
  };
  //easy print
   const printControlRef = useRef(null);
  
  const handleExportWithRef = () => {
    // Si necesitas acceso programático al control
    if (printControlRef.current) {
      // printControlRef.current.printMap('A4Landscape', 'mi-mapa');
    }
  };
  return (
    
    <MapContainer center={[-3.9939, -79.2042]} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={_onCreate}
          onEdited={_onEdited}
          onDeleted={_onDeleted}
          draw={{
            rectangle: true,
            polygon: true,
            polyline: true,
            circle: false,
            marker: false,
          }}
        />
      </FeatureGroup>
      <EasyPrintControl 
          position="topright"
          sizeModes={['Current', 'A4Portrait', 'A4Landscape']}
          exportOnly={true}
          title="Exportar como PNG"
        />
    </MapContainer>
   
  );
};