import React, { useState, useCallback, } from "react";
import { Box, Grid,  } from "@mui/material";

import { useGetInfo, useGetPoligonos } from "../script";
import {
  cargarDatosafec,
  cargarDatosParroquia,
} from "../../analisis/afects/script";

import MapMark from "../canton/MapsView.jsx";
import { DialogAccions } from "./inputAcción.jsx";
import { cargarDatosPol } from "../../../components/maps/script/script.js";
import PanelAccion from "./Panel.jsx";

function BodyPlan({ mtt, member }) {
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
        //  console.log(`🔄 Recargando capa INDIVIDUAL: ${layer}`);

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
        <PanelAccion
        mtt={mtt}
          handleRefreshActionsGroup={handleRefreshActionsGroup}
          getLayerCount={getLayerCount}
          handleRefreshPolygonGroup={handleRefreshPolygonGroup}
          isLoading={isLoading}
          selectedCapa={selectedCapa}
          handleLayerToggle={handleLayerToggle}
          handleRefreshLayer={handleRefreshLayer}
          getLayerData={getLayerData}
          totalLayers={totalLayers}
          activeLayersCount={activeLayersCount}
          handleRefreshSusceptibilidadGroup={handleRefreshSusceptibilidadGroup}
          handleRefreshAnalysisGroup={handleRefreshAnalysisGroup}
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

export default BodyPlan;
