import React, { useState } from 'react';
import {
  Grid, Card, CardContent, Typography, TextField, Button, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import { Edit, Delete, Add, Image } from '@mui/icons-material';

// --- Datos iniciales de ejemplo (puedes cambiarlos o iniciar vacío) ---
const INITIAL_ITEMS = [
  {
    id: 1,
    detalle: "Construcción sin normas sismorresistentes",
    espacioFisico: "a. Toda la vivienda",
    acciones: "Reforzar estructura con diagonales y pernos.",
    imagen: null
  },
  {
    id: 2,
    detalle: "Cables eléctricos expuestos",
    espacioFisico: "d. Dormitorio, e. Baño",
    acciones: "Instalar canaletas o tubería conduit para protegerlos.",
    imagen: null
  }
];

const ESPACIOS_OPCIONES = [
  "Toda la vivienda", "Comedor", "Sala", "Dormitorio", "Baño", " Cocina", "Retiro frontal", "Retiro posterior", " Planta baja", "Planta alta"
];

const GestionVulnerabilidad = () => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentItem, setCurrentItem] = useState({
    id: null,
    detalle: '',
    espacioFisico: '',
    acciones: '',
    imagen: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Abrir diálogo para agregar
  const handleOpenAdd = () => {
    setDialogMode('add');
    setCurrentItem({ id: null, detalle: '', espacioFisico: '', acciones: '', imagen: null });
    setImagePreview(null);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar
  const handleOpenEdit = (item) => {
    setDialogMode('edit');
    setCurrentItem({ ...item });
    setImagePreview(item.imagen);
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
    setImagePreview(null);
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  // Manejar la carga de la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentItem(prev => ({ ...prev, imagen: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar (Crear o Actualizar)
  const handleSave = () => {
    if (!currentItem.detalle || !currentItem.espacioFisico) {
      alert("Por favor, complete el Detalle y el Espacio Físico.");
      return;
    }

    if (dialogMode === 'add') {
      const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
      setItems([...items, { ...currentItem, id: newId }]);
    } else {
      setItems(items.map(item => item.id === currentItem.id ? currentItem : item));
    }
    handleCloseDialog();
  };

  // Eliminar
  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este elemento?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <Typography variant="h5" component="h2">
              Gestión de Vulnerabilidades
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }} sx={{ textAlign: 'right' }}>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
              Agregar Ítem
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>DETALLE</strong></TableCell>
                <TableCell><strong>ESPACIO FÍSICO</strong></TableCell>
                <TableCell><strong>ACCIONES PARA REDUCIR</strong></TableCell>
                <TableCell><strong>IMAGEN</strong></TableCell>
                <TableCell><strong>ACCIONES</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.detalle}</TableCell>
                  <TableCell>{item.espacioFisico}</TableCell>
                  <TableCell>{item.acciones || "—"}</TableCell>
                  <TableCell>
                    {item.imagen ? (
                      <img src={item.imagen} alt="Evidencia" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                    ) : (
                      <Image color="disabled" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenEdit(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No hay elementos registrados.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Diálogo para Agregar/Editar */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{dialogMode === 'add' ? 'Agregar Nueva Vulnerabilidad' : 'Editar Vulnerabilidad'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Detalle *"
                  name="detalle"
                  value={currentItem?.detalle || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  required
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Espacio Físico *</InputLabel>
                  <Select
                    name="espacioFisico"
                    value={currentItem?.espacioFisico || ''}
                    onChange={handleInputChange}
                    label="Espacio Físico *"
                  >
                    {ESPACIOS_OPCIONES.map(op => (
                      <MenuItem key={op} value={op}>{op}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Acciones para Reducir la Vulnerabilidad"
                  name="acciones"
                  value={currentItem?.acciones || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <Button variant="outlined" component="label" startIcon={<Image />}>
                  Subir Imagen
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {imagePreview && (
                  <Box mt={1}>
                    <img src={imagePreview} alt="Previsualización" style={{ maxWidth: '100%', maxHeight: 300 }} />
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GestionVulnerabilidad;