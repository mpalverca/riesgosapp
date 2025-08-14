import React, { Component } from 'react'
import { Typography } from '@mui/material'
import alertMap from '../components/alerts/alermaps';
import MapAfects from '../components/afects/afects';

export default class Alerts extends Component {
  
  render() {
    return (
     <div style={{ margin: '20px' }} >
      <Typography variant="h4">
        Afectaciones a Nivel cantonal
      </Typography>
      <MapAfects/>
      <alertMap/>
    </div>
  
    )
  }
}
