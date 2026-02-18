import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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


  //vulneravilidad // Estado para almacenar los valores seleccionados
  const [valores, setValores] = useState({
    antiguedad: '0',
    materiales: '0',
    normatividad: '0',
    caracteristicas: '0',
    localizacion: '0'
  });

  // Datos de la tabla
  const variables = [
    {
      id: 'antiguedad',
      nombre: 'Antigüedad de la edificación',
      opciones: [
        { valor: 1, descripcion: 'Menos de 5 años' },
        { valor: 2, descripcion: 'Entre 6 y 20 años' },
        { valor: 3, descripcion: 'Mayor de 20 años' }
      ]
    },
    {
      id: 'materiales',
      nombre: 'Materiales de construcción y estado de conservación',
      opciones: [
        { valor: 1, descripcion: 'Estructura con materiales de muy buena calidad, adecuada técnica constructiva y buen estado de conservación' },
        { valor: 2, descripcion: 'Estructura de madera, concreto, adobe, bloque o acero, sin adecuada técnica constructiva y con un estado de deterioro moderado' },
        { valor: 3, descripcion: 'Estructuras de adobe, madera u otros materiales, en estado precario de conservación' }
      ]
    },
    {
      id: 'normatividad',
      nombre: 'Cumplimiento de la normatividad vigente',
      opciones: [
        { valor: 1, descripcion: 'Se cumple de forma estricta con las leyes' },
        { valor: 2, descripcion: 'Se cumple medianamente con las leyes' },
        { valor: 3, descripcion: 'No se cumple con las leyes' }
      ]
    },
    {
      id: 'caracteristicas',
      nombre: 'Características geológicas y tipo de suelo',
      opciones: [
        { valor: 1, descripcion: 'Zonas que no presentan problemas de estabilidad, con buena cobertura vegetal' },
        { valor: 2, descripcion: 'Zonas con indicios de inestabilidad y con poca cobertura vegetal' },
        { valor: 3, descripcion: 'Zonas con problemas de estabilidad evidentes, llenos antrópicos y sin cobertura vegetal' }
      ]
    },
    {
      id: 'localizacion',
      nombre: 'Localización de las edificaciones con respecto a zonas de retiro a fuentes de agua y zonas de riesgo identificadas',
      opciones: [
        { valor: 1, descripcion: 'Muy alejada' },
        { valor: 2, descripcion: 'Medianamente cerca' },
        { valor: 3, descripcion: 'Muy cercana' }
      ]
    }
  ];

  // Manejador de cambios en los radio buttons
  const handleChange = (id, valor) => {
    setValores(prev => ({
      ...prev,
      [id]: valor.toString()
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
      antiguedad: '0',
      materiales: '0',
      normatividad: '0',
      caracteristicas: '0',
      localizacion: '0'
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
                      <Divider />
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
                      <Box sx={{ p: 3 }}>
                        <Typography
                          variant="h5"
                          gutterBottom
                          sx={{ mb: 3, fontWeight: "bold" }}
                        >
                          Matriz de Vulnerabilidad Física
                        </Typography>

                        <TableContainer component={Paper} elevation={3}>
                          <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell
                                  sx={{ fontWeight: "bold", width: "40%" }}
                                >
                                  Variable
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                  }}
                                  colSpan={3}
                                >
                                  Valor de Vulnerabilidad
                                </TableCell>
                              </TableRow>
                              <TableRow sx={{ backgroundColor: "#fafafa" }}>
                                <TableCell></TableCell>
                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    color: "#4caf50",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Baja (1)
                                </TableCell>
                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    color: "#ff9800",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Media (2)
                                </TableCell>
                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    color: "#f44336",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Alta (3)
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {variables.map((variable) => (
                                <TableRow key={variable.id} hover>
                                  <TableCell sx={{ fontWeight: "medium" }}>
                                    {variable.nombre}
                                  </TableCell>
                                  {variable.opciones.map((opcion, index) => (
                                    <TableCell
                                      key={index}
                                      sx={{ textAlign: "center" }}
                                    >
                                      <RadioGroup
                                        value={valores[variable.id]}
                                        onChange={(e) =>
                                          handleChange(
                                            variable.id,
                                            e.target.value,
                                          )
                                        }
                                        sx={{
                                          display: "flex",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <FormControlLabel
                                          value={opcion.valor.toString()}
                                          control={<Radio />}
                                          label={opcion.descripcion}
                                          sx={{
                                            m: 0,
                                            "& .MuiFormControlLabel-label": {
                                              fontSize: "0.875rem",
                                              textAlign: "left",
                                              maxWidth: "250px",
                                            },
                                          }}
                                        />
                                      </RadioGroup>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {/* Tarjeta con el total */}
                        <Card sx={{ mt: 3, backgroundColor: "#e3f2fd" }}>
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold" }}
                              >
                                Total Vulnerabilidad Física:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  variant="h4"
                                  sx={{ fontWeight: "bold", color: "#1976d2" }}
                                >
                                  {calcularSuma()}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  / 15
                                </Typography>
                                <Button
                                  variant="outlined"
                                  onClick={reiniciarValores}
                                  sx={{ ml: 2 }}
                                >
                                  Reiniciar
                                </Button>
                              </Box>
                            </Box>

                            {/* Indicador de nivel de vulnerabilidad */}
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" gutterBottom>
                                Nivel de Vulnerabilidad:
                              </Typography>
                              <Box
                                sx={{
                                  width: "100%",
                                  height: "10px",
                                  backgroundColor: "#e0e0e0",
                                  borderRadius: "5px",
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${(calcularSuma() / 15) * 100}%`,
                                    height: "100%",
                                    backgroundColor:
                                      calcularSuma() <= 8
                                        ? "#4caf50"
                                        : calcularSuma() <= 12
                                          ? "#ff9800"
                                          : "#f44336",
                                    transition: "width 0.3s ease",
                                  }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mt: 1,
                                  color: "text.secondary",
                                  fontSize: "0.875rem",
                                }}
                              >
                                <span>Baja (5-8)</span>
                                <span>Media (9-12)</span>
                                <span>Alta (13-15)</span>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
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
