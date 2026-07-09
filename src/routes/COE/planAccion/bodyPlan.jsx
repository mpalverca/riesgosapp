import React, { useState, useCallback } from "react";
import { Box, Grid } from "@mui/material";

import { usePlanA } from "./script";
import { useGetPoligonos } from "../script";
import {
  cargarDatosafec,
  cargarDatosParroquia,
} from "../../analisis/afects/script";
import { DialogAccions } from "./inputAcción.jsx";
import { cargarDatosPol } from "../../../components/maps/script/script.js";
import PanelAccion from "./Panel.jsx";
import MapMark from "./Map.jsx";

function BodyPlan({ mtt, member }) {
  // ========== HOOKS ==========
  const reqCon_Monit = usePlanA();
  const reqPrev_mitig = usePlanA();
  const reqPrep = usePlanA();
  const reqRes = usePlanA();
  const reqReq = usePlanA();
  const reqPol = useGetPoligonos();
  const reqAfectaciones = cargarDatosafec(
    "Todos",
    "Todos",
    "Todos",
    "Todos",
    "Todos",
    "Todos"
  );

  // ========== ESTADOS DE CARGA ==========
  const [loadingParroquia, setLoadingParroquia] = useState(false);
  const [loadingSusceptibilidad, setLoadingSusceptibilidad] = useState(false);

  // ========== ESTADOS DE DATOS ==========
  const [parroquiaData, setParroquiaData] = useState(null);
  const [susceptibilidadData, setSusceptibilidadData] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // ========== CACHE UNIFICADO ==========
  const [cache, setCache] = useState({
    // Capas de análisis
    conoc_monit: null,
    prev_mitig: null,
    preparacion: null,
    respuesta: null,
    recuperacion: null,
    // Capas geográficas
    poligono: null,
    parroquia: null,
    susceptibilidad: null,
    // Registros
    afect_register: null,
  });

  // ========== ESTADO DE CAPAS ACTIVAS ==========
  const [selectedCapa, setSelectedCapa] = useState({
    // Capas de análisis
    conoc_monit: false,
    prev_mitig: false,
    preparacion: false,
    respuesta: false,
    recuperacion: false,
    // Capas geográficas
    poligono: false,
    parroquia: false,
    susceptibilidad: false,
    afect_register: false,
  });

  // ========== DIÁLOGOS ==========
  const [openCon_mont, setOpencon] = useState(false);
  const [openPreparacion, setOpenPrep] = useState(false);
  const [openRespuesta, setOpenResp] = useState(false);
  const [openRecuperacion, setOpenRec] = useState(false);
  const [openPrev_mitig, setOpenPrev] = useState(false);

  // ========== FUNCIONES DE CARGA DE DATOS BASE ==========
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

  // ========== FUNCIÓN PRINCIPAL DE RECARGA ==========
  const handleRefreshLayer = useCallback(
    async (layer) => {
      try {
        console.log(`🔄 Recargando capa: ${layer}`);

        // Mapeo de capas a sus funciones de carga
        const layerActions = {
          // Capas de análisis
          conoc_monit: async () => {
            await reqCon_Monit.searchGet(mtt, "Conoc_Monit");
            const data = reqCon_Monit?.dataGet;
            
            setCache((prev) => ({ ...prev, conoc_monit: data }));
            return data;
          },
          prev_mitig: async () => {
            await reqPrev_mitig.searchGet(mtt, "prev_mit");
            const data = reqPrev_mitig?.dataGet;
            setCache((prev) => ({ ...prev, prev_mitig: data }));
            return data;
          },
          preparacion: async () => {
            await reqPrep.searchGet(mtt, "prep");
            const data = reqPrep?.dataGet;
            setCache((prev) => ({ ...prev, preparacion: data }));
            return data;
          },
          respuesta: async () => {
            await reqRes.searchGet(mtt, "resp");
            const data = reqRes?.dataGet;
            setCache((prev) => ({ ...prev, respuesta: data }));
            return data;
          },
          recuperacion: async () => {
            await reqReq.searchGet(mtt, "recup");
            const data = reqReq?.dataGet;
            setCache((prev) => ({ ...prev, recuperacion: data }));
            return data;
          },
          // Capas geográficas
          poligono: async () => {
            await reqPol.searchPol();
            const data = reqPol.dataPol?.data;
            setCache((prev) => ({ ...prev, poligono: data }));
            return data;
          },
          parroquia: async () => {
            const newData = await cargarDatosParroquia();
            const formattedData = newData?.data || newData;
            setParroquiaData(formattedData);
            setCache((prev) => ({ ...prev, parroquia: formattedData }));
            return formattedData;
          },
          susceptibilidad: async () => {
            const newData = await cargarDatosPol();
            const formattedData = newData?.data?.data || newData?.data || newData;
            setSusceptibilidadData(formattedData);
            setCache((prev) => ({ ...prev, susceptibilidad: formattedData }));
            return formattedData;
          },
          afect_register: async () => {
            const newData = await cargarDatosafec(
              "Todos",
              "Todos",
              "Todos",
              "Todos",
              "Todos",
              "Todos"
            );
            const formattedData = newData?.data || newData;
            setCache((prev) => ({ ...prev, afect_register: formattedData }));
            return formattedData;
          },
        };

        const action = layerActions[layer];
        if (!action) {
          console.warn(`⚠️ Capa desconocida: ${layer}`);
          return null;
        }

        return await action();
      } catch (error) {
        console.error(`❌ Error recargando capa ${layer}:`, error);
        return null;
      }
    },
    [mtt, reqCon_Monit, reqPrev_mitig, reqPrep, reqRes, reqReq, reqPol]
  );

  // ========== FUNCIÓN DE TOGGLE DE CAPAS ==========
  const handleLayerToggle = useCallback(
    async (layer) => {
      const isActivating = !selectedCapa[layer];
      console.log(`🖱️ Toggle capa: ${layer} -> Activando: ${isActivating}`);
      
      setSelectedCapa((prev) => ({ ...prev, [layer]: isActivating }));

      if (isActivating) {
        const currentData = getLayerData(layer);
        const hasData = currentData && 
          (Array.isArray(currentData) ? currentData.length > 0 : true);

        if (!hasData) {
          await handleRefreshLayer(layer);
        }
      }
    },
    [selectedCapa, handleRefreshLayer]
  );

  // ========== GRUPOS DE RECARGA ==========
  const handleRefreshPolygonGroup = useCallback(async () => {
    console.log("🔄 Recargando grupo de LÍMITES Y POLÍGONOS...");
    await Promise.all([
      handleRefreshLayer("poligono"),
      handleRefreshLayer("parroquia"),
    ]);
  }, [handleRefreshLayer]);

  const handleRefreshAnalysisGroup = useCallback(async () => {
    console.log("🔄 Recargando grupo de CAPAS DE ANÁLISIS...");
    await Promise.all([
      handleRefreshLayer("conoc_monit"),
      handleRefreshLayer("prev_mitig"),
      handleRefreshLayer("preparacion"),
      handleRefreshLayer("respuesta"),
      handleRefreshLayer("recuperacion"),
      handleRefreshLayer("afect_register"),
    ]);
  }, [handleRefreshLayer]);

  const handleRefreshSusceptibilidadGroup = useCallback(async () => {
    console.log("🔄 Recargando SUSCEPTIBILIDAD...");
    await handleRefreshLayer("susceptibilidad");
  }, [handleRefreshLayer]);

  // ========== FUNCIONES DE ACCESO A DATOS ==========
  const getLayerData = (layerKey) => {
    const dataMap = {
      // Capas de análisis
      conoc_monit: reqCon_Monit.dataGet?.data || cache.conoc_monit,
      prev_mitig: reqPrev_mitig.dataGet?.data || cache.prev_mitig,
      preparacion: reqPrep.dataGet?.data || cache.preparacion,
      respuesta: reqRes.dataGet?.data || cache.respuesta,
      recuperacion: reqReq.dataGet?.data || cache.recuperacion,
      // Capas geográficas
      poligono: reqPol.dataPol?.data || cache.poligono,
      parroquia: parroquiaData || cache.parroquia,
      susceptibilidad: susceptibilidadData || cache.susceptibilidad,
      afect_register: cache.afect_register,
    };

    const data = dataMap[layerKey] || [];

    //console.log(`Datos obtenidos para capa ${layerKey}:`, data)
    //return Array.isArray(data) ? data : [];
    return data
  };

  const getLayerCount = (layerKey) => {
    const data = getLayerData(layerKey);
    return data?.length || 0;
  };

  const isLoading = (layerKey) => {
    const loads = {
      conoc_monit: reqCon_Monit.loadingGet || false,
      prev_mitig: reqPrev_mitig.loadingGet || false,
      preparacion: reqPrep.loadingGet || false,
      respuesta: reqRes.loadingGet || false,
      recuperacion: reqReq.loadingGet || false,
      poligono: reqPol.loadinPol || false,
      parroquia: loadingParroquia || false,
      susceptibilidad: loadingSusceptibilidad || false,
      afect_register: reqAfectaciones?.loading || false,
    };
    return loads[layerKey] || false;
  };

  // ========== MANEJADORES DE CLICK ==========
  const handleClickCon = (coordenate) => {
    setOpencon(true);
    setCoordinates(coordenate);
  };

  const handleClickPrev= (coordenate) => {
    setOpenPrev(true);
    setCoordinates(coordenate);
  };
  const handleClickPrep= (coordenate) => {
    setOpenPrep(true);
    setCoordinates(coordenate);
  };
  const handleClickRes= (coordenate) => {
    setOpenResp(true);
    setCoordinates(coordenate);
  };
const handleClickRec= (coordenate) => {
    setOpenRec(true);
    setCoordinates(coordenate);
  };
  const handleClickRequerimiento = (coordenate) => {
    console.log("Requerimiento en:", coordenate);
    setCoordinates(coordenate);
  };

  // ========== ESTADOS DERIVADOS ==========
  const activeLayersCount = Object.values(selectedCapa).filter(Boolean).length;
  const totalLayers = Object.keys(selectedCapa).length;

  // ========== RENDER ==========
  return (
    <Grid container spacing={2} sx={{ padding: 2, height: "100vh" }}>
      {/* Sidebar */}
      <Grid size={{ xs: 12, md: 3 }} sx={{ height: "100%", overflowY: "auto" }}>
        <PanelAccion
          mtt={mtt}
          handleRefreshAnalysisGroup={handleRefreshAnalysisGroup}
          handleRefreshPolygonGroup={handleRefreshPolygonGroup}
          handleRefreshSusceptibilidadGroup={handleRefreshSusceptibilidadGroup}
          getLayerCount={getLayerCount}
          isLoading={isLoading}
          selectedCapa={selectedCapa}
          handleLayerToggle={handleLayerToggle}
          handleRefreshLayer={handleRefreshLayer}
          getLayerData={getLayerData}
          totalLayers={totalLayers}
          activeLayersCount={activeLayersCount}
        />
      </Grid>

      {/* Mapa */}
      <Grid size={{ xs: 12, md: 9 }} sx={{ height: "100%" }}>
        <MapMark
          position={[-3.9965787520553717, -79.20168563157956]}
          zoom={13}
          loading={{
            loadingAF: reqCon_Monit.loadingGet || false,
            loadingAC: reqPrev_mitig?.loadingGet || false,
            loadingRE: reqPrep?.loadingGet || false,
            loadingPol: reqPol?.loadinPol || false,
          }}
          dataCon={getLayerData("conoc_monit")}
          dataPrev={getLayerData("prev_mitig")}
          dataPrep={getLayerData("preparacion")}          
          dataRes={getLayerData("respuesta")}          
          dataReq={getLayerData("recuperacion")}
          dataPol={getLayerData("poligono")}
          dataSusceptibilidad={getLayerData("susceptibilidad")}
          dataParroquia={getLayerData("parroquia")}
          dataAfectRegister={getLayerData("afect_register")}
          selectCapa={selectedCapa}
          mtt={mtt}
          layersConfig={[
            {
              key: "conoc_monit",
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
              accion: (coords) => handleClickCon(coords),
            },
            {
              key: "prev_mitig",
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
              accion: (coords) => handleClickPrev(coords),
            },
            {
              key: "preparacion",
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
              accion: (coords) => handleClickRequerimiento(coords),
            },
          ]}
          onRefreshLayer={handleRefreshLayer}
          setCoordinates={setCoordinates}
        />
      </Grid>

      {/* Diálogos */}
      <DialogAccions
        mtt={mtt}
        open={openPrev_mitig}
        dataPol={getLayerData("poligono")}
        coordinates={coordinates}
        member={member}
        length={getLayerCount("prev_mitig")}
        onClose={() => setOpenPrev(false)}
      />
    </Grid>
  );
}

export default BodyPlan;