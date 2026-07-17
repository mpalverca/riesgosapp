// components/DriveManager.jsx (modificado)
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid
} from '@mui/material';
import { CloudUpload, Link as LinkIcon } from '@mui/icons-material';
import { useDriveAPI } from './script_doc';

const MAX_SIZE_MB = 25;

const DriveManager = forwardRef(({ onUploadComplete, initialLink = '' }, ref) => {
  const {
    loading,
    error,
    subirArchivo
  } = useDriveAPI();

  const [archivo, setArchivo] = useState(null);
  const [linkManual, setLinkManual] = useState(initialLink);
  const [enlace, setEnlace] = useState(initialLink);
  const [subiendo, setSubiendo] = useState(false);
  const [errorLocal, setErrorLocal] = useState(null);

  // Exponer métodos al padre
  useImperativeHandle(ref, () => ({
    uploadFile: async () => {
      // Si ya hay enlace (manual o subido), devolverlo
      if (enlace) return enlace;

      // Si no hay archivo seleccionado, error
      if (!archivo) {
        throw new Error('No hay archivo seleccionado para subir');
      }

      // Validar tamaño
      if (archivo.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`El archivo excede el tamaño máximo de ${MAX_SIZE_MB} MB`);
      }

      setSubiendo(true);
      setErrorLocal(null);
      try {
        const resultado = await subirArchivo(archivo, '');
        if (resultado.success) {
          const url = resultado.data.url;
          setEnlace(url);
          if (onUploadComplete) onUploadComplete(url);
          return url;
        } else {
          throw new Error(resultado.error || 'Error al subir');
        }
      } catch (err) {
        setErrorLocal(err.message);
        throw err;
      } finally {
        setSubiendo(false);
      }
    },
    getLink: () => enlace,
    hasFile: () => !!archivo || !!enlace
  }));

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño inmediatamente
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setErrorLocal(`El archivo excede el tamaño máximo de ${MAX_SIZE_MB} MB`);
        setArchivo(null);
        return;
      }
      setErrorLocal(null);
      setArchivo(file);
      // Si había un enlace manual, lo limpiamos
      setLinkManual('');
      setEnlace('');
    }
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setLinkManual(value);
    if (value) {
      setEnlace(value);
      setArchivo(null);
      if (onUploadComplete) onUploadComplete(value);
    } else {
      setEnlace('');
    }
  };

  // Si se pasa un initialLink, lo establecemos
  useEffect(() => {
    if (initialLink) {
      setEnlace(initialLink);
      setLinkManual(initialLink);
    }
  }, [initialLink]);

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2, border: '1px dashed #ccc' }}>
      <Typography variant="subtitle2" gutterBottom>
        Subir evidencia o ingresar enlace
      </Typography>

      <Grid container spacing={2}>
        <Grid item size={{xs:12, md:6}}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            fullWidth
            disabled={subiendo}
          >
            Seleccionar archivo (máx. {MAX_SIZE_MB} MB)
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={subiendo}
            />
          </Button>
          {archivo && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              📎 {archivo.name} ({(archivo.size / 1024).toFixed(2)} KB)
            </Typography>
          )}
        </Grid>

        <Grid item size={{xs:12,md:6}}>
          <TextField
            label="O ingresa un enlace (URL)"
            value={linkManual}
            onChange={handleLinkChange}
            fullWidth
            size="small"
            disabled={subiendo}
            InputProps={{
              startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
          />
        </Grid>
      </Grid>

      {subiendo && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">Subiendo archivo...</Typography>
        </Box>
      )}

      {errorLocal && (
        <Alert severity="error" sx={{ mt: 1 }} onClose={() => setErrorLocal(null)}>
          {errorLocal}
        </Alert>
      )}

      {enlace && !subiendo && (
        <Alert severity="success" sx={{ mt: 1 }}>
          Enlace disponible: <a href={enlace} target="_blank" rel="noopener noreferrer">{enlace}</a>
        </Alert>
      )}
    </Paper>
  );
});

export default DriveManager;