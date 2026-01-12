import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { AlertText } from "../../panels/Panels";

export default function InfoBase({ formData, handleInputChange }) {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5" gutterBottom>
        Información Básica
      </Typography>
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 5 }}>
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
        <Grid item size={{ xs: 12, md: 4 }}>
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
        <Grid item size={{ xs: 12, md: 3 }}>
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
      <AlertText
        text={
          <Box>
            ⚠️ <strong>Advertencia:</strong> Recuerda que aforo se indica la necesidad de contar con seguridad,durante el evento
          </Box>
        }
      />
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            name="empresaSeguridad"
            label="Empresa de Seguridad"
            value={formData.empresaSeguridad}
            onChange={handleInputChange}
            placeholder="Ingrese empresa de seguridad"
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            name="representanteLegal"
            label="Representante Legal de la empresa de seguridad"
            value={formData.representanteLegal}
            onChange={handleInputChange}
            placeholder="Ingrese nombre del representante legal"
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            name="representanteLegal"
            label="Identificación  del representante Legal de la empresa de seguridad"
            value={formData.representanteLegal}
            onChange={handleInputChange}
            placeholder="Ingrese nombre del representante legal"
          />
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 4 }}>
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
        <Grid item size={{ xs: 12, md: 4 }}>
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
        <Grid item size={{ xs: 12, md: 4 }}>
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
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 4 }}>
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
        <Grid item size={{ xs: 12, md: 4 }}>
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
        <Grid item size={{ xs: 12, md: 4 }}>
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
        <TextField
          fullWidth
          required
          name="des_ub"
          label="Descripción del Evento"
          value={formData.parroquia}
          onChange={handleInputChange}
          placeholder="Descripción del Evento"
        />
      </Grid>
    </Paper>
  );
}

export const SpaceData = ({ formData, handleInputChange }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5" gutterBottom>
        Información del Lugar
      </Typography>
      <Grid container spacing={3} padding={1}>
        <Grid item size={{ xs: 12, sm: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Espacio
          </Typography>
        </Grid>
        <Grid item size={{ xs: 12, sm: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="privado"
                checked={formData.espacio.privado}
                onChange={handleInputChange}
              />
            }
            label={
              <ListItemText
                primary="Privado"
                security="Son todos los espacios privados "
              />
            }
          />{" "}
        </Grid>
        <Grid item size={{ xs: 12, sm: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="publico"
                checked={formData.espacio.publico}
                onChange={handleInputChange}
              />
            }
            label={
              <ListItemText
                primary="Público"
                security="Son todos los espacios de uso públicos o comunitario"
              />
            }
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
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
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
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
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
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
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
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
            <TextField
              fullWidth
              name="otroEspacio"
              label="Especifique otro tipo de espacio"
              value={formData.otroEspacio}
              onChange={handleInputChange}
              placeholder="Especifique el tipo de espacio"
            />
        )}
      </Grid>
    </Paper>
  );
};
