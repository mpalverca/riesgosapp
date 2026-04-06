import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
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
import Vulnerabilidad from "./riesgos/vulnerabilidades/vulnerabilidad.jsx";
import VulViviendaCRUD from "./riesgos/predioInfo.jsx";
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
  const { claveData } = useClaveData(selectedParroquia, selectedSector, clave);
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
  }, [activeData.data, activeData.loading, isTransitioning, activeData]);

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

  //vulneravilidad // Estado para almacenar los valores seleccionados
  const [valores, setValores] = useState({
    antiguedad: "0",
    materiales: "0",
    normatividad: "0",
    caracteristicas: "0",
    localizacion: "0",
  });

  // Datos de la tabla
  const variables = [
    {
      id: "antiguedad",
      nombre: "Antigüedad de la edificación",
      opciones: [
        { valor: 1, descripcion: "Menos de 5 años" },
        { valor: 2, descripcion: "Entre 6 y 20 años" },
        { valor: 3, descripcion: "Mayor de 20 años" },
      ],
    },
    {
      id: "materiales",
      nombre: "Materiales de construcción y estado de conservación",
      opciones: [
        {
          valor: 1,
          descripcion:
            "Estructura con materiales de muy buena calidad, adecuada técnica constructiva y buen estado de conservación",
        },
        {
          valor: 2,
          descripcion:
            "Estructura de madera, concreto, adobe, bloque o acero, sin adecuada técnica constructiva y con un estado de deterioro moderado",
        },
        {
          valor: 3,
          descripcion:
            "Estructuras de adobe, madera u otros materiales, en estado precario de conservación",
        },
      ],
    },
    {
      id: "normatividad",
      nombre: "Cumplimiento de la normatividad vigente",
      opciones: [
        { valor: 1, descripcion: "Se cumple de forma estricta con las leyes" },
        { valor: 2, descripcion: "Se cumple medianamente con las leyes" },
        { valor: 3, descripcion: "No se cumple con las leyes" },
      ],
    },
    {
      id: "caracteristicas",
      nombre: "Características geológicas y tipo de suelo",
      opciones: [
        {
          valor: 1,
          descripcion:
            "Zonas que no presentan problemas de estabilidad, con buena cobertura vegetal",
        },
        {
          valor: 2,
          descripcion:
            "Zonas con indicios de inestabilidad y con poca cobertura vegetal",
        },
        {
          valor: 3,
          descripcion:
            "Zonas con problemas de estabilidad evidentes, llenos antrópicos y sin cobertura vegetal",
        },
      ],
    },
    {
      id: "localizacion",
      nombre:
        "Localización de las edificaciones con respecto a zonas de retiro a fuentes de agua y zonas de riesgo identificadas",
      opciones: [
        { valor: 1, descripcion: "Muy alejada" },
        { valor: 2, descripcion: "Medianamente cerca" },
        { valor: 3, descripcion: "Muy cercana" },
      ],
    },
  ];

  // Manejador de cambios en los radio buttons
  const handleChange = (id, valor) => {
    setValores((prev) => ({
      ...prev,
      [id]: valor.toString(),
    }));
  };

  // Calcular la suma total
  const calcularSuma = () => {
    return Object.values(valores).reduce((total, valor) => {
      return total + (parseInt(valor) || 0);
    }, 0);
  };

  // Reiniciar todos los valores
  const reiniciarValores = () => {
    setValores({
      antiguedad: "0",
      materiales: "0",
      normatividad: "0",
      caracteristicas: "0",
      localizacion: "0",
    });
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
                          (selectedDataType === "vialidad" ? (
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
                <Vulnerabilidad
                  valores={valores}
                  handleChange={handleChange}
                  calcularSuma={calcularSuma}
                  reiniciarValores={reiniciarValores}
                />
              ),
            }}
            tabsThree={{
              title: "Información de vivienda",
              body: <VulViviendaCRUD />
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
