import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import GeoDataViewer from "./riesgos/GeoDataViewer.js";
import { PolylineMap } from "./riesgos/viewmap";
import {
  useAASS,
  useApConst,
  useClaveData,
  useSector,
  useVial,
} from "./riesgos/useGeoData.js";
import "./App.css";
import TableView, { ViewPredio } from "./riesgos/tableview.jsx";
import BasicTabs from "./riesgos/tapsR.jsx";
//import Vias from "../../components/riesgos/vial/vias.jsx";
function RiesgosPage() {
  const [selectedParroquia, setSelectedParroquia] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [clave, setClaveCatas] = useState("");
  const [selectedDataType, setSelectedDataType] = useState("sector");
  const [controlCheck, setControlCheck] = useState([true, false]);
  // Estados para controlar la transición
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousData, setPreviousData] = useState(null);
  // Hooks para cada tipo de datos - ahora siempre activos pero con parámetros condicionales
  const { aptcData, aptcL, aptcE } = useApConst(
    selectedDataType === "aptconst" ? selectedParroquia : "",
    selectedDataType === "aptconst" ? selectedSector : "",
  );
  const { aassData, aassL, aassE } = useAASS(
    selectedDataType === "aass" ? selectedParroquia : "",
    selectedDataType === "aass" ? selectedSector : "",
  );
  const { vialData, vialL, vialE } = useVial(
    selectedDataType === "vialidad" ? selectedParroquia : "",
    selectedDataType === "vialidad" ? selectedSector : "",
  );
  const { claveData, claveL, claveE } = useClaveData(
    selectedParroquia,
    selectedSector,
    clave,
  );
  const { sectorData, sectorL } = useSector("", selectedSector);
  // Función para obtener los datos activos
  const getActiveData = () => {
    switch (selectedDataType) {
      case "aptconst":
        return {
          data: aptcData,
          loading: aptcL,
          error: aptcE,
          type: "aptconst",
        };
      case "aass":
        return {
          data: aassData,
          loading: aassL,
          error: aassE,
          type: "aass",
        };
      case "vialidad":
        return {
          data: vialData,
          loading: vialL,
          error: vialE,
          type: "vialidad",
        };
      case "sector":
        return {
          data: sectorData,
          loading: sectorL,
          error: null,
          type: "sector",
        };
      default:
        return {
          data: null,
          loading: false,
          error: null,
          type: selectedDataType,
        };
    }
  };

  const activeData = getActiveData();

  // Efecto para manejar transiciones suaves
  useEffect(() => {
    if (activeData.data && !activeData.loading && !isTransitioning) {
      setPreviousData(activeData);
    }
  }, [activeData.data, activeData.loading, isTransitioning]);

  const handleDataTypeChange = (dataType) => {
    // Iniciar transición
    setIsTransitioning(true);

    // Cambiar tipo de datos inmediatamente
    setSelectedDataType(dataType);

    // NO limpiar filtros automáticamente - mantener los filtros actuales
    // El usuario puede decidir si quiere cambiar los filtros después

    // Finalizar transición después de un breve delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Función para limpiar filtros si el usuario lo desea
  const handleClearFilters = () => {
    setSelectedParroquia("");
    setSelectedSector("");
    setClaveCatas("");
  };

  // Debug para ver los valores
  console.log("🔄 App State:", {
    selectedDataType,
    selectedParroquia,
    selectedSector,
    data: activeData.data
      ? `✅ ${selectedDataType} data loaded with ${
          activeData.data.features?.length || 0
        } features`
      : "❌ No data",
    loading: activeData.loading,
    error: activeData.error,
    transitioning: isTransitioning,
    view: activeData.data,
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

  // Datos a mostrar - durante transición mostrar previousData, sino activeData
  const displayData =
    isTransitioning && previousData ? previousData : activeData;

  // Función para obtener datos seguros (evita null)
  const getSafeSectorData = () => {
    return sectorData || { features: [] };
  };

  const getSafePredioData = () => {
    return claveData?.features || [];
  };
  //checkbock controller

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
            onClearFilters={handleClearFilters} // Nueva prop para limpiar filtros
            selectedDataType={selectedDataType}
            selectedParroquia={selectedParroquia}
            selectedSector={selectedSector}
            checked={controlCheck}
            setChecked={setControlCheck}
          />
          {displayData.error && (
            <div className="error-state">
              <h3>Error</h3>
              <p>{displayData.error}</p>
            </div>
          )}
        </Grid>
        <Grid item size={{ xs: 12, md: 9 }}>
          {/* {displayData.loading ||
            (claveL && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando datos {selectedDataType}...</p>
                <img
                  src={loadIcon}
                  alt="Icono de alerta"
                  style={{
                    alignContent: "center",
                    alignItems: "center",
                  }}
                />
              </div>
            ))} */}

          {/* selectedDataType === "sector" ? (
            <SectorMap
              sector={getSafeSectorData()}
              predio={getSafePredioData()}
              clave={clave}
            />
          ) : selectedDataType === "vialidad" ? (
            displayData.data && (
              <>
                <div className="map-section">
                  <PolylineMap
                    geoData={displayData.data}
                    sector={getSafeSectorData()}
                    predio={getSafePredioData()}
                    type={selectedDataType}
                    clave={clave}
                  />
                </div>
              </>
            )
          ) : displayData.data && (
              <>
                <div className="map-section">
                  <PoligonMap
                    geoData={displayData.data}
                    sector={getSafeSectorData()}
                    predio={getSafePredioData()}
                    type={selectedDataType}
                    clave={clave}
                  />
                </div>
              </>
            )
          */}
          <BasicTabs
            tabsOne={{
              title: "Mapa de Predio Sector",
              body: (
                <>
                  <div className="map-section">
                    <PolylineMap
                      geoData={displayData.data}
                      loading={displayData.loading}
                      sector={getSafeSectorData()}
                      predio={getSafePredioData()}
                      type={selectedDataType}
                      clave={clave}
                      capa={controlCheck}
                    />
                    <BasicTabs
                      tabsOne={{
                        title: "Información Sector",
                        body:
                          displayData.data &&
                          (selectedDataType == "vialidad" ? (
                            <div>Ver data from </div>
                          ) : (
                            <TableView data={displayData.data} />
                          )),
                      }}
                      tabsTwo={{
                        title: "Información Predio",
                        body: displayData.data && claveData && (
                          <ViewPredio
                            data={displayData.data}
                            predio={claveData.features.filter(
                              (predio) =>
                                predio.properties.clave_cata === clave,
                            )}
                          />
                        ),
                      }}
                    />
                  </div>
                </>
              ),
            }}
            tabsTwo={{
              title: "Detalle de predio",
              body: claveData && (
                <div>
                  <Typography variant="h6">General</Typography>
                  <Typography variant="body1">
                    determinar el nivel de riesgos es accionar parte{" "}
                  </Typography>
                  <Accordion>
                    <AccordionSummary
                      /* expandIcon={<ExpandMoreIcon/>} */
                      aria-controls="panel1a-content"
                    >
                      <Typography variant="h6">Vulnerabilidad </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        la suscptibilidad del predio indica los niveles de
                        riesgo asociados a factores como la topografía, el tipo
                        de suelo, la proximidad a cuerpos de agua, entre otros.
                        Un predio con alta susceptibilidad puede ser más
                        vulnerable a deslizamientos, inundaciones u otros
                        eventos naturales, lo que implica que se deben tomar
                        medidas preventivas adicionales para mitigar estos
                        riesgos.
                        
                      </Typography>
<Divider/>
                      <Typography> Vulnerailidad Fisica </Typography>
                      <Typography variant="body2">
                        {" "}
                        Está relacionada con la calidad o tipo de material uti
                        lizado y el tipo de construcción de las viviendas, esta
                        blecimientos económicos (comerciales e industriales) y
                        de servicios (salud, educación, instituciones públicas),
                        e infra estructura socioeconómica (centrales
                        hidroeléctricas, vías, puentes y sistemas de riesgo),
                        para asimilar los efectos de los fenómenos que
                        constituyen una amenaza. Otro aspecto importante es la
                        calidad del suelo y el lugar donde se encuentran los
                        centros poblados, cerca de fallas geológicas, laderas de
                        cerros, riberas de ríos, áreas 32 costeras; situación
                        que incrementa significativamente su nivel de
                        vulnerabilidad. En el plan departamental de gestión del
                        riesgo será de terminado el nivel de vulnerabilidad
                        física únicamente para la infraestructura vital
                        departamental (vías, puentes, hospitales, estaciones de
                        bomberos, estaciones de policía, entre otros)
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              ),
            }}
          />
          {/* TABLA DE RESUMEN */}
          {!displayData.data &&
            !displayData.loading &&
            selectedDataType !== "sector" && (
              <div className="empty-state">
                <p>
                  {selectedParroquia
                    ? `No hay datos de ${selectedDataType} para ${selectedParroquia}${
                        selectedSector ? ` - ${selectedSector}` : ""
                      }`
                    : `Selecciona una parroquia para cargar los datos de ${selectedDataType}`}
                </p>
                {selectedParroquia && (
                  <button
                    onClick={handleClearFilters}
                    style={{ marginTop: "10px", padding: "5px 10px" }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
        </Grid>
      </Grid>
    </div>
  );
}

export default RiesgosPage;
