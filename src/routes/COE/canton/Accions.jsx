import { Grid } from '@mui/material'
import React from 'react'

function Accions() {
  return (
    <Grid container spacing={2} sx={{padding:2}}>
           <Grid item size={{ xs: 12, md: 4 }}>
             aqui van las acciones de respuesta
           </Grid>
           <Grid item size={{ xs: 12, md: 4 }}>
              aqui van las necesidades
           </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              aqui van las solicitudes o requerimeintso
           </Grid>
       </Grid>
  )
}

export default Accions
