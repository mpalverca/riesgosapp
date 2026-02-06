import React, { useEffect, useState } from "react";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from "@mui/material";
import { useRecursos } from "./script";
import { TableRH, TablePA, TableRM } from "./tablesView";

// Definir tablas primero para que estén disponibles
const recursosHumanos = {
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
  OT: "OTROS (Evaluadores de llamadas y video vigilancia)",
  Tps: "TOTAL PARCIAL INSTITUCIONAL"
};

const parqueAutomotor = {
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
  I_C_H: "INSTALACIONES / CUARTELES / HOSPITALES / CENTROS DE SALUD",
  C_v_v: "CAMARAS DE VIDEO VIGILANCIA",
  Tps: "TOTAL PARCIAL INSTITUCIONAL"
};

const recursosMateriales = {
  Cu: "CUERDAS",
  CS: "CHALECO SALVAVIDAS",
  CPM: "CAMILLAS (PLEGABLES DE ESTRUTURA MDF Y CAMILLA ESTRUCTURA TUBULAR)",
  Esc: "ESCALERAS",
  T_r: "TABLAS RÍGIDAS",
  Eq_r: "EQUIPOS DE RESCATE",
  Eq_r_esp: "EQUIPOS RESCATE ESPC. CONFINADOS",
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
  Otr: "OTROS (Conos, vallas de Seguridad)",
  Tps: "TOTAL PARCIAL INSTITUCIONAL"
};

const options = [
  { value: "recursos_humanos", label: "Recursos Humanos" },
  { value: "parque_automotor", label: "Parque Automotor" },
  { value: "recursos_materiales", label: "Recursos Materiales" },
];

// Objeto para mapear opciones a sus tablas de nombres
const resourceTables = {
  recursos_humanos: recursosHumanos,
  parque_automotor: parqueAutomotor,
  recursos_materiales: recursosMateriales
};


export const VisualRecursos = ({ mtt }) => {
  const [selectedOption, setSelectedOption] = useState("recursos_humanos");
  const { loadingRE, errorRE, dataRE, searchRE } = useRecursos();
  
  // Almacenamiento separado para cada categoría
  const [rec_hum, setRecursosHumanos] = useState([]);
  const [parq_auth, setParqueAh] = useState([]);
  const [rec_mat, setReqMat] = useState([]);
  
  // Estado para controlar qué categoría se está cargando actualmente
  const [loadingCategory, setLoadingCategory] = useState(null);

  // Efecto CORREGIDO: Solo actualizar el estado correspondiente cuando se carga nueva data
  useEffect(() => {
    if (!dataRE || !Array.isArray(dataRE) || dataRE.length === 0 || !loadingCategory) {
      return;
    }

    console.log(`Guardando ${dataRE.length} registros para ${loadingCategory}`);
    
    // Guardar los datos en el estado correspondiente a la categoría que se cargó
    switch (loadingCategory) {
      case "recursos_humanos":
        setRecursosHumanos(dataRE);
        break;
      case "parque_automotor":
        setParqueAh(dataRE);
        break;
      case "recursos_materiales":
        setReqMat(dataRE);
        break;
      default:
        break;
    }
    
    // Resetear la categoría de carga
    setLoadingCategory(null);
  }, [dataRE, loadingCategory]);

  // Función para obtener resourceCodes de forma segura
  const getResourceCodes = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    const allResourceCodes = new Set();
    data.forEach((item) => {
      if (item && typeof item === "object") {
        Object.keys(item).forEach((key) => {
          if (key !== "_columna" && key !== "MTT" && key !== "hoja") {
            allResourceCodes.add(key);
          }
        });
      }
    });
    
    return Array.from(allResourceCodes).sort();
  };

  // Manejar cambio de opción - CORREGIDO
  const handleOptionChange = (event) => {
    const newOption = event.target.value;
    setSelectedOption(newOption);
    
    // Verificar si ya tenemos datos para esta opción
    let hasLocalData = false;
    
    switch (newOption) {
      case "recursos_humanos":
        hasLocalData = rec_hum.length > 0;
        break;
      case "parque_automotor":
        hasLocalData = parq_auth.length > 0;
        break;
      case "recursos_materiales":
        hasLocalData = rec_mat.length > 0;
        break;
    }
    
    console.log(`Cambiando a ${newOption}:`, {
      hasLocalData,
      selectedOption: newOption
    });
    
    // Solo buscar si no tenemos datos locales
    if (!hasLocalData) {
      console.log(`Buscando datos para ${newOption}...`);
      setLoadingCategory(newOption); // Marcar qué categoría se está cargando
      searchRE(mtt, newOption);
    }
  };

  // Obtener datos actuales de forma segura
  const getCurrentData = () => {
    switch (selectedOption) {
      case "recursos_humanos":
        return rec_hum;
      case "parque_automotor":
        return parq_auth;
      case "recursos_materiales":
        return rec_mat;
      default:
        return [];
    }
  };

  // Verificar si estamos cargando para la categoría actual
  const isLoadingCurrentCategory = loadingRE && loadingCategory === selectedOption;

  // Renderizar contenido según estado
  const renderContent = () => {
    const currentData = getCurrentData();
    
    // Mostrar carga solo si es para la categoría actual
    if (isLoadingCurrentCategory) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Cargando datos...</Typography>
        </Box>
      );
    }

    if (errorRE && loadingCategory === selectedOption) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Error al cargar datos: {errorRE || "Error desconocido"}
        </Alert>
      );
    }

    // Verificar si hay datos para mostrar
    if (!currentData || currentData.length === 0) {
      return (
        <Typography sx={{ p: 3, textAlign: 'center' }}>
          No hay datos disponibles para {options.find(opt => opt.value === selectedOption)?.label}.
          <br />
          <small>Selecciona una opción para cargar los datos.</small>
        </Typography>
      );
    }

    // Obtener resourceCodes para la tabla
    const resourceCodes = getResourceCodes(currentData);
    const resourceNames = resourceTables[selectedOption];
    
    // Renderizar la tabla correspondiente - CORREGIDO
    switch (selectedOption) {
      case "recursos_humanos":
        return (
          <TableRH 
            resourceCodes={resourceCodes} 
            dataRE={currentData} 
            resourceNames={resourceNames}
          />
        );
      case "parque_automotor":
        return (
          <TableRH  // CORRECCIÓN: Usar TablePA en lugar de TableRH
            resourceCodes={resourceCodes} 
            dataRE={currentData} 
            resourceNames={resourceNames}
          />
        );
      case "recursos_materiales":
        return (
          <TableRH  // CORRECCIÓN: Usar TableRM en lugar de TableRH
            resourceCodes={resourceCodes} 
            dataRE={currentData} 
            resourceNames={resourceNames}
          />
        );
      default:
        return <Typography>Selecciona un tipo de recurso</Typography>;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tipo de Recurso - MTT: {mtt || "No especificado"}
      </Typography>
      
      <FormControl component="fieldset">
        <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          {options.find((opt) => opt.value === selectedOption)?.label}
          {getCurrentData().length > 0 && ` (${getCurrentData().length} registros)`}
        </Typography>
        
        {renderContent()}
        
        {/* DEBUG: Mostrar estado de las categorías */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Debug: RH: {rec_hum.length} | PA: {parq_auth.length} | RM: {rec_mat.length} | 
              Cargando: {loadingCategory || 'ninguna'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
