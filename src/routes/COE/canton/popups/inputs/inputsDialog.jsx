import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Box, Typography, IconButton,
  TextField, Paper, Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Image as ImageIcon,
  Description as FileIcon
} from '@mui/icons-material';

import { styled } from "@mui/material/styles";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ImageUploadDialog = ({ openDialog, setOpenDialog, typeInput }) => {
  const [files, setFiles] = useState([]);
console.log(files)
  // Función para crear URLs de preview
  const createPreviewURL = (file) => {
    return URL.createObjectURL(file);
  };

  // Función para eliminar una imagen
  const handleRemoveImage = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Función para actualizar el detalle de una imagen
  const handleDetailChange = (index, detail) => {
    setFiles(prevFiles => 
      prevFiles.map((item, i) => 
        i === index ? { ...item, detail } : item
      )
    );
  };

  // Limpiar URLs cuando el componente se desmonte
  useEffect(() => {
    return () => {
      files.forEach(item => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [files]);

  // Modificar la función setFiles para incluir preview
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map(file => ({
      file: file,
      detail: "",
      preview: URL.createObjectURL(file)
    }));
    setFiles([...files, ...newFiles]);
  };

  return (
    <Dialog
      onClose={() => setOpenDialog(false)}
      open={openDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Agregar imágenes {typeInput}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Selecciona y agrega fotos para agregar a {typeInput}
        </DialogContentText>
        
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          fullWidth
          sx={{ mb: 2 }}
        >
          Añadir Fotos
          <VisuallyHiddenInput
            type="file"
            accept="image/*" // Solo imágenes
            onChange={handleFileChange}
            multiple
          />
        </Button>

        {/* Box con scroll para las imágenes */}
        <Box sx={{ 
          height: "60vh", 
          overflowY: "auto",
          border: '1px dashed #ccc',
          borderRadius: 1,
          p: 2
        }}>
          {files.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: '#999'
            }}>
              <ImageIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography>No hay imágenes seleccionadas</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {files.map((item, index) => (
                <Grid item size={{ xs: 12}} key={index}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      {/* Preview de la imagen */}
                      <Grid item size={{ xs: 12, sm: 4}}>
                        <Box
                          component="img"
                          src={item.preview || createPreviewURL(item.file)}
                          alt={item.file.name}
                          sx={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #eee'
                          }}
                        />
                      </Grid>
                      
                      {/* Detalles de la imagen */}
                      <Grid item size={{ xs: 12, sm: 8}}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              {item.file.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                              Tamaño: {(item.file.size / 1024).toFixed(2)} KB
                            </Typography>
                            
                            {/* Campo de detalle para cada imagen */}
                            <TextField
                              fullWidth
                              size="small"
                              label="Detalle / Descripción"
                              value={item.detail || ''}
                              onChange={(e) => handleDetailChange(index, e.target.value)}
                              sx={{ mt: 1 }}
                            />
                          </Box>
                          
                          {/* Botón eliminar */}
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveImage(index)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button 
          variant="contained" 
          color="primary"
          disabled={files.length === 0}
        >
          Guardar Registro ({files.length} {files.length === 1 ? 'imagen' : 'imágenes'})
        </Button>
        <Button onClick={() => {
            setOpenDialog(false);
            setFiles([])
            }}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploadDialog;