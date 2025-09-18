import React, { useState } from 'react'
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  MenuItem
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import General from '../components/plancontingencia/general';
import Descripcion from '../components/plancontingencia/descripcion';
import Cronograma from '../components/plancontingencia/cronograma';

// Solución para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const steps = [
  'Información General',
  'Descripción y Aforo',
  'Cronograma',
  'Recursos y Amenazas',
  'Ubicación y Planos',
  'Organización y Brigadas',
  'Plan de Evacuación',
  'Coordinación y Asistencia'
];
export default function PlanContingencia() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Paso 1: Información General
    nombreEvento: '',
    organizador: '',
    empresaSeguridad: '',
    representanteLegal: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    sector: '',
    parroquia: '',
    lugar: '',
    tipoLugar: '',

    // Paso 2: Descripción y Aforo
    descripcionEvento: '',
    aforoPermitido: '',
    aforoDiaEvento: '',
    aforoVenta: '',
    responsableControl: '',

    // Más campos para los otros pasos...
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
         <General formData={formData}/>
        );
      case 1:
        return (
          <Descripcion formData={formData}/>
        );
        case 2:
        return (
          <Cronograma formData={formData}/>
        );
      case 4: // Paso de Ubicación y Planos
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Mapa de Ubicación
              </Typography>
              <div style={{ height: '400px', width: '100%' }}>
                <MapContainer 
                  center={[-4.007, -79.211]} 
                  zoom={15} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[-4.007, -79.211]}>
                    <Popup>
                      Explanada de estadio "Reina del cisne"<br />
                      Sector 24 de mayo<br />
                      Parroquia El Sagrario
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="observacionesUbicacion"
                label="Observaciones de Ubicación"
                multiline
                rows={3}
                fullWidth
                value={formData.observacionesUbicacion || ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      // Implementar los demás casos para cada paso...
      default:
        return <div>Paso {step + 1} - En desarrollo</div>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Plan de Contingencia para Eventos Públicos
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length ? (
          <div>
            <Typography variant="h5" gutterBottom>
              Plan de Contingencia Completado
            </Typography>
            <Typography variant="body1">
              Su plan de contingencia ha sido creado exitosamente.
            </Typography>
          </div>
        ) : (
          <div>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Anterior
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </Box>
          </div>
        )}
      </Paper>
    </Container>
  );
};