import React, { useState } from "react";
import { Grid } from "@mui/material";
import SectorMap from "../../components/riesgos/mapsview";
import CatastroMap from "../../components/riesgos/panel";
import loadIcon from "../../assets/loading.gif";
import GeoDataViewer from "../../components/riesgos/GeoDataViewer.js";
import GeoMap from "../../components/riesgos/viewmap";
import {
  useApConst,
  useClaveData,
  useSector,
} from "../../components/riesgos/useGeoData.js";

import "./App.css";
import TableView from "../../components/riesgos/tableview.jsx";
import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";

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
  const { sectorData, sectorL, sectorE } = useSector("", selectedSector);

  // Debug para ver los valores

  console.log("🔄 App State PIT Urbano:", {
    selectedParroquia,
    selectedSector,
    data: claveData
      ? `✅ Data loaded with ${claveData.features?.length} features`
      : "❌ No data",
    claveL,
    claveE,
    detail:claveData
    ?typeof claveData.features[0].properties.clave_cata ==='string'
    ? 'Es un string':"no es string"
    :"❌ No data",
    
  });

  // ✅ Verificar que los datos existan antes de acceder a features

  const handleSearch = (parroquia, sector = "") => {
    //console.log("🎯 Handle Search called:", { parroquia, sector });
    setSelectedParroquia(parroquia);
    setSelectedSector(sector);
  };
  const handleSector = (parroquia, sector = "") => {
    //console.log("🎯 Handle Search called:", { parroquia, sector });
    setSelectedParroquia(parroquia);
    setSelectedSector(sector);
  };
  const handlePugs = (parroquia, sector = "", clave) => {
    //console.log("🎯 Handle Search called:", { parroquia, sector });
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
          {/* <header className="App-header">
        <h1>Sistema de Consulta Geoespacial data</h1>
      </header> */}
          {/* ✅ Pasar onSearch como prop */}
          <GeoDataViewer
            onSearch={handleSearch}
            onSearchSector={handleSector}
            onSearchPugs={handlePugs}
          />
          {error && (
            <div className="error-state">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}
        </Grid>
        <Grid item size={{ xs: 12, md: 9 }}>
          {sectorL && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando datos para {selectedParroquia}...</p>
              <img
                src={loadIcon}
                alt="Icono de alerta"
                style={{
                  // width: "60px",
                  //height: "120px",
                  //borderRadius: "4px",
                  objectFit: "cover",
                  alignContent: "center",
                  alignItems: "center",
                }}
              />
            </div>
          )}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando datos para {selectedParroquia}...</p>
              <img
                src={loadIcon}
                alt="Icono de alerta"
                style={{
                  // width: "60px",
                  //height: "120px",
                  //borderRadius: "4px",
                  objectFit: "cover",
                  alignContent: "center",
                  alignItems: "center",
                }}
              />
            </div>
          )}
          {data && (
            <>
              {/* <div className="results-header">
              <h2>Resultados para: {selectedParroquia}</h2>
              {selectedSector && <p>Sector: {selectedSector}</p>}
              <p>Total de elementos: {data.metadata?.total_features || 0}</p>
            </div> */}

              <div className="map-section">
                {/* <h3>Visualización en Mapa</h3> */}
                <GeoMap geoData={data} sector={sectorData} predio={claveData} />
              </div>

              {/* <div className="data-preview">
              <h3>Vista Previa de Datos</h3>
              <div className="features-count">
                <strong>Features encontrados:</strong>{" "}
                {data.features?.length || 0}
              </div>

              {data.features &&
                data.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="feature-preview">
                    <h4>Feature {index + 1}</h4>
                    <pre>{JSON.stringify(feature.properties, null, 2)}</pre>
                  </div>
                ))}

              {data.features && data.features.length > 3 && (
                <p>... y {data.features.length - 3} features más</p>
              )}
            </div> */}
            </>
          )}
          {/* TABLA DE RESUMEN */}
          {data && <TableView data={data} />}
          {!data && !loading && !error && (
            <div className="empty-state">
              <p>Selecciona una parroquia para cargar los datos</p>
            </div>
          )}
          {/* <SectorMap/> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default RiesgosPage;
