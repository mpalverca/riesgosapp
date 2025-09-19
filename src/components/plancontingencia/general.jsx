import  { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Place as PlaceIcon,
  MyLocation as MyLocationIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const InformacionGeneral = () => {
  const [formData, setFormData] = useState({
    nombreEvento: '',
    organizador: '',
    empresaSeguridad: '',
    representanteLegal: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    ubicacion: '',
    barrio: '',
    parroquia: '',
    tipoEspacio: {
      casaComunal: false,
      viaPublica: false,
      infraestructuraMovil: false,
      otro: false
    },
    otroEspacio: '',
    coordenadas: [-4.007, -79.211] // Coordenadas de Loja, Ecuador por defecto
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        tipoEspacio: {
          ...prev.tipoEspacio,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMapClick = (coords) => {
    setFormData(prev => ({
      ...prev,
      coordenadas: coords
    }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            coordenadas: [latitude, longitude]
          }));
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          alert("No se pudo obtener la ubicación actual. Asegúrate de permitir el acceso a la ubicación.");
        }
      );
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  };

  return (
    <Box sx={{ p: 3, margin: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      
          <Typography variant="h5" gutterBottom>
            Información Básica
          </Typography>
          
          <Grid container spacing={3} padding={1}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="nombreEvento"
                label="Nombre del Evento"
                value={formData.nombreEvento}
                onChange={handleInputChange}
                placeholder="Ingrese nombre del evento"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="organizador"
                label="Organizador del Evento"
                value={formData.organizador}
                onChange={handleInputChange}
                placeholder="Ingrese nombre del organizador"
              />
            </Grid>
             <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="organizador"
                label="Identifiación del organizador"
                value={formData.organizador}
                onChange={handleInputChange}
                placeholder="Ingrese nombre del organizador"
              />
            </Grid>
            </Grid>
            <Grid container spacing={3} padding={1}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="empresaSeguridad"
                label="Empresa de Seguridad"
                value={formData.empresaSeguridad}
                onChange={handleInputChange}
                placeholder="Ingrese empresa de seguridad"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="representanteLegal"
                label="Representante Legal de la empresa de seguridad"
                value={formData.representanteLegal}
                onChange={handleInputChange}
                placeholder="Ingrese nombre del representante legal"
              />
            </Grid>
            </Grid>
            <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                name="fecha"
                label="Fecha del Evento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.fecha}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                name="horaInicio"
                label="Hora de Inicio"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.horaInicio}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                name="horaFin"
                label="Hora de Finalización"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.horaFin}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                name="ubicacion"
                label="Ubicación"
                value={formData.ubicacion}
                onChange={handleInputChange}
                placeholder="Ingrese dirección del evento"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                name="barrio"
                label="Barrio"
                value={formData.barrio}
                onChange={handleInputChange}
                placeholder="Ingrese nombre del barrio"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                name="parroquia"
                label="Parroquia"
                value={formData.parroquia}
                onChange={handleInputChange}
                placeholder="Ingrese nombre de la parroquia"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Tipo de Espacio
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="casaComunal"
                        checked={formData.tipoEspacio.casaComunal}
                        onChange={handleInputChange}
                      />
                    }
                    label="Casa Comunal"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="viaPublica"
                        checked={formData.tipoEspacio.viaPublica}
                        onChange={handleInputChange}
                      />
                    }
                    label="Uso de la vía Pública"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="infraestructuraMovil"
                        checked={formData.tipoEspacio.infraestructuraMovil}
                        onChange={handleInputChange}
                      />
                    }
                    label="Infraestructura Móvil"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="otro"
                        checked={formData.tipoEspacio.otro}
                        onChange={handleInputChange}
                      />
                    }
                    label="Otro"
                  />
                </Grid>
                {formData.tipoEspacio.otro && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="otroEspacio"
                      label="Especifique otro tipo de espacio"
                      value={formData.otroEspacio}
                      onChange={handleInputChange}
                      placeholder="Especifique el tipo de espacio"
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
       
        
        <Divider sx={{ mb: 3 }} />
        
        <Box>
          <Typography variant="h5" gutterBottom>
            Ubicación en Mapa
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecciona la ubicación exacta del evento en el mapa o utiliza tu ubicación actual
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
          
          <Box
            sx={{
              height: 400,
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <MapViewer 
              center={formData.coordenadas}
              zoom={15}
              markers={[
                {
                  position: formData.coordenadas,
                  title: formData.nombreEvento,
                  description: formData.ubicacion
                }
              ]}
              onClick={handleMapClick}
              height="100%"
            />
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Haz clic en el mapa para establecer la ubicación exacta del evento
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default InformacionGeneral;




// Solución para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Componente para detectar clics en el mapa
function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const MapViewer = ({ center, zoom, markers, onClick, height = '400px' }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapClickHandler onClick={onClick} />
      
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>
            <strong>{marker.title}</strong>
            <br />
            {marker.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

