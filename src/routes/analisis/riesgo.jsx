import React, { useState } from "react";
import { Grid } from "@mui/material";
//import SectorMap from "../../components/riesgos/mapsview";
//import CatastroMap from "../../components/riesgos/panel";
import loadIcon from "../../assets/loading.gif";
import GeoDataViewer from "../../components/riesgos/GeoDataViewer.js";
import GeoMap from "../../components/riesgos/viewmap";
import {
  useApConst,
  useClaveData,
  useSector,
} from "../../components/riesgos/useGeoData.js";

import "./App.css";
import TableView, { ViewPredio } from "../../components/riesgos/tableview.jsx";
//import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";
import BasicTabs from "../../components/riesgos/tapsR.jsx";

function RiesgosPage() {
  const [selectedParroquia, setSelectedParroquia] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [clave, setClaveCatas] = useState("");

  const { data, loading, error } = useApConst(
    selectedParroquia,
    selectedSector
  );

  const { claveData, claveL, claveE } = useClaveData(
    selectedParroquia,
    selectedSector,
    clave
  );
  const { sectorData, sectorL } = useSector("", selectedSector);

  // Debug para ver los valores

  /* console.log("🔄 App State PIT Urbano:", {
    selectedParroquia,
    selectedSector,
    data: claveData
      ? `✅ Data loaded with ${claveData.features?.length} features`
      : "❌ No data",
    claveL,
    claveE,
  }); */
  // ✅ Verificar que los datos existan antes de acceder a features
  const handleSearch = (parroquia, sector = "") => {
    setSelectedParroquia(parroquia);
    setSelectedSector(sector);
  };
  const handleSector = (parroquia, sector = "") => {
    setSelectedParroquia(parroquia);
    setSelectedSector(sector);
  };
  const handleClave = (parroquia, sector = "", clave) => {
    setSelectedParroquia(parroquia);
    setSelectedSector(sector);
    setClaveCatas(clave);
  };
  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid
          item
          size={{ xs: 12, md: 3 }}
          style={{ height: "80vh", overflowY: "auto" }}
        >
          <GeoDataViewer
            onSearch={handleSearch}
            onSearchSector={handleSector}
            onSearchPugs={handleClave}
          />
          {error && (
            <div className="error-state">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}
        </Grid>
        <Grid item size={{ xs: 12, md: 9 }}>
          {sectorL && loading && claveL && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando datos para {selectedParroquia}...</p>
              <img
                src={loadIcon}
                alt="Icono de alerta"
                style={{
                  alignContent: "center",
                  alignItems: "center",
                }}
              />
            </div>
          )}
          {data && (
            <>
              <div className="map-section">
                <GeoMap
                  geoData={data}
                  sector={sectorData}
                  predio={claveData.features.filter(
                    (predio) => predio.properties.clave_cata === clave
                  )}
                 
                />
              </div>
            </>
          )}
          {/* TABLA DE RESUMEN */}
          <BasicTabs
            tabsOne={data && <TableView data={data} />}
            tabsTwo={
              data &&
              claveData && (
                <ViewPredio
                  data={data}
                  predio={claveData.features.filter(
                    (predio) => predio.properties.clave_cata === clave
                  )}
                />
              )
            }
          />
          {!data && !loading && !error && (
            <div className="empty-state">
              <p>Selecciona una parroquia para cargar los datos</p>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default RiesgosPage;
