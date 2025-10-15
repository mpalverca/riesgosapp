import React, { useState } from "react";
import { Grid } from "@mui/material";
//import SectorMap from "../../components/riesgos/mapsview";
//import CatastroMap from "../../components/riesgos/panel";
import loadIcon from "../../assets/loading.gif";
import GeoDataViewer from "../../components/riesgos/GeoDataViewer.js";
import GeoMap from "../../components/riesgos/viewmap";
import {
  useAASS,
  useApConst,
  useClaveData,
  useSector,
  useVial,
} from "../../components/riesgos/useGeoData.js";

import "./App.css";
import TableView, { ViewPredio } from "../../components/riesgos/tableview.jsx";
//import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";
import BasicTabs from "../../components/riesgos/tapsR.jsx";

function RiesgosPage() {
  const [selectedParroquia, setSelectedParroquia] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [clave, setClaveCatas] = useState("");
  const [selectedDataType, setSelectedDataType] = useState("aptconst"); //seleccionar estado

  const { aptcData, aptcL, aptcE } = useApConst(
    selectedDataType === "aptconst" ? selectedParroquia : "",
    selectedDataType === "aptconst" ? selectedSector : ""
  );
 const { aassData, aassL, aassE } = useAASS(
    selectedDataType === "aass" ? selectedParroquia : "",
    selectedDataType === "aass" ? selectedSector : ""
  );
   const { vialData, vialL, vialE } = useVial(
    selectedDataType === "vialidad" ? selectedParroquia : "",
    selectedDataType === "vialidad" ? selectedSector : ""
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

  // Función para obtener los datos activos según el tipo seleccionado
  const getActiveData = () => {
    switch (selectedDataType) {
      case "aptconst":
        return { data: aptcData, loading: aptcL, error: aptcE };
      case "aass":
           return { data: aassData, loading: aassL, error: aassE };
        case "vialidad":
           return { data: vialData, loading: vialL, error: vialE };
        default:
        return { data: aptcData, loading: aptcL, error: aptcE };
    }
  };

  const activeData = getActiveData();

  // Debug para ver los valores
  console.log("🔄 App State:", {
    selectedDataType,
    selectedParroquia,
    selectedSector,
    data: activeData.data
      ? `✅ ${selectedDataType} data loaded with ${activeData.data.features?.length} features`
      : "❌ No data",
    loading: activeData.loading,
    error: activeData.error,
    vew:activeData
  });

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

  // Nueva función para manejar cambio de tipo de datos
  const handleDataTypeChange = (dataType) => {
    setSelectedDataType(dataType);
    // Limpiar datos anteriores si es necesario
    setSelectedParroquia("");
    setSelectedSector("");
    setClaveCatas("");
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
            onDataTypeChange={handleDataTypeChange}
            selectedDataType={selectedDataType}
          />
          {aptcE && (
            <div className="error-state">
              <h3>Error</h3>
              <p>{aptcE}</p>
            </div>
          )}
          {activeData.error && (
            <div className="error-state">
              <h3>Error</h3>
              <p>{activeData.error}</p>
            </div>
          )}
        </Grid>
        <Grid item size={{ xs: 12, md: 9 }}>
          {sectorL && aptcL && claveL && (
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
          {aptcData && (
            <>
              <div className="map-section">
                <GeoMap
                  geoData={aptcData}
                  sector={sectorData}
                  predio={claveData.features}
                  clave={clave}
                />
              </div>
            </>
          )}
          {/* TABLA DE RESUMEN */}
          <BasicTabs
            tabsOne={activeData.data && <TableView data={activeData.data} />}
            tabsTwo={
              activeData.data &&
              claveData && (
                <ViewPredio
                  data={activeData.data}
                  predio={claveData.features.filter(
                    (predio) => predio.properties.clave_cata === clave
                  )}
                />
              )
            }
          />
          {!aptcData && !aptcL && !aptcE && (
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
