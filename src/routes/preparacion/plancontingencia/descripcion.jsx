
import { TextField, Grid, Box, Paper } from "@mui/material";

export default function Descripcion({ formData, handleChange,handleInputChange }) {
  return (
     <Box sx={{ p: 2,  }}>
     <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
     <TextField
                required
                name="descripcionEvento"
                label="Descripción del Evento"
                multiline
                maxRows={10}
                rows={5}
                
                fullWidth
                value={formData.descripcionEvento}
                onChange={handleChange}
               // style={Padding='20px'}
               margin='dense'               
              />

     <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }} >
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
            <Grid size={{ xs: 12, md: 3 }}>
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
            <Grid item size={{ xs: 12, md: 3 }}>
              <TextField
                name="aforoVenta"
                label="Aforo (Venta)"
                type="number"
                fullWidth
                value={formData.aforoVenta}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 3 }}>
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
          <Grid container spacing={3} sx={{my:2}}>
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
   </Paper></Box>
  );
}
