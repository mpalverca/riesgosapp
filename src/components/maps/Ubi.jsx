import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  MyLocation as MyLocationIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';

// Componente simple para obtener coordenadas (sin mapa)
const SelectorCoordenadasSimple = ({ onCoordenadasChange, label = "Ubicación del evento" }) => {
  const [coordenadas, setCoordenadas] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerUbicacion = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por el navegador');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nuevasCoords = { lat: latitude, lng: longitude };
        setCoordenadas(nuevasCoords);
        if (onCoordenadasChange) {
          onCoordenadasChange(nuevasCoords);
        }
        setLoading(false);
      },
      (err) => {
        setError(`Error: ${err.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleManualInput = (field, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const nuevasCoords = { ...coordenadas, [field]: numValue };
      setCoordenadas(nuevasCoords);
      if (onCoordenadasChange) {
        onCoordenadasChange(nuevasCoords);
      }
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocationOnIcon color="primary" sx={{ mr: 1 }} />
        <strong>{label}</strong>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MyLocationIcon />}
            onClick={obtenerUbicacion}
            disabled={loading}
          >
            Obtener ubicación
          </Button>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Latitud"
            type="number"
            value={coordenadas.lat || ''}
            onChange={(e) => handleManualInput('lat', e.target.value)}
            InputProps={{
              endAdornment: <span>°</span>
            }}
            helperText="Ej: -0.180653"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Longitud"
            type="number"
            value={coordenadas.lng || ''}
            onChange={(e) => handleManualInput('lng', e.target.value)}
            InputProps={{
              endAdornment: <span>°</span>
            }}
            helperText="Ej: -78.467834"
          />
        </Grid>
      </Grid>

      {coordenadas.lat && coordenadas.lng && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Coordenadas listas: {coordenadas.lat.toFixed(6)}, {coordenadas.lng.toFixed(6)}
        </Alert>
      )}
    </Paper>
  );
};

export default SelectorCoordenadasSimple;