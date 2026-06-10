import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Skeleton
} from "@mui/material";
import { useRecursos } from "./script";
import { TableRH } from "./tablesView";

// Configuración centralizada de recursos
const RESOURCES_CONFIG = {
  recursos_humanos: {
    label: "Recursos Humanos",
    tables: {
      PMH: "PERSONAL MÉDICO HOSPITALARIO",
      PAH: "PERSONAL PARA ATENCIÓN PRE HOSPITALARIA",
      PAR: "PERSONAL PARA ACCIONES DE RESCATE",
      PPCS: "PERSONAL PATRULLAS DE CAMINO Y SEGURIDAD VIAL",
      PCF: "PERSONAL DE COMBATE FUEGO",
      PT: "PERSONAL DE TELECOMUNICACIONES",
      PED: "PERSONAL PARA EVALUACIÓN DE DAÑOS",
      PSSC: "PERSONAL DE SALA DE SITUACIONES Y CONTIGENCIA",
      PMOSV: "PERSONAL PARA MANTENER EL ORDEN Y SEGURIDAD VIAL",
      SRCT: "SUPERVISORES DE REGULACIÓN Y CONTROL TURISTICO",
      PUM: "PERSONAL DE UNIDADES DE MONITOREO",
      PAL: "PERSONAL DE APOYO LOGISTICO",
      PO: "PERSONAL OPERATIVO",
      CH: "CHOFERES",
      OMP: "OPERADORES DE MAQUINARIA PESADA",
      AM: "AYUDANTES DE MAQUINARIA",
      PSCB: "PERSONAL PARA SEGURIDAD Y CUSTODIO DE BIENES",
      CEBA: "CONTROL DE EXPENDIO DE BEBIDAS ALCOHOLICAS",
      V: "VOLUNTARIOS",
      VCR: "VOLUNTARIO CRUZ ROJA",
      OT: "OTROS",
      Tps: "TOTAL PARCIAL INSTITUCIONAL"
    }
  },
  parque_automotor: {
    label: "Parque Automotor",
    tables: {
      Amb: "AMBULANCIAS",
      Vh_r: "VEHÍCULOS DE RESCATE",
      Vh_H: "VEHÍCULOS HOWO",
      Ptr: "PATRULLEROS",
      Cm: "CAMIONETAS",
      Cam: "CAMIÓN",
      Bss: "BUSES",
      Trls: "TRAILER",
      Mt: "MOTOS",
      Tq: "TANQUEROS",
      Mb: "MOTOBOMBAS",
      Vh_a_e: "VEHICULO DE APOYO Y EVALUACIÓN",
      M_p: "MAQUINARIA PESADA",
      Hhs: "HIDROSUCCIONADOR",
      Eq_p_v: "EQUIPO PARA PATRULLAJE DE VIAS",
      R_c_s: "ROLLOS DE CINTA DE SEGURIDAD",
      Wich: "WINCHA",
      I_C_H: "INSTALACIONES / CUARTELES / HOSPITALES",
      C_v_v: "CAMARAS DE VIDEO VIGILANCIA",
      Tps: "TOTAL PARCIAL INSTITUCIONAL"
    }
  },
  recursos_materiales: {
    label: "Recursos Materiales",
    tables: {
      Cu: "CUERDAS",
      CS: "CHALECO SALVAVIDAS",
      CPM: "CAMILLAS",
      Esc: "ESCALERAS",
      T_r: "TABLAS RÍGIDAS",
      Eq_r: "EQUIPOS DE RESCATE",
      Eq_r_esp: "EQUIPOS RESCATE ESPACIOS CONFINADOS",
      KIT_PA: "KITS DE PRIMEROS AUXILIOS",
      T_o: "TANQUES DE OXIGENO",
      Eq_cf: "EQUIPOS COMBATE FUEGO",
      Btf: "BATEFUEGOS",
      Asd: "ASADONES",
      Rs: "RASTRILLOS",
      Eq_in_Fs: "EQUIPOS INCENDIOS FORESTALES",
      Eq_resp: "EQUIPOS DE RESPIRACIÓN",
      MTo: "MOTOSIERRA",
      Mch: "MACHETES",
      RS: "RADIOS",
      Ca: "CARPAS",
      Frz: "FRAZADAS",
      Otr: "OTROS",
      Tps: "TOTAL PARCIAL INSTITUCIONAL"
    }
  }
};

const OPTIONS = [
  { value: "recursos_humanos", label: "👥 Recursos Humanos" },
  { value: "parque_automotor", label: "🚗 Parque Automotor" },
  { value: "recursos_materiales", label: "🔧 Recursos Materiales" }
];

// Componente de carga optimizado
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, gap: 2 }}>
    <CircularProgress size={32} />
    <Typography variant="body1" color="textSecondary">
      Cargando datos...
    </Typography>
  </Box>
);

// Componente de estado vacío
const EmptyState = ({ message }) => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="body1" color="textSecondary" gutterBottom>
      📭 {message}
    </Typography>
    <Typography variant="caption" color="textSecondary">
      Selecciona una categoría para cargar los datos
    </Typography>
  </Box>
);

// Componente de depuración (solo desarrollo)
const DebugInfo = ({ dataState, loadingCategory }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
      <Typography variant="caption" color="textSecondary" component="pre" sx={{ fontFamily: 'monospace', fontSize: 11 }}>
        Debug: RH: {dataState.recursos_humanos.length} | 
        PA: {dataState.parque_automotor.length} | 
        RM: {dataState.recursos_materiales.length} | 
        Cargando: {loadingCategory || 'ninguna'}
      </Typography>
    </Box>
  );
};

export const VisualRecursos = ({ mtt }) => {
  const [selectedOption, setSelectedOption] = useState("recursos_humanos");
  const { loadingRE, errorRE, dataRE, searchRE } = useRecursos();
  
  // Estado unificado para los datos
  const [dataState, setDataState] = useState({
    recursos_humanos: [],
    parque_automotor: [],
    recursos_materiales: []
  });
  
  const [loadingCategory, setLoadingCategory] = useState(null);

  // Actualizar datos cuando llegan del API
  useEffect(() => {
    if (!dataRE || !loadingCategory) return;
    
    setDataState(prev => ({
      ...prev,
      [loadingCategory]: dataRE
    }));
    setLoadingCategory(null);
  }, [dataRE, loadingCategory]);

  // Obtener códigos de recursos únicos
  const getResourceCodes = useCallback((data) => {
    if (!data?.length) return [];
    
    const codes = new Set();
    data.forEach(item => {
      if (item && typeof item === "object") {
        Object.keys(item).forEach(key => {
          if (!["_columna", "MTT", "hoja"].includes(key)) {
            codes.add(key);
          }
        });
      }
    });
    return Array.from(codes).sort();
  }, []);

  // Manejar cambio de opción
  const handleOptionChange = useCallback((event) => {
    const newOption = event.target.value;
    setSelectedOption(newOption);
    
    // Solo buscar si no tenemos datos locales
    if (dataState[newOption]?.length === 0) {
      setLoadingCategory(newOption);
      searchRE(mtt, newOption);
    }
  }, [dataState, mtt, searchRE]);

  // Obtener datos actuales
  const currentData = useMemo(() => dataState[selectedOption], [dataState, selectedOption]);
  const currentConfig = RESOURCES_CONFIG[selectedOption];
  const isLoading = loadingRE && loadingCategory === selectedOption;
  const hasError = errorRE && loadingCategory === selectedOption;
  const hasData = currentData?.length > 0;

  // Renderizar contenido principal
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (hasError) {
      return (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => {}}>
          Error al cargar datos: {errorRE || "Error desconocido"}
        </Alert>
      );
    }
    if (!hasData) {
      return <EmptyState message={`No hay datos disponibles para ${currentConfig?.label || selectedOption}`} />;
    }

    const resourceCodes = getResourceCodes(currentData);
    return (
      <TableRH 
        resourceCodes={resourceCodes}
        dataRE={currentData}
        resourceNames={currentConfig.tables}
      />
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="medium">
        📊 Recursos para {mtt || "MTT no especificado"}
      </Typography>
      
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <RadioGroup 
          row 
          value={selectedOption} 
          onChange={handleOptionChange}
          sx={{ gap: 1 }}
        >
          {OPTIONS.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio size="small" />}
              label={option.label}
              sx={{
                m: 0,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Paper variant="outlined" sx={{ p: 2, minHeight: 400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="medium">
            {currentConfig?.label}
            {hasData && ` (${currentData.length} registros)`}
          </Typography>
          {isLoading && <CircularProgress size={20} />}
        </Box>
        
        {renderContent()}
        <DebugInfo dataState={dataState} loadingCategory={loadingCategory} />
      </Paper>
    </Box>
  );
};

export default VisualRecursos;