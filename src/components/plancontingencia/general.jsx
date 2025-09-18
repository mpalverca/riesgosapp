import React from 'react'
import {
  
  TextField,
  Grid,
 
  MenuItem
} from '@mui/material';

export default function General({formData,handleChange}) {
  return (
    <div>
         <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
              <TextField
                required
                name="nombreEvento"
                label="Nombre del Evento"
                fullWidth
                value={formData.nombreEvento}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="organizador"
                label="Organizador del Evento"
                fullWidth
                value={formData.organizador}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="empresaSeguridad"
                label="Empresa de Seguridad"
                fullWidth
                value={formData.empresaSeguridad}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="representanteLegal"
                label="Representante Legal"
                fullWidth
                value={formData.representanteLegal}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                name="fecha"
                label="Fecha"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.fecha}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                name="horaInicio"
                label="Hora Inicio"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.horaInicio}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                name="horaFin"
                label="Hora Fin"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.horaFin}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                name="sector"
                label="Sector (Barrio)"
                fullWidth
                value={formData.sector}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                name="parroquia"
                label="Parroquia"
                fullWidth
                value={formData.parroquia}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                name="lugar"
                label="Lugar"
                fullWidth
                value={formData.lugar}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                select
                name="tipoLugar"
                label="Tipo de Lugar"
                fullWidth
                value={formData.tipoLugar}
                onChange={handleChange}
              >
                <MenuItem value="casaComunal">Casa Comunal</MenuItem>
                <MenuItem value="areaComunal">Área Comunal</MenuItem>
                <MenuItem value="viaPublica">Uso de la Vía Pública</MenuItem>
                <MenuItem value="coliseo">Coliseo</MenuItem>
                <MenuItem value="areaDeportiva">Área Deportiva</MenuItem>
                <MenuItem value="parque">Parque</MenuItem>
                <MenuItem value="infraestructuraMovil">Infraestructura Móvil</MenuItem>
                <MenuItem value="plaza">Plaza</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </TextField>
            </Grid>
          </Grid>
    </div>
  )
}
