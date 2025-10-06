import React,{useState} from 'react';
import { Grid } from "@mui/material";
import SectorMap from "../../components/riesgos/mapsview";
import CatastroMap from "../../components/riesgos/panel";

import GeoDataViewer from '../../utils/GeoDataViewer';
import GeoMap from '../../components/riesgos/viewmap';
import { geoApiService } from '../../utils/geoservice';
import  {useGeoData} from '../../utils/useGeoData.js';

import './App.css';

const RiesgosPage = () => {
    const [selectedParroquia, setSelectedParroquia] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  
  const { data, loading, error } = useGeoData(selectedParroquia, selectedSector);
  return (
    <div style={{ margin: "10px" }}>
      <Grid container spacing={2}>
       {/*  <Grid
          item
          size={{ xs: 12, md: 3 }}
          style={{ height: "80vh", overflowY: "auto" }}
        >
          <CatastroMap/>
        </Grid> */}
        <Grid item size={{ xs: 12, md: 12 }}>
       {/*   <SectorMap/> */}
       <div className="App">
      <header className="App-header">
        <h1>Sistema de Consulta Geoespacial</h1>
      </header>
      
      <main>
        <GeoDataViewer
          onParroquiaChange={setSelectedParroquia}
          onSectorChange={setSelectedSector}
        />
        
        {data && (
          <div className="map-section">
            <h2>Visualización en Mapa</h2>
            <GeoMap geoData={data} />
          </div>
        )}
      </main>
    </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default RiesgosPage;
