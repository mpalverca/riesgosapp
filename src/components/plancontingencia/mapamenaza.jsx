import { useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,

  Box
} from '@mui/material';

import MapViewer from '../maps/MapViewer';


const IdentificacionAmenazas = ({ handleNext, handleBack }) => {
  const [selectedRisks, setSelectedRisks] = useState([]);
  const [otherRisks, setOtherRisks] = useState('');

  const riskOptions = [
    { value: 'sismos', label: 'Sismos', icon: '🌋' },
    { value: 'inundaciones', label: 'Inundaciones', icon: '🌊' },
    { value: 'deslizamientos', label: 'Deslizamientos', icon: '⛰️' },
    { value: 'hundimientos', label: 'Hundimientos', icon: '🕳️' },
    { value: 'incendios', label: 'Incendios', icon: '🔥' },
    { value: 'robos', label: 'Robos/Vandalismo', icon: '🚨' },
    { value: 'drogas', label: 'Expendio de Drogas', icon: '⚠️' },
    { value: 'vias', label: 'Vías Peligrosas', icon: '🛣️' }
  ];

  const toggleRisk = (risk) => {
    if (selectedRisks.includes(risk)) {
      setSelectedRisks(selectedRisks.filter(r => r !== risk));
    } else {
      setSelectedRisks([...selectedRisks, risk]);
    }
  };

  // Datos de ejemplo para el mapa - coordenadas de Loja, Ecuador
  const mapData = {
    center: [-4.007, -79.211], // Coordenadas de Loja, Ecuador
    zoom: 14,
    markers: [
      {
        position: [-4.007, -79.211],
        title: 'Explanada Estadio "Reina del Cisne"',
        description: 'Lugar del evento OktobertFest 2025'
      }
    ],
    riskLayers: selectedRisks.map(risk => {
      // Simular capas de riesgo alrededor del área del evento
      let riskPoints = [];
      
      // Generar puntos aleatorios alrededor del centro según el tipo de riesgo
      switch(risk) {
        case 'inundaciones':
          riskPoints = [
            [-4.005, -79.210],
            [-4.006, -79.212],
            [-4.008, -79.209]
          ];
          break;
        case 'deslizamientos':
          riskPoints = [
            [-4.009, -79.213],
            [-4.004, -79.214]
          ];
          break;
        case 'incendios':
          riskPoints = [
            [-4.007, -79.208],
            [-4.005, -79.207]
          ];
          break;
        default:
          riskPoints = [
            [-4.006, -79.211],
            [-4.008, -79.210],
            [-4.007, -79.212]
          ];
      }
      
      return {
        type: risk,
        points: riskPoints,
        color: getRiskColor(risk)
      };
    })
  };

  function getRiskColor(riskType) {
    const colors = {
      sismos: '#ff0000',        // Rojo
      inundaciones: '#0066cc',  // Azul
      deslizamientos: '#8b4513',// Marrón
      hundimientos: '#654321',  // Marrón oscuro
      incendios: '#ff4500',     // Naranja rojizo
      robos: '#ffd700',         // Amarillo
      drogas: '#9370db',        // Púrpura
      vias: '#ff8c00'           // Naranja oscuro
    };
    return colors[riskType] || '#666666';
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Identificación de Amenazas
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        📌 Recomendación: Identificar correctamente los riesgos específicos
        de tu zona reduce en un 70% los daños durante emergencias.
      </Typography>
      <Grid container spacing={3}>
        <Grid item  size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selecciona los riesgos de tu zona:
          </Typography>
          <Grid container spacing={1}>
            {riskOptions.map((risk) => (
              <Grid item  size={{ xs: 12, md: 3 }} key={risk.value}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    borderColor: selectedRisks.includes(risk.value)
                      ? "primary.main"
                      : "divider",
                    backgroundColor: selectedRisks.includes(risk.value)
                      ? "primary.light"
                      : "background.paper",
                    transition: "all 0.2s ease",
                    '&:hover': {
                      transform: "translateY(-2px)",
                      boxShadow: 2
                    }
                  }}
                  onClick={() => toggleRisk(risk.value)}
                >
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h6">{risk.icon}</Typography>
                    <Typography variant="body2">{risk.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <TextField
            fullWidth
            label="Otros riesgos (especificar)"
            value={otherRisks}
            onChange={(e) => setOtherRisks(e.target.value)}
            placeholder="Ej: Accidentes químicos, fallas eléctricas"
            sx={{ mt: 2 }}
          />
          
          {selectedRisks.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Leyenda de riesgos seleccionados:
              </Typography>
              <Grid container spacing={1}>
                {selectedRisks.map(risk => {
                  const riskInfo = riskOptions.find(r => r.value === risk);
                  return (
                    <Grid item  size={{ xs: 12, md: 3 }} key={risk}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: getRiskColor(risk),
                            mr: 1
                          }}
                        />
                        <Typography variant="body2">
                          {riskInfo?.label}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Grid>

        <Grid item  size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" gutterBottom>
            Mapa de susceptibilidad 
          </Typography>
          <Box
            sx={{
              height: 400,
              widows:'100%',
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <MapViewer
              center={mapData.center}
              zoom={mapData.zoom}
              markers={mapData.markers}
              riskLayers={mapData.riskLayers}
              height="100%"
              width="100%"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Los poligonos referesntan zonas donde han sucedido
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default IdentificacionAmenazas;