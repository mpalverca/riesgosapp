import React from 'react'
import Panels from '../../components/panels/Panels'
import { Grid } from '@mui/material'
import MapMark from '../../components/maps/mapaView'

function BodyCOE() {
  return (
    <Grid container spacing={2} sx={{padding:2}}>
        <Grid item size={{ xs: 12, md: 3 }}>
            <Panels
            title={"Mesa Tecnica de trabajo  MTT1"}
            />
        </Grid>
        <Grid item size={{ xs: 12, md: 9 }}>
            <MapMark
            position={[-3.9965787520553717, -79.20168563157956]}
            zoom={10}
            
            />
        </Grid>
    </Grid>
  )
}

export default BodyCOE
