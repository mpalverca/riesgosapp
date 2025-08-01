import React from 'react'
import { Grid } from '@mui/material'
export default function riesgos() {
  return (
    <Grid container spacing={1} style={{ height: '100vh' }}>
    <Grid item xs={12} sm={9}>
    </Grid>
    <Grid item xs={12} sm={3}>
      <AddAlert coorX={`${coor.lat.toFixed(6)}`} coorY={`${coor.lng.toFixed(6)}`} />
    </Grid>
  </Grid>
  )
}
