import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  IconButton,
  Typography,
  Button,
  Grid,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  MedicalServices as MedicalIcon,
  LocalFireDepartment as FireIcon,
  VolumeUp as MegaphoneIcon,
  FlashlightOn as FlashlightIcon,
  ExitToApp as ExitIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Notifications as AlarmIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import IdentificacionAmenazas from './mapamenaza';

const RecursosContingencia = () => {
  const [recursos, setRecursos] = useState([
    {
      id: 1,
      nombre: 'Botiquín de Primeros Auxilios',
      existencia: true,
      cantidad: 2,
      estado: true,
      icono: <MedicalIcon color="error" />
    },
    {
      id: 2,
      nombre: 'Extintor contra incendios',
      existencia: true,
      cantidad: 1,
      estado: true,
      icono: <FireIcon color="error" />
    },
    {
      id: 3,
      nombre: 'Megáfono',
      existencia: false,
      cantidad: 0,
      estado: false,
      icono: <MegaphoneIcon color="disabled" />
    },
    {
      id: 4,
      nombre: 'Lámparas de Emergencia o Linternas',
      existencia: true,
      cantidad: 3,
      estado: true,
      icono: <FlashlightIcon color="warning" />
    },
    {
      id: 5,
      nombre: 'Vías de Evacuación señalizadas',
      existencia: true,
      cantidad: 4,
      estado: true,
      icono: <ExitIcon color="success" />
    },
    {
      id: 6,
      nombre: 'Puertas de Emergencia funcionales',
      existencia: true,
      cantidad: 2,
      estado: true,
      icono: <ExitIcon color="success" />
    },
    {
      id: 7,
      nombre: 'Señaléticas',
      existencia: true,
      cantidad: 2,
      estado: true,
      icono: <WarningIcon color="warning" />
    },
    {
      id: 8,
      nombre: 'Sistema de alarma/sirena/timbre/campana',
      existencia: true,
      cantidad: 1,
      estado: true,
      icono: <AlarmIcon color="info" />
    },
    {
      id: 9,
      nombre: 'Zonas de Seguridad',
      existencia: true,
      cantidad: 1,
      estado: true,
      icono: <SecurityIcon color="success" />
    }
  ]);

  const [nuevoRecurso, setNuevoRecurso] = useState({
    nombre: '',
    existencia: false,
    cantidad: 0,
    estado: false
  });

  const handleExistenciaChange = (id) => {
    setRecursos(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, existencia: !item.existencia, estado: !item.existencia ? true : item.estado }
          : item
      )
    );
  };

   const handleEstadoChange = (id) => {
    setRecursos(prev =>
      prev.map(item =>
        item.id === id ? { ...item, estado: !item.estado } : item
      )
    );
  };

   const handleCantidadChange = (id, cantidad) => {
    setRecursos(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad: parseInt(cantidad) || 0 } : item
      )
    );
  };

   const handleAddRecurso = () => {
    if (nuevoRecurso.nombre.trim() === '') return;
    
    const iconosDisponibles = [
      <MedicalIcon color="primary" />,
      <FireIcon color="error" />,
      <MegaphoneIcon color="action" />,
      <FlashlightIcon color="warning" />,
      <ExitIcon color="success" />,
      <WarningIcon color="warning" />,
      <AlarmIcon color="info" />,
      <SecurityIcon color="success" />
    ];
    
    const randomIcon = iconosDisponibles[Math.floor(Math.random() * iconosDisponibles.length)];
    
    setRecursos(prev => [
      ...prev,
      {
        id: prev.length + 1,
        nombre: nuevoRecurso.nombre,
        existencia: nuevoRecurso.existencia,
        cantidad: nuevoRecurso.cantidad,
        estado: nuevoRecurso.estado,
        icono: randomIcon
      }
    ]);
    
    setNuevoRecurso({
      nombre: '',
      existencia: false,
      cantidad: 0,
      estado: false
    });
  };

  const handleDeleteRecurso = (id) => {
    setRecursos(prev => prev.filter(item => item.id !== id));
  };

  const handleNuevoRecursoChange = (field, value) => {
    setNuevoRecurso(prev => ({
      ...prev,
      [field]: field === 'nombre' ? value : field === 'cantidad' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <Box sx={{ p: 3, margin: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SecurityIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Inventario de Recursos
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell width="10%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">Icono</Typography>
                </TableCell>
                <TableCell width="40%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">Recursos</Typography>
                </TableCell>
                <TableCell width="15%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">Existencia</Typography>
                </TableCell>
                <TableCell width="15%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">Cantidad</Typography>
                </TableCell>
                <TableCell width="15%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">Estado</Typography>
                </TableCell>
                <TableCell width="5%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">Acción</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recursos.map((recurso) => (
                <TableRow key={recurso.id} hover>
                  <TableCell align="center">
                    {recurso.icono}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{recurso.nombre}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Checkbox
                        checked={recurso.existencia}
                        onChange={() => handleExistenciaChange(recurso.id)}
                        color="primary"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      type="number"
                      value={recurso.cantidad}
                      onChange={(e) => handleCantidadChange(recurso.id, e.target.value)}
                      inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      sx={{ width: 70 }}
                      disabled={!recurso.existencia}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Checkbox
                        checked={recurso.estado}
                        onChange={() => handleEstadoChange(recurso.id)}
                        color="success"
                        disabled={!recurso.existencia}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Eliminar recurso">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteRecurso(recurso.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Agregar nuevo recurso */}
        <Box sx={{ mt: 4, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Agregar Nuevo Recurso
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item  size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Nombre del recurso"
                value={nuevoRecurso.nombre}
                onChange={(e) => handleNuevoRecursoChange('nombre', e.target.value)}
              />
            </Grid>
            <Grid item  size={{ xs: 6, md: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={nuevoRecurso.existencia}
                  onChange={(e) => handleNuevoRecursoChange('existencia', e.target.checked)}
                  color="primary"
                />
                <Typography variant="body2">Existencia</Typography>
              </Box>
            </Grid>
            <Grid item  size={{ xs: 6, md: 1 }}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Cantidad"
                value={nuevoRecurso.cantidad}
                onChange={(e) => handleNuevoRecursoChange('cantidad', e.target.value)}
                inputProps={{ min: 0 }}
                disabled={!nuevoRecurso.existencia}
              />
            </Grid>
            <Grid item  size={{ xs: 12, md: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={nuevoRecurso.estado}
                  onChange={(e) => handleNuevoRecursoChange('estado', e.target.checked)}
                  color="success"
                  disabled={!nuevoRecurso.existencia}
                />
                <Typography variant="body2">Buen estado</Typography>
              </Box>
            </Grid>
            <Grid item  size={{ xs: 12, md: 2 }}>
              <Button
                variant="contained"
                onClick={handleAddRecurso}
                disabled={nuevoRecurso.nombre.trim() === ''}
                startIcon={<AddIcon />}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        {/* Resumen */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Resumen de Recursos
          </Typography>
          <Grid container spacing={2}>
            <Grid item  size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {recursos.filter(r => r.existencia).length}
                </Typography>
                <Typography variant="body2">Recursos disponibles</Typography>
              </Paper>
            </Grid>
            <Grid item  size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success">
                  {recursos.filter(r => r.existencia && r.estado).length}
                </Typography>
                <Typography variant="body2">En buen estado</Typography>
              </Paper>
            </Grid>
            <Grid item  size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="error">
                  {recursos.filter(r => r.existencia && !r.estado).length}
                </Typography>
                <Typography variant="body2">Necesitan mantenimiento</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Paper>
        <IdentificacionAmenazas/>
      </Paper>
    </Box>
  );
};

export default RecursosContingencia;