import { Box, Grid, Typography, Paper, Alert } from "@mui/material";
import Panels from "../../../components/panels/Panels";
import { Layers as LayersIcon } from "@mui/icons-material";
import LayerGroup from "../canton/body_accion/LayerGroup";
import LayerControl from "../canton/body_accion/LayerControl";

// ========== FUNCIÓN AUXILIAR PARA EXTRAER DATOS ==========
const extractDataArray = (data) => {
  // Si es null o undefined
  if (!data) return [];

  // Si ya es un array, devolverlo
  if (Array.isArray(data)) return data;

  // Si es un objeto con propiedad 'datos' que es array
  if (data.datos && Array.isArray(data.datos)) return data.datos;

  // Si es un objeto con propiedad 'data' que es array
  if (data.data && Array.isArray(data.data)) return data.data;

  // Si es un objeto plano, devolverlo como array de un elemento o array vacío
  if (typeof data === "object") {
    // Si tiene keys, podría ser un objeto con datos
    return Object.keys(data).length > 0 ? [data] : [];
  }

  return [];
};

// ========== CONFIGURACIONES DE CAPAS ==========
const LAYER_CONFIGS = {
  // Grupo 1: Ubicación y Límites
  parroquia: {
    label: "Límites parroquiales",
    icon: { bgcolor: "#4caf50", borderRadius: 0.5 },
    color: "#4caf50",
    bgColor: "#e8f5e9",
    getCount: (getLayerCount) => getLayerCount("parroquia"),
    isLoading: (isLoading) => isLoading("parroquia"),
    isSelected: (selectedCapa) => selectedCapa.parroquia,
    onToggle: (handleLayerToggle) => () => handleLayerToggle("parroquia"),
    onRefresh: (handleRefreshLayer) => () => handleRefreshLayer("parroquia"),
  },
  sectorial: {
    label: "Límites Sectoriales",
    icon: { bgcolor: "#4c5baf", borderRadius: 0.5 },
    color: "#4caf50",
    bgColor: "#e8f5e9",
    getCount: (getLayerCount) => getLayerCount("parroquia"),
    isLoading: (isLoading) => isLoading("parroquia"),
    isSelected: (selectedCapa) => selectedCapa.parroquia,
    onToggle: (handleLayerToggle) => () => handleLayerToggle("parroquia"),
    onRefresh: (handleRefreshLayer) => () => handleRefreshLayer("parroquia"),
  },

  // Grupo 2: Acciones del MTT
  conoc_monit: {
    label: "Conocimiento y Monitoreo",
    icon: { bgcolor: "#42e610", borderRadius: "50%" },
    color: "#10e61b",
    bgColor: "#ffe6e6",
    getCount: (getLayerCount) => getLayerCount("conoc_monit"),
    isLoading: (isLoading) => isLoading("conoc_monit"),
    isSelected: (selectedCapa) => selectedCapa.conoc_monit,
    onToggle: (handleLayerToggle) => () => handleLayerToggle("conoc_monit"),
    onRefresh: (handleRefreshLayer) => () => handleRefreshLayer("conoc_monit"),
  },
  prev_mitig: {
    label: "Prevención y Mitigación",
    icon: { bgcolor: "#ff8c00", borderRadius: "50%" },
    color: "#ff8c00",
    bgColor: "#fff3e0",
    getCount: (getLayerCount) => getLayerCount("prev_mitig"),
    isLoading: (isLoading) => isLoading("prev_mitig"),
    isSelected: (selectedCapa) => selectedCapa.prev_mitig,
    onToggle: (handleLayerToggle) => () => handleLayerToggle("prev_mitig"),
    onRefresh: (handleRefreshLayer) => () => handleRefreshLayer("prev_mitig"),
  },
  preparacion: {
    label: "Preparación",
    icon: { bgcolor: "#ff8c00", borderRadius: "50%" },
    color: "#ff8c00",
    bgColor: "#fff3e0",
    getCount: (getLayerCount) => getLayerCount("preparacion"),
    isLoading: (isLoading) => isLoading("preparacion"),
    isSelected: (selectedCapa) => selectedCapa.preparacion,
    onToggle: (handleLayerToggle) => () => handleLayerToggle("preparacion"),
    onRefresh: (handleRefreshLayer) => () => handleRefreshLayer("preparacion"),
  },
  respuesta: {
    label: "Respuesta",
    icon: { bgcolor: "#ff8c00", borderRadius: "50%" },
    color: "#ff8c00",
    bgColor: "#fff3e0",
    getCount: (getLayerCount) => getLayerCount("respuesta"),
    isLoading: (isLoading) => isLoading("respuesta"),
    isSelected: (selectedCapa) => selectedCapa.respuesta,
    onToggle: (handleLayerToggle) => () => handleLayerToggle("respuesta"),
    onRefresh: (handleRefreshLayer) => () => handleRefreshLayer("respuesta"),
  },
  recuperacion: {
    label: "Recuperación",
    icon: { bgcolor: "#ff8c00", borderRadius: "50%" },
    color: "#ff8c00",
    bgColor: "#fff3e0",
    getCount: (getLayerCount) => getLayerCount("recuperacion"),
    isLoading: (isLoading) => isLoading("recuperacion"),
    isSelected: (selectedCapa) => selectedCapa.recuperacion,
    onToggle: (handleLayerToggle) => () => handleLayerToggle("recuperacion"),
    onRefresh: (handleRefreshLayer) => () => handleRefreshLayer("recuperacion"),
  },

  // Grupo 3: Capas de análisis
  afect_register: {
    label: "Afectaciones registradas",
    icon: { bgcolor: "#ff8c00", borderRadius: 0.5 },
    color: "#ff8c00",
    bgColor: "#fff3e0",
    getCount: (getLayerCount) => getLayerCount("afect_register"),
    isLoading: (isLoading) => isLoading("afect_register"),
    isSelected: (selectedCapa) => selectedCapa.afect_register,
    onToggle: (handleLayerToggle) => () => handleLayerToggle("afect_register"),
    onRefresh: (handleRefreshLayer) => () =>
      handleRefreshLayer("afect_register"),
  },

  // Grupo 4: Susceptibilidad
  susceptibilidad: {
    label: "Zonas de susceptibilidad",
    icon: { bgcolor: "#228b22", borderRadius: 0.5 },
    color: "#228b22",
    bgColor: "#e8f5e9",
    getCount: (getLayerCount) => getLayerCount("susceptibilidad"),
    isLoading: (isLoading) => isLoading("susceptibilidad"),
    isSelected: (selectedCapa) => selectedCapa.susceptibilidad,
    onToggle: (handleLayerToggle) => () => handleLayerToggle("susceptibilidad"),
    onRefresh: (handleRefreshLayer) => () =>
      handleRefreshLayer("susceptibilidad"),
  },
};

// ========== COMPONENTES REUTILIZABLES ==========
const StatusIndicator = ({ activeLayersCount, totalLayers }) => (
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
);

const ParroquiaDetails = ({ getLayerData, getLayerCount }) => {
  const data = extractDataArray(getLayerData("parroquia"));

  return (
    <>
      <Typography variant="caption" color="text.secondary">
        Total de parroquias cargadas: {data.length}
        <br />
      </Typography>
      {data.slice(0, 5).map((item, index) => (
        <Typography key={index} variant="caption" color="text.secondary">
          {item.DPA_DESPAR || item.nombre || `Parroquia ${index + 1}`}
          <br />
        </Typography>
      ))}
      {data.length > 5 && (
        <Typography variant="caption" color="text.secondary">
          ... y {data.length - 5} más
        </Typography>
      )}
    </>
  );
};

const ActionDetails = ({ layerKey, getLayerData, getLayerCount }) => {
  const fullData = getLayerData(layerKey);
  const data = extractDataArray(fullData);

  // Estadísticas de estado
  const vigente = data.filter(
    (item) => item.estado?.toLowerCase() === "vigente",
  ).length;
  const finalizada = data.filter((item) => {
    const estado = item.estado?.toLowerCase();
    return estado === "finalizada" || estado === "finalizado";
  }).length;

  return (
    <>
      <Typography variant="caption" color="text.secondary">
        Registros de Acciones: {data.length}
      </Typography>
      {/* Mostrar objetivo si existe en el objeto principal */}
      {fullData?.objetivo && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.5 }}
        >
          {/*  🎯 {fullData.objetivo.substring(0, 100)}... */}
          {fullData.objetivo}
        </Typography>
      )}

      <Typography
        variant="caption"
        color="primary"
        sx={{ display: "block", cursor: "pointer", mt: 0.5 }}
      >
        Última actualización: {new Date().toLocaleTimeString()}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}
      >
        📊 <strong style={{ color: "#2e7d32" }}>Vigente:</strong> {vigente} |
        <strong style={{ color: "#757575" }}> Finalizada:</strong> {finalizada}{" "}
        |<strong> Total:</strong> {data.length}
      </Typography>

      {/* Mostrar primeros 3 registros como ejemplo */}
      {data./* slice(0, 3). */ map((item, index) => (
        <Typography
          key={index}
          sx={{ borderRadius: 2, border: "1px solid #1240da" }}
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", pl: 2 }}
        >
          • {item.accion || item.descripcion || `Registro ${index + 1}`}
          <strong> {item.estado && ` (${item.estado})`} </strong>
        </Typography>
      ))}

      {/* {data.length > 3 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", pl: 2 }}
        >
          ... y {data.length - 3} más
        </Typography>
      )} */}
    </>
  );
};

const SusceptibilidadDetails = ({ getLayerData, getLayerCount }) => {
  const data = extractDataArray(getLayerData("susceptibilidad"));

  const counts = {
    movimientoMasa: 0,
    inundacion: 0,
    incendio: 0,
    otros: 0,
  };

  data.forEach((item) => {
    const tipo = item.tipo || item.TIPO || item.tipo_amenaza;
    if (tipo === 1 || tipo === "movimiento_masa") counts.movimientoMasa++;
    else if (tipo === 2 || tipo === "inundacion") counts.inundacion++;
    else if (tipo === 3 || tipo === "incendio") counts.incendio++;
    else counts.otros++;
  });

  return (
    <>
      <Typography variant="caption" color="text.secondary">
        Zonas de susceptibilidad: {data.length} áreas identificadas
      </Typography>
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
    </>
  );
};

// ========== RENDER DE CAPAS ==========
const renderLayerControl = (layerKey, props) => {
  const config = LAYER_CONFIGS[layerKey];
  if (!config) return null;

  const {
    getLayerCount,
    getLayerData,
    isLoading,
    selectedCapa,
    handleLayerToggle,
    handleRefreshLayer,
  } = props;

  // Obtener children específicos por capa
  let children = null;
  if (layerKey === "parroquia" || layerKey === "sectorial") {
    children = <ParroquiaDetails {...props} />;
  } else if (
    [
      "conoc_monit",
      "prev_mitig",
      "preparacion",
      "respuesta",
      "recuperacion",
    ].includes(layerKey)
  ) {
    children = <ActionDetails layerKey={layerKey} {...props} />;
  } else if (layerKey === "susceptibilidad") {
    children = <SusceptibilidadDetails {...props} />;
  }

  return (
    <LayerControl
      key={layerKey}
      label={config.label}
      icon={
        <Box component="span" sx={{ width: 20, height: 20, ...config.icon }} />
      }
      color={config.color}
      bgColor={config.bgColor}
      count={config.getCount(getLayerCount)}
      isLoading={config.isLoading(isLoading)}
      isSelected={config.isSelected(selectedCapa)}
      onToggle={config.onToggle(handleLayerToggle)}
      onRefresh={config.onRefresh(handleRefreshLayer)}
    >
      {children}
    </LayerControl>
  );
};

// ========== COMPONENTE PRINCIPAL ==========
export default function PanelAccion({
  mtt,
  data,
  setData,
  handleRefreshActionsGroup,
  getLayerCount,
  handleRefreshPolygonGroup,
  handleRefreshSusceptibilidadGroup,
  handleRefreshAnalysisGroup,
  isLoading,
  selectedCapa,
  handleLayerToggle,
  handleRefreshLayer,
  getLayerData,
  totalLayers,
  activeLayersCount,
}) {
  // Props comunes para todos los LayerControls
  const commonProps = {
    getLayerCount,
    getLayerData,
    isLoading,
    selectedCapa,
    handleLayerToggle,
    handleRefreshLayer,
  };

  return (
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
          {/* Grupo 1: Ubicación y Límites */}
          <LayerGroup
            title="1. Ubicación y Límites"
            onRefreshAll={handleRefreshPolygonGroup}
            showRefreshAll={true}
          >
            {renderLayerControl("parroquia", commonProps)}
            {renderLayerControl("sectorial", commonProps)}
          </LayerGroup>

          {/* Grupo 2: Acciones del MTT */}
          <LayerGroup
            title="2. Acciones del MTT"
            onRefreshAll={handleRefreshActionsGroup}
            showRefreshAll={true}
          >
            {renderLayerControl("conoc_monit", commonProps)}
            {renderLayerControl("prev_mitig", commonProps)}
            {renderLayerControl("preparacion", commonProps)}
            {renderLayerControl("respuesta", commonProps)}
            {renderLayerControl("recuperacion", commonProps)}
          </LayerGroup>

          {/* Grupo 3: Capas de análisis */}
          <LayerGroup
            title="3. Capas de análisis"
            onRefreshAll={handleRefreshAnalysisGroup}
            showRefreshAll={true}
          >
            {renderLayerControl("afect_register", commonProps)}
          </LayerGroup>

          {/* Grupo 4: Susceptibilidad del terreno */}
          <LayerGroup
            title="4. Susceptibilidad del terreno"
            onRefreshAll={handleRefreshSusceptibilidadGroup}
            showRefreshAll={true}
          >
            {renderLayerControl("susceptibilidad", commonProps)}
          </LayerGroup>

          {/* Indicadores de estado */}
          <StatusIndicator
            activeLayersCount={activeLayersCount}
            totalLayers={totalLayers}
          />
        </Box>
      }
    />
  );
}
