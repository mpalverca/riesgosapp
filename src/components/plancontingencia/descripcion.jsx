import React from 'react';
import { TextField, Grid, MenuItem } from "@mui/material";
export default function Descripcion({ formData, handleChange }) {
  return (
    <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                name="descripcionEvento"
                label="Descripción del Evento"
                multiline
                rows={4}
                fullWidth
                value={formData.descripcionEvento}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                name="aforoPermitido"
                label="Aforo Total Permitido"
                type="number"
                fullWidth
                value={formData.aforoPermitido}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                name="aforoDiaEvento"
                label="Aforo (Día del Evento)"
                type="number"
                fullWidth
                value={formData.aforoDiaEvento}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="aforoVenta"
                label="Aforo (Venta)"
                type="number"
                fullWidth
                value={formData.aforoVenta}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="responsableControl"
                label="Responsable del Control"
                fullWidth
                value={formData.responsableControl}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
  );
}
