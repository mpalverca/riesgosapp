import React, { useState, } from 'react'
import { MapContainer, TileLayer, GeoJSON, Polyline, } from 'react-leaflet';
import { Typography } from '@mui/material'
import MapViewer from '../components/maps/MapViewer';

export default function Dangermap() {

  return (
    <div style={{ margin: '20px' }} >
      <Typography variant="h4">
        Susceptibilidad
      </Typography>

      <MapViewer/>
    </div>
  )
}
