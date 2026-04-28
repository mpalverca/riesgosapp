import React, { useState, useCallback, useEffect } from "react";
import { Box, Grid, Typography, Paper, Alert } from "@mui/material";
import { Layers as LayersIcon } from "@mui/icons-material";
import Panels from "../../../components/panels/Panels";
import LayerControl from "./body_accion/LayerControl.jsx";
import LayerGroup from "./body_accion/LayerGroup.jsx";
import MapMark from "./MapsView";
import { DialogAfect } from "./popups/ImputAfect";
import { DialogAccions } from "./popups/ImputAccions";
import { useGetInfo, useGetPoligonos } from "../script";
import {
  cargarDatosafec,
  cargarDatosParroquia,
} from "../../analisis/afects/script";
import { cargarDatosPol } from "../../../components/maps/script/script";

function BodyCOE({ mtt, member }) {
  const reqAfect = useGetInfo();
  const reqAcciones = useGetInfo();
  const reqRequ = useGetInfo();
  const reqPol = useGetPoligonos(); // Solo para polígonos
  const reqAfectaciones = cargarDatosafec(
    "Todos",
    "Todos",
    "Todos",
    "Todos",
    "Todos",
    "Todos",
  );

  // Estados para datos asíncronos
  const [parroquiaData, setParroquiaData] = useState(null);
  const [susceptibilidadData, setSusceptibilidadData] = useState(null);
  const [loadingParroquia, setLoadingParroquia] = useState(false);
  const [loadingSusceptibilidad, setLoadingSusceptibilidad] = useState(false);

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
  const [selectedCapa, setSelectedCapa] = useState({
    afectaciones: false,
    acciones: false,
    requerimientos: false,
    poligono: false,
    parroquia: false,
    susceptibilidad: false,
    afect_register: false,
  });

  // Función para cargar datos de parroquias
  const loadParroquiaData = useCallback(async () => {
    if (cache.parroquia) return cache.parroquia;

    setLoadingParroquia(true);
    try {
      const result = await cargarDatosParroquia();
      console.log("Parroquias cargadas:", result);
      const data = result?.data || result;
      setParroquiaData(data);
      setCache((prev) => ({ ...prev, parroquia: data }));
      return data;
    } catch (error) {
      console.error("Error cargando parroquias:", error);
      return [];
    } finally {
      setLoadingParroquia(false);
    }
  }, [cache.parroquia]);

  // Función para cargar datos de susceptibilidad (INDEPENDIENTE)
  const loadSusceptibilidadData = useCallback(async () => {
    if (cache.susceptibilidad) return cache.susceptibilidad;

    setLoadingSusceptibilidad(true);
    try {
      const result = await cargarDatosPol();
      console.log("Susceptibilidad cargada:", result);
      const data = result?.data?.data || result?.data || result;
      setSusceptibilidadData(data);
      setCache((prev) => ({ ...prev, susceptibilidad: data }));
      return data;
    } catch (error) {
      console.error("Error cargando susceptibilidad:", error);
      return [];
    } finally {
      setLoadingSusceptibilidad(false);
    }
  }, [cache.susceptibilidad]);

  // Función para recargar UNA SOLA capa específica (INDIVIDUAL)
  const handleRefreshLayer = useCallback(
    async (layer) => {
      try {
        console.log(`🔄 Recargando capa INDIVIDUAL: ${layer}`);

        if (layer === "afectaciones") {
          await reqAfect.searchGet(mtt, "Afectaciones");
          const data = reqAfect.dataGet?.data;
          setCache((prev) => ({ ...prev, afectaciones: data }));
          return data;
        }

        if (layer === "acciones") {
          await reqAcciones.searchGet(mtt, "Acciones");
          const data = reqAcciones.dataGet?.data;
          setCache((prev) => ({ ...prev, acciones: data }));
          return data;
        }

        if (layer === "requerimientos") {
          await reqRequ.searchGet(mtt, "Requerimiento");
          const data = reqRequ.dataGet?.data;
          setCache((prev) => ({ ...prev, requerimientos: data }));
          return data;
        }

        if (layer === "poligono") {
          await reqPol.searchPol();
          const data = reqPol.dataPol?.data;
          setCache((prev) => ({ ...prev, poligono: data }));
          return data;
        }

        if (layer === "parroquia") {
          const newData = await cargarDatosParroquia();
          console.log("📊 Parroquias recargadas:", newData);
          const parroquiaDataFormatted = newData?.data || newData;
          setParroquiaData(parroquiaDataFormatted);
          setCache((prev) => ({ ...prev, parroquia: parroquiaDataFormatted }));
          return parroquiaDataFormatted;
        }

        if (layer === "susceptibilidad") {
          const newData = await cargarDatosPol();
          console.log("🗺️ Susceptibilidad recargada:", newData);
          const susceptibilidadDataFormatted =
            newData?.data?.data || newData?.data || newData;
          setSusceptibilidadData(susceptibilidadDataFormatted);
          setCache((prev) => ({
            ...prev,
            susceptibilidad: susceptibilidadDataFormatted,
          }));
          return susceptibilidadDataFormatted;
        }

        if (layer === "afect_register") {
          const newData = await cargarDatosafec(
            "Todos",
            "Todos",
            "Todos",
            "Todos",
            "Todos",
            "Todos",
          );
          const afectData = newData?.data || newData;
          setCache((prev) => ({ ...prev, afect_register: afectData }));
          return afectData;
        }
      } catch (error) {
        console.error(`❌ Error recargando capa ${layer}:`, error);
      }
    },
    [mtt, reqAfect, reqAcciones, reqRequ, reqPol],
  );

  // Función para activar/desactivar capa
  const handleLayerToggle = useCallback(
    async (layer) => {
      const isActivating = !selectedCapa[layer];
      //console.log(`🖱️ Toggle capa: ${layer} -> Activando: ${isActivating}`);
      setSelectedCapa((prev) => ({ ...prev, [layer]: isActivating }));

      if (isActivating) {
        const currentData = getLayerData(layer);
        const hasData =
          currentData &&
          (Array.isArray(currentData) ? currentData.length > 0 : true);

        if (!hasData) {
          // SOLO recarga la capa específica que se está activando
          await handleRefreshLayer(layer);
        }
      }
    },
    [selectedCapa, handleRefreshLayer],
  );

  // ========== GRUPOS DE RECARGA (PARA LOS BOTONES "RECARGAR TODAS") ==========

  // Grupo 1: Solo Límites y polígonos (NO incluye susceptibilidad)
  const handleRefreshPolygonGroup = useCallback(async () => {
    console.log(
      "🔄 Recargando grupo de LÍMITES Y POLÍGONOS (poligono, parroquia)...",
    );
    await Promise.all([
      handleRefreshLayer("poligono"),
      handleRefreshLayer("parroquia"),
      // ❌ ELIMINADO: handleRefreshLayer("susceptibilidad")
    ]);
  }, [handleRefreshLayer]);

  // Grupo 2: Acciones del MTT
  const handleRefreshActionsGroup = useCallback(async () => {
    console.log("🔄 Recargando grupo de ACCIONES DEL MTT...");
    await Promise.all([
      handleRefreshLayer("afectaciones"),
      handleRefreshLayer("acciones"),
      handleRefreshLayer("requerimientos"),
    ]);
  }, [handleRefreshLayer]);

  // Grupo 3: Capas de análisis (SOLO afect_register, susceptibilidad está separada)
  const handleRefreshAnalysisGroup = useCallback(async () => {
    console.log("🔄 Recargando grupo de CAPAS DE ANÁLISIS (afect_register)...");
    await Promise.all([handleRefreshLayer("afect_register")]);
  }, [handleRefreshLayer]);

  // Grupo 4: Susceptibilidad sola (opcional, para recarga independiente)
  const handleRefreshSusceptibilidadGroup = useCallback(async () => {
    console.log("🔄 Recargando SUSCEPTIBILIDAD...");
    await handleRefreshLayer("susceptibilidad");
  }, [handleRefreshLayer]);

  const handleClickAF = (coordenate) => {
    setOpenAF(true);
    setCoordinates(coordenate);
  };

  const handleClickAC = (coordenate) => {
    setOpenAC(true);
    setCoordinates(coordenate);
  };

  // Obtener datos para cada capa
  const getLayerData = (layerKey) => {
    const dataMap = {
      poligono: reqPol.dataPol?.data || cache.poligono,
      parroquia: parroquiaData || cache.parroquia,
      susceptibilidad: susceptibilidadData || cache.susceptibilidad,
      afectaciones: reqAfect.dataGet?.data || cache.afectaciones,
      acciones: reqAcciones.dataGet?.data || cache.acciones,
      requerimientos: reqRequ.dataGet?.data || cache.requerimientos,
      afect_register: cache.afect_register,
    };

    const data = dataMap[layerKey] || [];
    return Array.isArray(data) ? data : [];
  };

  // Obtener conteo de cada capa
  const getLayerCount = (layerKey) => {
    const data = getLayerData(layerKey);
    return data?.length || 0;
  };

  // Obtener estado de carga de cada capa
  const isLoading = (layerKey) => {
    const loads = {
      poligono: reqPol.loadinPol || false,
      parroquia: loadingParroquia,
      susceptibilidad: loadingSusceptibilidad,
      afectaciones: reqAfect.loadingGet,
      acciones: reqAcciones.loadingGet,
      requerimientos: reqRequ.loadingGet,
      afect_register: reqAfectaciones?.loading || false,
    };
    return loads[layerKey] || false;
  };

  const activeLayersCount = Object.values(selectedCapa).filter(Boolean).length;
  const totalLayers = 7;

  // Cargar datos iniciales
  /*  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([loadParroquiaData(), loadSusceptibilidadData()]);
    };
    loadInitialData();
  }, [loadParroquiaData, loadSusceptibilidadData]); */
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
            <Box sx={{ px: 1, py: 1 }}>
              {/* Grupo 1: Límites y polígonos (SOLO poligono y parroquia) */}
              <LayerGroup
                title="1. Límites y polígonos"
                onRefreshAll={handleRefreshPolygonGroup}
                showRefreshAll={true}
              >
                {/* Polígonos de afectación - SOLO ejecuta poligono */}
                <LayerControl
                  label="Polígonos de afectación"
                  icon={
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: "#3519d2",
                        borderRadius: 0.5,
                      }}
                    />
                  }
                  color="#3519d2"
                  bgColor="#e8eaf6"
                  count={getLayerCount("poligono")}
                  isLoading={isLoading("poligono")}
                  isSelected={selectedCapa.poligono}
                  onToggle={() => handleLayerToggle("poligono")}
                  onRefresh={() => handleRefreshLayer("poligono")}
                >
                  <Typography variant="caption" color="text.secondary">
                    Total de polígonos: {getLayerCount("poligono")} <br />
                  </Typography>
                  {getLayerData("poligono").map((item, index) => {
                    return (
                      <>
                        <Typography variant="caption" color="text.secondary">
                          {index + 1} : {item.parroq}-{item.sector}-
                          {item.date_event}
                        </Typography>
                        <br />
                      </>
                    );
                  })}
                </LayerControl>

                {/* Límites parroquiales */}
                <LayerControl
                  label="Límites parroquiales"
                  icon={
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: "#4caf50",
                        borderRadius: 0.5,
                      }}
                    />
                  }
                  color="#4caf50"
                  bgColor="#e8f5e9"
                  count={getLayerCount("parroquia")}
                  isLoading={isLoading("parroquia")}
                  isSelected={selectedCapa.parroquia}
                  onToggle={() => handleLayerToggle("parroquia")}
                  onRefresh={() => handleRefreshLayer("parroquia")}
                >
                  <Typography variant="caption" color="text.secondary">
                    Total de parroquias cargadas: {getLayerCount("parroquia")}{" "}
                    <br />
                  </Typography>

                  {getLayerData("parroquia").map((item, index) => {
                    return (
                      <>
                        <Typography variant="caption" color="text.secondary">
                          {item.DPA_DESPAR}
                        </Typography>{" "}
                        <br />
                      </>
                    );
                  })}
                </LayerControl>
              </LayerGroup>

              {/* Grupo 2: Acciones del MTT */}
              <LayerGroup
                title="2. Acciones del MTT"
                onRefreshAll={handleRefreshActionsGroup}
                showRefreshAll={true}
              >
                <LayerControl
                  label="Afectaciones"
                  icon={
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: "#e6101b",
                        borderRadius: "50%",
                      }}
                    />
                  }
                  color="#e6101b"
                  bgColor="#ffe6e6"
                  count={getLayerCount("afectaciones")}
                  isLoading={isLoading("afectaciones")}
                  isSelected={selectedCapa.afectaciones}
                  onToggle={() => handleLayerToggle("afectaciones")}
                  onRefresh={() => handleRefreshLayer("afectaciones")}
                >
                  <Typography variant="caption" color="text.secondary">
                    Registros de afectaciones: {getLayerCount("afectaciones")}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary"
                    sx={{ display: "block", cursor: "pointer" }}
                  >
                    Última actualización: {new Date().toLocaleTimeString()}
                  </Typography>
                </LayerControl>

                <LayerControl
                  label="Acciones"
                  icon={
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: "#ff8c00",
                        borderRadius: "50%",
                      }}
                    />
                  }
                  color="#ff8c00"
                  bgColor="#fff3e0"
                  count={getLayerCount("acciones")}
                  isLoading={isLoading("acciones")}
                  isSelected={selectedCapa.acciones}
                  onToggle={() => handleLayerToggle("acciones")}
                  onRefresh={() => handleRefreshLayer("acciones")}
                >
                  <Typography variant="caption" color="text.secondary">
                    Registros de Acciones: {getLayerCount("acciones")}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary"
                    sx={{ display: "block", cursor: "pointer" }}
                  >
                    Última actualización: {new Date().toLocaleTimeString()}
                  </Typography>

                  {(() => {
  const data = getLayerData("acciones");
  const vigente = data.filter(item => item.estado?.toLowerCase() === "vigente").length;
  const finalizada = data.filter(item => {
    const estado = item.estado?.toLowerCase();
    return estado === "finalizada" || estado === "finalizado";
  }).length;
  
  return (
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
      📊 <strong style={{ color: '#2e7d32' }}>Vigente:</strong> {vigente} | 
      <strong style={{ color: '#757575' }}> Finalizada:</strong> {finalizada} | 
      <strong> Total:</strong> {data.length}
    </Typography>
  );
})()}
                </LayerControl>

                <LayerControl
                  label="Requerimientos"
                  icon={
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: "#228b22",
                        borderRadius: "50%",
                      }}
                    />
                  }
                  color="#228b22"
                  bgColor="#e8f5e9"
                  count={getLayerCount("requerimientos")}
                  isLoading={isLoading("requerimientos")}
                  isSelected={selectedCapa.requerimientos}
                  onToggle={() => handleLayerToggle("requerimientos")}
                  onRefresh={() => handleRefreshLayer("requerimientos")}
                />
              </LayerGroup>

              {/* Grupo 3: Capas de análisis (SOLO afect_register) */}
              <LayerGroup
                title="3. Capas de análisis"
                onRefreshAll={handleRefreshAnalysisGroup}
                showRefreshAll={true}
              >
                <LayerControl
                  label="Afectaciones registradas"
                  icon={
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: "#ff8c00",
                        borderRadius: 0.5,
                      }}
                    />
                  }
                  color="#ff8c00"
                  bgColor="#fff3e0"
                  count={getLayerCount("afect_register")}
                  isLoading={isLoading("afect_register")}
                  isSelected={selectedCapa.afect_register}
                  onToggle={() => handleLayerToggle("afect_register")}
                  onRefresh={() => handleRefreshLayer("afect_register")}
                />
              </LayerGroup>

              {/* Grupo 4: Susceptibilidad del terreno (INDEPENDIENTE) */}
              <LayerGroup
                title="4. Susceptibilidad del terreno"
                onRefreshAll={handleRefreshSusceptibilidadGroup}
                showRefreshAll={true}
              >
                <LayerControl
                  label="Zonas de susceptibilidad"
                  icon={
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: "#228b22",
                        borderRadius: 0.5,
                      }}
                    />
                  }
                  color="#228b22"
                  bgColor="#e8f5e9"
                  count={getLayerCount("susceptibilidad")}
                  isLoading={isLoading("susceptibilidad")}
                  isSelected={selectedCapa.susceptibilidad}
                  onToggle={() => handleLayerToggle("susceptibilidad")}
                  onRefresh={() => handleRefreshLayer("susceptibilidad")}
                >
                  <Typography variant="caption" color="text.secondary">
                    Zonas de susceptibilidad: {getLayerCount("susceptibilidad")}{" "}
                    áreas identificadas
                  </Typography>
                  {(() => {
                    const data = getLayerData("susceptibilidad");

                    // Contar por tipo
                    const counts = {
                      movimientoMasa: 0,
                      inundacion: 0,
                      incendio: 0,
                      otros: 0,
                    };

                    data.forEach((item) => {
                      if (item.tipo === 1) counts.movimientoMasa++;
                      else if (item.tipo === 2) counts.inundacion++;
                      else if (item.tipo === 3) counts.incendio++;
                      else counts.otros++;
                    });

                    return (
                      <Box sx={{ mt: 1, pl: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
                        >
                          Distribución por tipo:
                        </Typography>

                        {counts.movimientoMasa > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            🏔️ Movimiento en masa: {counts.movimientoMasa}
                          </Typography>
                        )}

                        {counts.inundacion > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            💧 Inundación: {counts.inundacion}
                          </Typography>
                        )}

                        {counts.incendio > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            🔥 Incendio: {counts.incendio}
                          </Typography>
                        )}

                        {counts.otros > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            ❓ Otros tipos: {counts.otros}
                          </Typography>
                        )}

                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "bold", display: "block", mt: 0.5 }}
                        >
                          Total: {data.length} zonas
                        </Typography>
                      </Box>
                    );
                  })()}
                </LayerControl>
              </LayerGroup>

              {/* Indicadores de estado */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  mt: 2,
                  bgcolor: activeLayersCount > 0 ? "#e8eaf6" : "#f5f5f5",
                  transition: "all 0.2s",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
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
            loadingPol: reqPol?.loadinPol || false,
          }}
          dataAF={getLayerData("afectaciones")}
          dataAC={getLayerData("acciones")}
          dataRE={getLayerData("requerimientos")}
          dataPol={getLayerData("poligono")}
          dataSusceptibilidad={getLayerData("susceptibilidad")}
          dataParroquia={getLayerData("parroquia")}
          dataAfectRegister={getLayerData("afect_register")}
          selectCapa={selectedCapa}
          mtt={mtt}
          layersConfig={[
            {
              key: "afectaciones",
              label: "Afectaciones",
              icon: (
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#e6101b",
                    borderRadius: "50%",
                  }}
                />
              ),
              color: "#e6101b",
              accion: (coords) => handleClickAF(coords),
            },
            {
              key: "acciones",
              label: "Acciones",
              icon: (
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#ff8c00",
                    borderRadius: "50%",
                  }}
                />
              ),
              color: "#ff8c00",
              accion: (coords) => handleClickAC(coords),
            },
            {
              key: "requerimientos",
              label: "Requerimientos",
              icon: (
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#228b22",
                    borderRadius: "50%",
                  }}
                />
              ),
              color: "#228b22",
              accion: (coords) => console.log("Requerimiento en:", coords),
            },
          ]}
          onRefreshLayer={handleRefreshLayer}
          setCoordinates={setCoordinates}
        />
      </Grid>

      {/* Diálogos */}
      <DialogAfect
        mtt={mtt}
        open={openAF}
        dataPol={getLayerData("poligono")}
        coordinates={coordinates}
        member={member}
        onClose={() => setOpenAF(false)}
      />
      <DialogAccions
        mtt={mtt}
        open={openAC}
        dataPol={getLayerData("poligono")}
        coordinates={coordinates}
        member={member}
        length={getLayerCount("acciones")}
        onClose={() => setOpenAC(false)}
      />
    </Grid>
  );
}

export default BodyCOE;
