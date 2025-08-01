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

export default class index extends Component {
  render() {
    return (
      <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}  />
        <Route path='/alertmap' element={<Alerts/>} />
        <Route path='/riesgosmapa' element={<Dangermap/> }  />
        <Route path='/planfamiliar' element={<PlanFamiliar/>} />
        <Route path='*' element={<NotFoud/>} />
        <Route path='/planContingencia' element={<PlanContingencia/>}/>
        <Route path='/coe' element={<Coe/>}/>
      </Routes>
      </BrowserRouter>
    )
  }
}
