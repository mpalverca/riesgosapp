import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
  Chip,
  Skeleton,
  Collapse,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  LinearProgress,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CircleNotifications as CircleNotificationsIcon,
  DirectionsWalk as DirectionsWalkIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Map as MapIcon,
  Warning as WarningIcon,
  AppsOutage as AppsOutageIcon,
  Info as InfoIcon,
  Layers as LayersIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Terrain as TerrainIcon,
} from "@mui/icons-material";
import Panels from "../../../components/panels/Panels";
import MapMark from "./MapsView";
import { DialogAfect } from "./popups/ImputAfect";
import { useGetInfo, useGetPoligonos } from "../script";
import { DialogAccions } from "./popups/ImputAccions";
import { cargarDatosafec, cargarDatosParroquia } from "../../analisis/afects/script";
import { cargarDatosPol } from "../../../components/maps/script/script";

function BodyCOE({ mtt, member }) {
  const reqAfect = useGetInfo();
  const reqAcciones = useGetInfo();
  const reqRequ = useGetInfo();
  const reqPol = useGetPoligonos();
  const reqAfectaciones = cargarDatosafec("Todos", "Todos", "Todos", "Todos", "Todos", "Todos");
  const reqParroquia = cargarDatosParroquia();
  const reqSusceptibilidad = cargarDatosPol();

  const [cache, setCache] = useState({
    afectaciones: null,
    acciones: null,
    requerimientos: null,
    poligono: null,
    afect_register: null,
    parroquia: null,
    susceptibilidad: null,
  });

  const [coordinates, setCoordinates] = useState(null);
  const [openAF, setOpenAF] = useState(false);
  const [openAC, setOpenAC] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    polygons: true,
    actions: true,
    otherLayers: true,
  });
  const [selectedCapa, setSelectedCapa] = useState({
    afectaciones: false,
    acciones: false,
    requerimientos: false,
    poligono: false,
    parroquia: false,
    susceptibilidad: false,
    afect_register: false,
  });

  const handleLayerToggle = async (layer) => {
    const isActivating = !selectedCapa[layer];
    setSelectedCapa((prev) => ({ ...prev, [layer]: isActivating }));

    if (isActivating && !cache[layer]) {
      let result;
      try {
        if (layer === "afectaciones")
          result = await reqAfect.searchGet(mtt, "Afectaciones");
        if (layer === "acciones")
          result = await reqAcciones.searchGet(mtt, "Acciones");
        if (layer === "requerimientos")
          result = await reqRequ.searchGet(mtt, "Requerimiento");
        if (layer === "poligono") 
          result = await reqPol.searchPol();
        if (layer === "afect_register") {
          result = await reqAfectaciones;
          // Asegurar que result tenga la estructura correcta
          result = { data: result };
        }
        if (layer === "parroquia") {
          result = await reqParroquia;
          result = { data: result };
        }
        if (layer === "susceptibilidad") {
          result = await reqSusceptibilidad;
          result = { data: result };
        }
        
        if (result?.data) {
          setCache((prev) => ({ ...prev, [layer]: result.data }));
        }
      } catch (error) {
        console.error(`Error cargando capa ${layer}:`, error);
      }
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleClickAF = (coordenate) => {
    setOpenAF(true);
    setCoordinates(coordenate);
  };

  const handleClickAC = (coordenate) => {
    setOpenAC(true);
    setCoordinates(coordenate);
  };

  const layersConfig = [
    {
      key: "afectaciones",
      label: "Afectaciones",
      icon: <CircleNotificationsIcon />,
      color: "#e6101b",
      bgColor: "#ffe6e6",
      instance: reqAfect,
      searchType: "Afectaciones",
      accion: (coords) => handleClickAF(coords),
    },
    {
      key: "acciones",
      label: "Acciones",
      icon: <DirectionsWalkIcon />,
      color: "#ff8c00",
      bgColor: "#fff3e0",
      instance: reqAcciones,
      searchType: "Acciones",
      accion: (coords) => handleClickAC(coords),
    },
    {
      key: "requerimientos",
      label: "Requerimientos",
      icon: <CheckCircleOutlineIcon />,
      color: "#228b22",
      bgColor: "#e8f5e9",
      instance: reqRequ,
      searchType: "Requerimientos",
      accion: (coords) => console.log("Requerimiento en:", coords),
    },
  ];

  const getLayerCount = (layerKey) => {
    const counts = {
      poligono: reqPol.dataPol?.data?.length || 0,
      parroquia: reqParroquia?.data?.length || 0,
      afectaciones: reqAfect.dataGet?.data?.length || 0,
      acciones: reqAcciones.dataGet?.data?.length || 0,
      requerimientos: reqRequ.dataGet?.data?.length || 0,
      afect_register: cache.afect_register?.length || 0,
      susceptibilidad: cache.susceptibilidad?.length || 0,
    };
    return counts[layerKey] || 0;
  };

  const isLoading = (layerKey) => {
    const loads = {
      poligono: reqPol.loadinPol,
      afectaciones: reqAfect.loadingGet,
      acciones: reqAcciones.loadingGet,
      requerimientos: reqRequ.loadingGet,
      parroquia: reqParroquia?.loading || false,
      afect_register: reqAfectaciones?.loading || false,
      susceptibilidad: reqSusceptibilidad?.loading || false,
    };
    return loads[layerKey] || false;
  };

  const getLayerData = (layerKey) => {
    const dataMap = {
      poligono: reqPol.dataPol?.data,
      parroquia: reqParroquia?.data,
      afectaciones: reqAfect.dataGet?.data,
      acciones: reqAcciones.dataGet?.data,
      requerimientos: reqRequ.dataGet?.data,
      afect_register: cache.afect_register,
      susceptibilidad: cache.susceptibilidad,
    };
    return dataMap[layerKey] || [];
  };

  const activeLayersCount = Object.values(selectedCapa).filter(Boolean).length;
  const totalLayers = 7;

  return (
    <Grid container spacing={2} sx={{ padding: 2, height: "100vh" }}>
      {/* Sidebar */}
      <Grid size={{ xs: 12, md: 3 }} sx={{ height: "100%", overflowY: "auto" }}>
        <Panels
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LayersIcon fontSize="small" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {!mtt ? "Cargando..." : `Mesa Técnica - ${mtt}`}
              </Typography>
            </Box>
          }
          body={
            <Box sx={{ px: 1.5, py: 1 }}>
              {/* Sección 1: Polígonos y límites */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                  onClick={() => toggleSection("polygons")}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#3519d2" }}>
                    1. Límites y polígonos
                  </Typography>
                  <IconButton size="small">
                    {expandedSections.polygons ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                
                <Collapse in={expandedSections.polygons}>
                  <Stack spacing={1}>
                    {/* Polígonos de afectación */}
                    <Tooltip title="Muestra los polígonos de afectación definidos" placement="right">
                      <FormControlLabel
                        sx={{
                          ml: 1,
                          width: "100%",
                          borderRadius: 1,
                          transition: "all 0.2s",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                        control={
                          <Checkbox
                            checked={selectedCapa.poligono}
                            onChange={() => handleLayerToggle("poligono")}
                            icon={<MapIcon />}
                            checkedIcon={<MapIcon sx={{ color: "#3519d2" }} />}
                            disabled={isLoading("poligono")}
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2">Polígonos de afectación</Typography>
                            {isLoading("poligono") ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Chip
                                label={`${getLayerCount("poligono")}`}
                                size="small"
                                sx={{ bgcolor: "#3519d2", color: "white", fontWeight: "bold", minWidth: "32px" }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </Tooltip>

                    {/* Parroquias */}
                    <Tooltip title="Muestra los límites parroquiales" placement="right">
                      <FormControlLabel
                        sx={{
                          ml: 1,
                          width: "100%",
                          borderRadius: 1,
                          transition: "all 0.2s",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                        control={
                          <Checkbox
                            checked={selectedCapa.parroquia}
                            onChange={() => handleLayerToggle("parroquia")}
                            icon={<TerrainIcon />}
                            checkedIcon={<TerrainIcon sx={{ color: "#4caf50" }} />}
                            disabled={isLoading("parroquia")}
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2">Límites parroquiales</Typography>
                            {isLoading("parroquia") ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Chip
                                label={`${getLayerCount("parroquia")}`}
                                size="small"
                                sx={{ bgcolor: "#4caf50", color: "white", fontWeight: "bold", minWidth: "32px" }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </Tooltip>
                  </Stack>
                </Collapse>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Sección 2: Acciones del MTT */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                  onClick={() => toggleSection("actions")}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#3519d2" }}>
                    2. Acciones del MTT
                  </Typography>
                  <IconButton size="small">
                    {expandedSections.actions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={expandedSections.actions}>
                  <Stack spacing={1.5}>
                    {layersConfig.map((layer) => (
                      <Box key={layer.key} sx={{ position: "relative" }}>
                        {isLoading(layer.key) && (
                          <LinearProgress 
                            sx={{ 
                              position: "absolute", 
                              top: 0, 
                              left: 0, 
                              right: 0, 
                              borderRadius: 1,
                              height: 2 
                            }} 
                          />
                        )}
                        <Paper
                          elevation={0}
                          sx={{
                            bgcolor: selectedCapa[layer.key] ? layer.bgColor : "transparent",
                            transition: "all 0.2s",
                            borderRadius: 1,
                          }}
                        >
                          <FormControlLabel
                            sx={{
                              ml: 1,
                              width: "100%",
                              borderRadius: 1,
                              transition: "all 0.2s",
                              "&:hover": { bgcolor: "action.hover" },
                              opacity: isLoading(layer.key) ? 0.7 : 1,
                            }}
                            control={
                              <Checkbox
                                checked={selectedCapa[layer.key]}
                                onChange={() => handleLayerToggle(layer.key)}
                                icon={layer.icon}
                                checkedIcon={React.cloneElement(layer.icon, { sx: { color: layer.color } })}
                                disabled={isLoading(layer.key)}
                              />
                            }
                            label={
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                <Typography variant="body2" sx={{ fontWeight: selectedCapa[layer.key] ? 500 : 400 }}>
                                  {layer.label}
                                </Typography>
                                {!isLoading(layer.key) && (
                                  <Chip
                                    label={`${getLayerCount(layer.key)}`}
                                    size="small"
                                    sx={{
                                      bgcolor: layer.color,
                                      color: "white",
                                      fontWeight: "bold",
                                      minWidth: "32px",
                                      height: "20px",
                                      "& .MuiChip-label": { px: 1, fontSize: "0.7rem" }
                                    }}
                                  />
                                )}
                                {isLoading(layer.key) && <Skeleton width={40} height={20} />}
                              </Box>
                            }
                          />
                        </Paper>
                      </Box>
                    ))}
                  </Stack>
                </Collapse>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Sección 3: Capas de análisis */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                  onClick={() => toggleSection("otherLayers")}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#3519d2" }}>
                    3. Capas de análisis
                  </Typography>
                  <IconButton size="small">
                    {expandedSections.otherLayers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={expandedSections.otherLayers}>
                  <Stack spacing={1.5}>
                    <Tooltip title="Visualiza las afectaciones registradas en el sistema" placement="right">
                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: selectedCapa.afect_register ? "#fff3e0" : "transparent",
                          transition: "all 0.2s",
                          borderRadius: 1,
                        }}
                      >
                        <FormControlLabel
                          sx={{
                            ml: 1,
                            width: "100%",
                            borderRadius: 1,
                            transition: "all 0.2s",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                          control={
                            <Checkbox
                              checked={selectedCapa.afect_register}
                              onChange={() => handleLayerToggle("afect_register")}
                              icon={<WarningIcon />}
                              checkedIcon={<WarningIcon sx={{ color: "#ff8c00" }} />}
                            />
                          }
                          label={
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                              <Typography variant="body2">Afectaciones registradas</Typography>
                              <Chip
                                label={`${getLayerCount("afect_register")}`}
                                size="small"
                                sx={{ bgcolor: "#ff8c00", color: "white", fontWeight: "bold", minWidth: "32px" }}
                              />
                            </Box>
                          }
                        />
                      </Paper>
                    </Tooltip>

                    <Tooltip title="Visualiza las zonas de susceptibilidad del terreno" placement="right">
                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: selectedCapa.susceptibilidad ? "#e8f5e9" : "transparent",
                          transition: "all 0.2s",
                          borderRadius: 1,
                        }}
                      >
                        <FormControlLabel
                          sx={{
                            ml: 1,
                            width: "100%",
                            borderRadius: 1,
                            transition: "all 0.2s",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                          control={
                            <Checkbox
                              checked={selectedCapa.susceptibilidad}
                              onChange={() => handleLayerToggle("susceptibilidad")}
                              icon={<AppsOutageIcon />}
                              checkedIcon={<AppsOutageIcon sx={{ color: "#228b22" }} />}
                            />
                          }
                          label={
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                              <Typography variant="body2">Susceptibilidad del terreno</Typography>
                              <Chip
                                label={`${getLayerCount("susceptibilidad")}`}
                                size="small"
                                sx={{ bgcolor: "#228b22", color: "white", fontWeight: "bold", minWidth: "32px" }}
                              />
                            </Box>
                          }
                        />
                      </Paper>
                    </Tooltip>
                  </Stack>
                </Collapse>
              </Box>

              {/* Indicadores de estado */}
              <Divider sx={{ my: 1.5 }} />
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1.5, 
                  bgcolor: activeLayersCount > 0 ? "#e8eaf6" : "#f5f5f5",
                  transition: "all 0.2s"
                }}
              >
                <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <InfoIcon fontSize="small" sx={{ fontSize: 14 }} />
                  Capas activas: {activeLayersCount} / {totalLayers}
                </Typography>
              </Paper>
            </Box>
          }
        />
      </Grid>

      {/* Mapa */}
      <Grid size={{ xs: 12, md: 9 }} sx={{ height: "100%" }}>
        <MapMark
          position={[-3.9965787520553717, -79.20168563157956]}
          zoom={13}
          loading={{
            loadingAF: reqAfect.loadingGet,
            loadingAC: reqAcciones?.loadingGet,
            loadingRE: reqRequ?.loadingGet,
            loadingPol: reqPol?.loadinPol,
          }}
          dataAF={reqAfect.dataGet?.data}
          dataAC={reqAcciones.dataGet?.data}
          dataRE={reqRequ.dataGet?.data}
          dataPol={getLayerData("poligono")}
          dataParroquia={getLayerData("parroquia")}
          dataAfectRegister={getLayerData("afect_register")}
          dataSusceptibilidad={getLayerData("susceptibilidad")}
          selectCapa={selectedCapa}
          mtt={mtt}
          layersConfig={layersConfig}
          setCoordinates={setCoordinates}
        />
      </Grid>

      {/* Diálogos */}
      <DialogAfect
        mtt={mtt}
        open={openAF}
        dataPol={reqPol.dataPol?.data}
        coordinates={coordinates}
        member={member}
        onClose={() => setOpenAF(false)}
      />
      <DialogAccions
        mtt={mtt}
        open={openAC}
        dataPol={reqPol.dataPol?.data}
        coordinates={coordinates}
        member={member}
        length={reqAcciones.dataGet?.data?.length}
        onClose={() => setOpenAC(false)}
      />
    </Grid>
  );
}

export default BodyCOE;