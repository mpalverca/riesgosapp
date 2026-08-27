import React, { useState, useCallback, createContext, useContext, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { usePlanA } from "./script";
import { useGetPoligonos } from "../script";
import { cargarDatosafec, cargarDatosParroquia } from "../../analisis/afects/script";
import { DialogAccions } from "./inputAcción.jsx";
import { cargarDatosPol } from "../../../components/maps/script/script.js";
import PanelAccion from "./Panel.jsx";
import MapMark from "./Map.jsx";

// ==================== CONTEXT ====================
const BodyPlanContext = createContext(null);

export const useBodyPlan = () => {
  const context = useContext(BodyPlanContext);
  if (!context) {
    throw new Error("useBodyPlan debe usarse dentro de BodyPlanProvider");
  }
  return context;
};

// ==================== PROVIDER ====================
function BodyPlanProvider({ children, mtt, member }) {
  // ========== HOOKS ==========
  const reqCon_Monit = usePlanA();
  const reqPrev_mitig = usePlanA();
  const reqPrep = usePlanA();
  const reqRes = usePlanA();
  const reqReq = usePlanA();
  const reqPol = useGetPoligonos();

  // ========== ESTADOS DE CARGA ==========
  const [loadingStates, setLoadingStates] = useState({
    parroquia: false,
    susceptibilidad: false,
    afectaciones: false,
  });

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
    conoc_monit: false,
    prev_mitig: false,
    preparacion: false,
    respuesta: false,
    recuperacion: false,
    poligono: false,
    parroquia: false,
    susceptibilidad: false,
    afect_register: false,
  });

  // ========== DIÁLOGOS ==========
  const [dialogs, setDialogs] = useState({
    conoc_monit: false,
    prev_mitig: false,
    preparacion: false,
    respuesta: false,
    recuperacion: false,
  });

  const [coordinates, setCoordinates] = useState(null);
  const [zoomCoord, setZoomCoord] = useState(null);
  const [shouldZoom, setShouldZoom] = useState(false);

  // ========== FUNCIONES DE CARGA ==========
  const loadParroquiaData = useCallback(async () => {
    if (cache.parroquia) return cache.parroquia;

    setLoadingStates(prev => ({ ...prev, parroquia: true }));
    try {
      const result = await cargarDatosParroquia();
      const data = result?.data || result;
      setCache(prev => ({ ...prev, parroquia: data }));
      return data;
    } catch (error) {
      console.error("Error cargando parroquias:", error);
      return [];
    } finally {
      setLoadingStates(prev => ({ ...prev, parroquia: false }));
    }
  }, [cache.parroquia]);

  const loadSusceptibilidadData = useCallback(async () => {
    if (cache.susceptibilidad) return cache.susceptibilidad;

    setLoadingStates(prev => ({ ...prev, susceptibilidad: true }));
    try {
      const result = await cargarDatosPol();
      const data = result?.data?.data || result?.data || result;
      setCache(prev => ({ ...prev, susceptibilidad: data }));
      return data;
    } catch (error) {
      console.error("Error cargando susceptibilidad:", error);
      return [];
    } finally {
      setLoadingStates(prev => ({ ...prev, susceptibilidad: false }));
    }
  }, [cache.susceptibilidad]);

  // ========== FUNCIÓN PRINCIPAL DE RECARGA ==========
  const refreshLayer = useCallback(async (layer) => {
    try {
      const layerActions = {
        conoc_monit: async () => {
          await reqCon_Monit.searchAccion("Conoc_Monit");
          const data = reqCon_Monit?.dataGet;
          setCache(prev => ({ ...prev, conoc_monit: data }));
          return data;
        },
        prev_mitig: async () => {
          await reqPrev_mitig.searchAccion("prev_mit");
          const data = reqPrev_mitig?.dataGet;
          setCache(prev => ({ ...prev, prev_mitig: data }));
          return data;
        },
        preparacion: async () => {
          await reqPrep.searchAccion("prep");
          const data = reqPrep?.dataGet;
          setCache(prev => ({ ...prev, preparacion: data }));
          return data;
        },
        respuesta: async () => {
          await reqRes.searchAccion("resp");
          const data = reqRes?.dataGet;
          setCache(prev => ({ ...prev, respuesta: data }));
          return data;
        },
        recuperacion: async () => {
          await reqReq.searchAccion("recup");
          const data = reqReq?.dataGet;
          setCache(prev => ({ ...prev, recuperacion: data }));
          return data;
        },
        poligono: async () => {
          await reqPol.searchPol();
          const data = reqPol.dataPol?.data;
          setCache(prev => ({ ...prev, poligono: data }));
          return data;
        },
        parroquia: loadParroquiaData,
        susceptibilidad: loadSusceptibilidadData,
        afect_register: async () => {
          setLoadingStates(prev => ({ ...prev, afectaciones: true }));
          try {
            const result = await cargarDatosafec(
              "Todos",
              "Todos",
              "Todos",
              "Todos",
              "Todos",
              "Todos"
            );
            const data = result?.data || result;
            setCache(prev => ({ ...prev, afect_register: data }));
            return data;
          } finally {
            setLoadingStates(prev => ({ ...prev, afectaciones: false }));
          }
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
  }, [
    reqCon_Monit,
    reqPrev_mitig,
    reqPrep,
    reqRes,
    reqReq,
    reqPol,
    loadParroquiaData,
    loadSusceptibilidadData,
  ]);

  // ========== TOGGLE DE CAPAS ==========
  const toggleLayer = useCallback(async (layer) => {
    const isActivating = !selectedCapa[layer];
    setSelectedCapa(prev => ({ ...prev, [layer]: isActivating }));

    if (isActivating) {
      const data = getLayerData(layer);
      const hasData = data && (Array.isArray(data) ? data.length > 0 : true);
      if (!hasData) {
        await refreshLayer(layer);
      }
    }
  }, [selectedCapa, refreshLayer]);

  // ========== GRUPOS DE RECARGA ==========
  const refreshGroup = useCallback(async (group) => {
    const groups = {
      polygon: ["poligono", "parroquia"],
      analysis: ["conoc_monit", "prev_mitig", "preparacion", "respuesta", "recuperacion", "afect_register"],
      susceptibility: ["susceptibilidad"],
    };

    const layers = groups[group] || [];
    console.log(`🔄 Recargando grupo: ${group}`);
    await Promise.all(layers.map(layer => refreshLayer(layer)));
  }, [refreshLayer]);

  // ========== ACCESO A DATOS ==========
  const getLayerData = useCallback((layerKey) => {
    // Mapeo directo de fuentes de datos
    const dataSources = {
      conoc_monit: reqCon_Monit.dataGet?.data || cache.conoc_monit,
      prev_mitig: reqPrev_mitig.dataGet?.data || cache.prev_mitig,
      preparacion: reqPrep.dataGet?.data || cache.preparacion,
      respuesta: reqRes.dataGet?.data || cache.respuesta,
      recuperacion: reqReq.dataGet?.data || cache.recuperacion,
      poligono: reqPol.dataPol?.data || cache.poligono,
      parroquia: cache.parroquia,
      susceptibilidad: cache.susceptibilidad,
      afect_register: cache.afect_register,
    };

    return dataSources[layerKey] || [];
  }, [
    reqCon_Monit,
    reqPrev_mitig,
    reqPrep,
    reqRes,
    reqReq,
    reqPol,
    cache
  ]);

  const getLayerCount = useCallback((layerKey) => {
    const data = getLayerData(layerKey);
    return data?.length || 0;
  }, [getLayerData]);

  const isLoading = useCallback((layerKey) => {
    const loads = {
      conoc_monit: reqCon_Monit.loadingGet || false,
      prev_mitig: reqPrev_mitig.loadingGet || false,
      preparacion: reqPrep.loadingGet || false,
      respuesta: reqRes.loadingGet || false,
      recuperacion: reqReq.loadingGet || false,
      poligono: reqPol.loadinPol || false,
      parroquia: loadingStates.parroquia,
      susceptibilidad: loadingStates.susceptibilidad,
      afect_register: loadingStates.afectaciones,
    };
    return loads[layerKey] || false;
  }, [
    reqCon_Monit,
    reqPrev_mitig,
    reqPrep,
    reqRes,
    reqReq,
    reqPol,
    loadingStates
  ]);

  // ========== MANEJADORES DE CLICK ==========
  const handleLayerClick = useCallback((layer, coords) => {
    setCoordinates(coords);
    setDialogs(prev => ({ ...prev, [layer]: true }));
  }, []);

  const handleCloseDialog = useCallback((layer) => {
    setDialogs(prev => ({ ...prev, [layer]: false }));
  }, []);

  // ========== ZOOM ==========
  const handleZoomToLocation = useCallback((lat, lng) => {
    setZoomCoord({ lat, lng });
    setShouldZoom(true);
    setTimeout(() => setShouldZoom(false), 100);
  }, []);

  // ========== ESTADOS DERIVADOS ==========
  const activeLayersCount = useMemo(
    () => Object.values(selectedCapa).filter(Boolean).length,
    [selectedCapa]
  );

  const totalLayers = useMemo(
    () => Object.keys(selectedCapa).length,
    []
  );

  // ========== CONFIGURACIÓN DE CAPAS ==========
  const layersConfig = useMemo(() => [
    {
      key: "conoc_monit",
      label: "Afectaciones",
      icon: <Box component="span" sx={{ width: 20, height: 20, bgcolor: "#e6101b", borderRadius: "50%" }} />,
      color: "#e6101b",
    },
    {
      key: "prev_mitig",
      label: "Acciones",
      icon: <Box component="span" sx={{ width: 20, height: 20, bgcolor: "#ff8c00", borderRadius: "50%" }} />,
      color: "#ff8c00",
    },
    {
      key: "preparacion",
      label: "Requerimientos",
      icon: <Box component="span" sx={{ width: 20, height: 20, bgcolor: "#228b22", borderRadius: "50%" }} />,
      color: "#228b22",
    },
  ], []);

  // ========== VALUE DEL CONTEXT ==========
  const contextValue = useMemo(() => ({
    // Datos
    getLayerData,
    getLayerCount,
    isLoading,
    selectedCapa,
    activeLayersCount,
    totalLayers,
    cache,
    setCache,
    member,
    mtt,
    coordinates,
    zoomCoord,
    shouldZoom,
    layersConfig,

    // Acciones
    toggleLayer,
    refreshLayer,
    refreshGroup,
    handleLayerClick,
    handleCloseDialog,
    handleZoomToLocation,
    setCoordinates,
  }), [
    getLayerData,
    getLayerCount,
    isLoading,
    selectedCapa,
    activeLayersCount,
    totalLayers,
    cache,
    setCache,
    member,
    mtt,
    coordinates,
    zoomCoord,
    shouldZoom,
    layersConfig,
    toggleLayer,
    refreshLayer,
    refreshGroup,
    handleLayerClick,
    handleCloseDialog,
    handleZoomToLocation,
    setCoordinates,
  ]);

  return (
    <BodyPlanContext.Provider value={contextValue}>
      {children}
    </BodyPlanContext.Provider>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================
function BodyPlan({ mtt, member }) {
  return (
    <BodyPlanProvider mtt={mtt} member={member}>
      <BodyPlanContent />
    </BodyPlanProvider>
  );
}

// ==================== CONTENIDO ====================
function BodyPlanContent() {
  const {
    getLayerData,
    getLayerCount,
    isLoading,
    selectedCapa,
    activeLayersCount,
    totalLayers,
    member,
    mtt,
    coordinates,
    zoomCoord,
    shouldZoom,
    layersConfig,
    toggleLayer,
    refreshLayer,
    refreshGroup,
    handleLayerClick,
    handleCloseDialog,
    handleZoomToLocation,
    setCoordinates,
  } = useBodyPlan();

  // Función helper para obtener diálogo abierto
  const isDialogOpen = (layer) => {
    // Implementar según necesidad
    return false;
  };

  return (
    <Grid container spacing={2} sx={{ padding: 0.5, height: "100vh" }}>
      {/* Sidebar */}
      <Grid size={{ xs: 12, md: 3 }} sx={{ height: "100%", overflowY: "auto" }}>
        <PanelAccion
          mtt={mtt}
          handleRefreshAnalysisGroup={() => refreshGroup("analysis")}
          handleRefreshPolygonGroup={() => refreshGroup("polygon")}
          handleRefreshSusceptibilidadGroup={() => refreshGroup("susceptibility")}
          getLayerCount={getLayerCount}
          isLoading={isLoading}
          selectedCapa={selectedCapa}
          handleLayerToggle={toggleLayer}
          handleRefreshLayer={refreshLayer}
          getLayerData={getLayerData}
          totalLayers={totalLayers}
          activeLayersCount={activeLayersCount}
          onZoomCoord={handleZoomToLocation}
        />
      </Grid>

      {/* Mapa */}
      <Grid size={{ xs: 12, md: 9 }} sx={{ height: "100%" }}>
        <MapMark
          position={[-3.9965787520553717, -79.20168563157956]}
          zoom={13}
          loading={{
            loadingAF: isLoading("conoc_monit"),
            loadingAC: isLoading("prev_mitig"),
            loadingRE: isLoading("preparacion"),
            loadingPol: isLoading("poligono"),
          }}
          member={member}
          dataCon={getLayerData("conoc_monit")}
          dataPrev={getLayerData("prev_mitig")}
          dataPrep={getLayerData("preparacion")}
          dataRes={getLayerData("respuesta")}
          dataReq={getLayerData("recuperacion")}
          dataPol={getLayerData("poligono")}
          dataSusceptibilidad={getLayerData("susceptibilidad")}
          dataParroquia={getLayerData("parroquia")}
          dataAfectRegister={getLayerData("afect_register")}
          setCache={useBodyPlan().setCache}
          selectCapa={selectedCapa}
          mtt={mtt}
          layersConfig={layersConfig.map(config => ({
            ...config,
            accion: (coords) => handleLayerClick(config.key, coords),
          }))}
          onRefreshLayer={refreshLayer}
          setCoordinates={setCoordinates}
          zoomCoord={zoomCoord}
          shouldZoom={shouldZoom}
        />
      </Grid>

      {/* Diálogos - Simplificado con mapeo */}
      {layersConfig.map(({ key, label }) => (
        <DialogAccions
          key={key}
          mtt={mtt}
          open={isDialogOpen(key)}
          dataPol={getLayerData("poligono")}
          coordinates={coordinates}
          member={member}
          length={getLayerCount(key)}
          onClose={() => handleCloseDialog(key)}
        />
      ))}
    </Grid>
  );
}

export default BodyPlan;