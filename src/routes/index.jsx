import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Alerts from "./alerts";

//Geojson

import NotFoud from "./NotFoud";
import NavBar from "../components/Navbar/NavBar";
import Dangermap from "./Dangermap";
import Planesatender from "./preparacion/PlanFamiliar";
import PlanContingencia from "./preparacion/PlanContingencia";
import Coe from "./coe";
import Geologia from "./analisis/geologia";
import Cooper from "./cooper";
import EVIN from "./EVIN";
import Auth from "./user/auth";
import Login from "./login/login";
import SingIn from "./login/singin";
import ProtectedRoute from "./ProtectedRoute";
import Preparacion from "./preparacion/preparacion";
import Analisis from "./analisis/analisis";
import FireCamp from "./analisis/fire_camp";
import SectorMap from "./analisis/riesgo";

export default class index extends Component {
  render() {
    return (
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route
            path="/riesgosapp"
            element={
              <ProtectedRoute>
                <Home />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/riesgosapp/inicio" element={<Home />} />

          <Route path="/riesgosapp/analisis/*" element={<Analisis />}>
            <Route path="alertmap" element={<Alerts />} />
            <Route path="threatmap" element={<Dangermap />} />
            <Route path="geologia" element={<Geologia />} />
            <Route path="fire_camp" element={<FireCamp/>}/>
           <Route path="risk" element={<SectorMap/>}/>
                    </Route>

          <Route path="/riesgosapp/preparacion/*" element={<Preparacion />}>
            <Route path="plancontingencia" element={<PlanContingencia />} />
          </Route>
          <Route path="/riesgosapp/Cooper" element={<Cooper />} />
          <Route path="/riesgosapp/Evin" element={<EVIN />} />
          <Route path="*" element={<NotFoud />} />
          <Route path="/planContingencia" element={<PlanContingencia />} />
          <Route path="/riesgosapp/coe" element={<Coe />} />
          {/*    //auth*/}

          <Route path="/riesgosapp/userauth" element={<Login />} />
          <Route path="/riesgosapp/userSettings" element={<Auth />} />
          <Route path="/riesgosapp/auth" element={<Coe />} />
          <Route path="/riesgosapp/usersignin" element={<SingIn />} />
          <Route path="/riesgosapp/auth" element={<Coe />} />
        </Routes>
      </BrowserRouter>
    );
  }
}