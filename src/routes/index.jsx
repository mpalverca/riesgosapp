import React, { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Alerts from './alerts'

//Geojson

import NotFoud from './NotFoud';
import NavBar from '../components/Navbar/NavBar';
import Dangermap from './Dangermap';
import PlanFamiliar from './PlanFamiliar';
import PlanContingencia from './PlanContingencia';
import Coe from './coe';
import Geologia from './geologia';
import Cooper from './cooper';
import EVIN from './EVIN'

export default class index extends Component {
  render() {
    return (
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/riesgosapp' element={<Home />} />
          <Route path='/riesgosapp/inicio' element={<Home />} />
          <Route path='/riesgosapp/alertmap' element={<Alerts />} />
          <Route path='/riesgosapp/riesgosmapa' element={<Dangermap />} />
          <Route path='/riesgosapp/geologia' element={<Geologia />} />
          <Route path='/riesgosapp/planfamiliar' element={<PlanFamiliar />} />
          <Route path='/riesgosapp/Cooper' element={<Cooper />} />
          <Route path='/riesgosapp/Evin' element={<EVIN/>} />
          <Route path='*' element={<NotFoud />} />
          <Route path='/planContingencia' element={<PlanContingencia />} />
          <Route path='/riesgosapp/coe' element={<Coe />} />
        </Routes>
      </BrowserRouter>
    )
  }
}
