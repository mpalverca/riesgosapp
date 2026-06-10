import React, { useMemo } from "react";
import { Box, Paper, Typography } from "@mui/material";

// Configuración centralizada de capas
const LAYER_CONFIG = {
  poligono: {
    label: "Polígonos de afectación",
    group: "limits",
    icon: { bgcolor: "#3519d2", shape: "square" },
    color: "#3519d2",
    bgColor: "#e8eaf6",
    showDetails: true,
    formatItem: (item, idx) => `${idx + 1}: ${item.parroq}-${item.sector}-${item.date_event}`
  },
  parroquia: {
    label: "Límites parroquiales",
    group: "limits",
    icon: { bgcolor: "#4caf50", shape: "square" },
    color: "#4caf50",
    bgColor: "#e8f5e9",
    showDetails: true,
    formatItem: (item) => item.DPA_DESPAR
  },
  afectaciones: {
    label: "Afectaciones",
    group: "actions",
    icon: { bgcolor: "#e6101b", shape: "circle" },
    color: "#e6101b",
    bgColor: "#ffe6e6",
    showDate: true
  },
  acciones: {
    label: "Acciones",
    group: "actions",
    icon: { bgcolor: "#ff8c00", shape: "circle" },
    color: "#ff8c00",
    bgColor: "#fff3e0",
    showStats: true
  },
  requerimientos: {
    label: "Requerimientos",
    group: "actions",
    icon: { bgcolor: "#228b22", shape: "circle" },
    color: "#228b22",
    bgColor: "#e8f5e9"
  },
  afect_register: {
    label: "Afectaciones registradas",
    group: "analysis",
    icon: { bgcolor: "#ff8c00", shape: "square" },
    color: "#ff8c00",
    bgColor: "#fff3e0"
  },
  susceptibilidad: {
    label: "Zonas de susceptibilidad",
    group: "susceptibility",
    icon: { bgcolor: "#228b22", shape: "square" },
    color: "#228b22",
    bgColor: "#e8f5e9",
    showDistribution: true
  }
};

const GROUP_CONFIG = {
  limits: { title: "1. Límites y polígonos", icon: "🗺️" },
  actions: { title: "2. Acciones del MTT", icon: "📋" },
  analysis: { title: "3. Capas de análisis", icon: "📊" },
  susceptibility: { title: "4. Susceptibilidad del terreno", icon: "⚠️" }
};

// Componente de icono
const LayerIcon = ({ bgcolor, shape }) => (
  <Box component="span" sx={{
    width: 20, height: 20, bgcolor,
    borderRadius: shape === "circle" ? "50%" : 0.5
  }} />
);

// Componente de estadísticas de acciones
const ActionStats = ({ data }) => {
  const stats = useMemo(() => {
    const vigente = data.filter(i => i.estado?.toLowerCase() === "vigente").length;
    const finalizada = data.filter(i => ["finalizada", "finalizado"].includes(i.estado?.toLowerCase())).length;
    return { vigente, finalizada, total: data.length };
  }, [data]);

  return (
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
      📊 <strong style={{ color: '#2e7d32' }}>Vigente:</strong> {stats.vigente} | 
      <strong style={{ color: '#757575' }}> Finalizada:</strong> {stats.finalizada} | 
      <strong> Total:</strong> {stats.total}
    </Typography>
  );
};

// Componente de distribución de susceptibilidad
const SusceptibilityDistribution = ({ data }) => {
  const distribution = useMemo(() => {
    const counts = { movimientoMasa: 0, inundacion: 0, incendio: 0, otros: 0 };
    data.forEach(item => {
      if (item.tipo === 1) counts.movimientoMasa++;
      else if (item.tipo === 2) counts.inundacion++;
      else if (item.tipo === 3) counts.incendio++;
      else counts.otros++;
    });
    return counts;
  }, [data]);

  const items = [
    { key: "movimientoMasa", label: "🏔️ Movimiento en masa", count: distribution.movimientoMasa },
    { key: "inundacion", label: "💧 Inundación", count: distribution.inundacion },
    { key: "incendio", label: "🔥 Incendio", count: distribution.incendio },
    { key: "otros", label: "❓ Otros tipos", count: distribution.otros }
  ];

  return (
    <Box sx={{ mt: 1, pl: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}>
        Distribución por tipo:
      </Typography>
      {items.filter(i => i.count > 0).map(({ label, count }) => (
        <Typography key={label} variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {label}: {count}
        </Typography>
      ))}
      <Typography variant="caption" sx={{ fontWeight: "bold", display: "block", mt: 0.5 }}>
        Total: {data.length} zonas
      </Typography>
    </Box>
  );
};

// Componente de control de capa
const LayerControl = ({ config, layerKey, state, handlers, getData, getCount, isLoading }) => {
  const { label, icon, color, bgColor, showDetails, showDate, showStats, showDistribution, formatItem } = config;
  const data = getData(layerKey);
  const count = getCount(layerKey);
  const selected = state[layerKey];

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box
        onClick={() => handlers.toggle(layerKey)}
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          p: 1, borderRadius: 1, cursor: "pointer", bgcolor: selected ? bgColor : "transparent",
          transition: "all 0.2s", "&:hover": { bgcolor: bgColor }
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LayerIcon bgcolor={icon.bgcolor} shape={icon.shape} />
          <Typography variant="body2" fontWeight={selected ? "bold" : "normal"}>{label}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isLoading(layerKey) && <Typography variant="caption">🔄</Typography>}
          {count > 0 && <Typography variant="caption" sx={{ bgcolor: "#e0e0e0", px: 0.75, borderRadius: 1 }}>{count}</Typography>}
          <Box component="span" sx={{ fontSize: 12, color: selected ? color : "#999" }}>{selected ? "✓" : "○"}</Box>
        </Box>
      </Box>

      {selected && (showDetails || showDate || showStats || showDistribution) && (
        <Box sx={{ pl: 4, pr: 1, pb: 1 }}>
          {showDetails && data.length > 0 && (
            <>
              <Typography variant="caption" color="text.secondary">Total: {count}</Typography>
              {data.slice(0, 5).map((item, idx) => (
                <Typography key={idx} variant="caption" color="text.secondary" sx={{ display: "block", fontSize: 11 }}>
                  • {formatItem ? formatItem(item, idx) : item.nombre || item.descripcion || "Sin nombre"}
                </Typography>
              ))}
              {data.length > 5 && <Typography variant="caption" color="text.secondary">... y {data.length - 5} más</Typography>}
            </>
          )}
          {showDate && <Typography variant="caption" color="primary" sx={{ display: "block", cursor: "pointer" }}>Última actualización: {new Date().toLocaleTimeString()}</Typography>}
          {showStats && <ActionStats data={data} />}
          {showDistribution && <SusceptibilityDistribution data={data} />}
          <Typography variant="caption" color="primary" sx={{ display: "block", cursor: "pointer", mt: 0.5 }} onClick={(e) => { e.stopPropagation(); handlers.refresh(layerKey); }}>⟳ Actualizar</Typography>
        </Box>
      )}
    </Box>
  );
};

// Componente de grupo de capas
const LayerGroup = ({ groupKey, layers, state, handlers, getters, isLoading }) => {
  const groupLayers = Object.entries(layers).filter(([_, cfg]) => cfg.group === groupKey);
  const allSelected = groupLayers.every(([key]) => state[key]);

  const handleRefreshAll = () => {
    groupLayers.forEach(([key]) => handlers.refresh(key));
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: "#fafafa" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">{GROUP_CONFIG[groupKey]?.title || groupKey}</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography variant="caption" sx={{ cursor: "pointer" }} onClick={handleRefreshAll}>⟳ Todo</Typography>
          <Typography variant="caption" sx={{ cursor: "pointer" }} onClick={() => groupLayers.forEach(([key]) => handlers.toggle(key))}>
            {allSelected ? "⬚ Todo" : "☑ Todo"}
          </Typography>
        </Box>
      </Box>
      {groupLayers.map(([key, cfg]) => (
        <LayerControl key={key} layerKey={key} config={cfg} state={state} handlers={handlers}
          getData={getters.getData} getCount={getters.getCount} isLoading={isLoading} />
      ))}
    </Paper>
  );
};

// Componente principal
const LayerManager = ({ selectedCapa, onToggle, onRefresh, getLayerData, getLayerCount, isLoading }) => {
  const activeLayersCount = Object.values(selectedCapa).filter(Boolean).length;
  const totalLayers = Object.keys(LAYER_CONFIG).length;

  const handlers = { toggle: onToggle, refresh: onRefresh };
  const getters = { getData: getLayerData, getCount: getLayerCount };

  return (
    <Box sx={{ px: 1, py: 1, maxHeight: "80vh", overflowY: "auto" }}>
      {["limits", "actions", "analysis", "susceptibility"].map(group => (
        <LayerGroup key={group} groupKey={group} layers={LAYER_CONFIG} state={selectedCapa}
          handlers={handlers} getters={getters} isLoading={isLoading} />
      ))}

      <Paper variant="outlined" sx={{ p: 1, mt: 2, bgcolor: activeLayersCount > 0 ? "#e8eaf6" : "#f5f5f5" }}>
        <Typography variant="caption">Capas activas: {activeLayersCount} / {totalLayers}</Typography>
      </Paper>
    </Box>
  );
};

export default LayerManager;