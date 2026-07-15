import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Tab,
  Typography,
  Avatar,
  Card,
  CardContent,
  Stack,
  Tooltip,
  IconButton,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { divIcon } from "leaflet";
import { useCallback, useState } from "react";
import { renderToString } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { parseByField } from "../../../utils/utils";
import {
  Person,
  Phone,
  Description,
  AttachMoney,
  Business,
  CalendarToday,
  AccessTime,
  LocationOn,
  Edit,
  Delete,
  Save,
  Assessment,
  CheckCircle,
  Warning,
  Schedule,
  AddAlertOutlined,
  AirplanemodeActive,
  PrivacyTip,
  ThumbDownAlt,
  PrecisionManufacturing,
  Build,
  Engineering,
} from "@mui/icons-material";

// ========== FUNCIÓN AUXILIAR PARA EXTRAER DATOS ==========
const extractDataArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.datos && Array.isArray(data.datos)) return data.datos;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (typeof data === "object") {
    return Object.keys(data).length > 0 ? [data] : [];
  }
  return [];
};

// ========== FUNCIÓN PARA CONVERTIR COORDENADAS ==========
const coordForm = (ubi) => {
  if (!ubi || typeof ubi !== "string") return null;
  const parts = ubi.split(",").map((part) => part.trim());
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }
  return null;
};

// ========== CONFIGURACIÓN DE ICONOS POR TIPO ==========
const ICON_CONFIG = {
  "Conocimiento y Monitoreo": {
    icon: DirectionsWalkIcon,
    color: "#602fbb",
    bgGradient: "linear-gradient(135deg, #602fbb, #7c4dff)",
  },
  "Prevención y Mitigación": {
    icon: AddAlertOutlined,
    color: "#ff8c00",
    bgGradient: "linear-gradient(135deg, #ff8c00, #ffb347)",
  },
  "Preparación": {
    icon: AirplanemodeActive,
    color: "#228b22",
    bgGradient: "linear-gradient(135deg, #228b22, #66bb6a)",
  },
  "Respuesta": {
    icon: PrivacyTip,
    color: "#ff6b00",
    bgGradient: "linear-gradient(135deg, #ff6b00, #ff9a3c)",
  },
  "Recuperación": {
    icon: ThumbDownAlt,
    color: "#0066cc",
    bgGradient: "linear-gradient(135deg, #0066cc, #4d94ff)",
  },
  "default": {
    icon: DirectionsWalkIcon,
    color: "#757575",
    bgGradient: "linear-gradient(135deg, #757575, #bdbdbd)",
  },
};

// ========== COMPONENTES DE ESTILOS ==========
const StatusChip = ({ status }) => {
  const statusConfig = {
    Vigente: { color: "success", icon: <CheckCircle />, label: "Vigente" },
    "en ejecución": {
      color: "warning",
      icon: <Schedule />,
      label: "En ejecución",
    },
    finalizado: { color: "info", icon: <Assessment />, label: "Finalizado" },
    suspendido: { color: "error", icon: <Warning />, label: "Suspendido" },
  };

  const config = statusConfig[status] || statusConfig["Vigente"];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: "bold" }}
    />
  );
};

const InfoCard = ({ icon, title, content, color = "primary" }) => (
  <Card
    variant="outlined"
    sx={{
      mb: 1,
      backgroundColor: "#f8f9fa",
      borderLeft: `4px solid ${
        color === "primary" ? "#1976d2" : 
        color === "success" ? "#2e7d32" : 
        color === "warning" ? "#ed6c02" : 
        color === "error" ? "#d32f2f" : "#1976d2"
      }`,
    }}
  >
    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          {title}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {content || "No disponible"}
      </Typography>
    </CardContent>
  </Card>
);

const MonthBadge = ({ month, active }) => (
  <Chip
    label={month}
    size="small"
    color={active ? "primary" : "default"}
    variant={active ? "filled" : "outlined"}
    sx={{ mr: 0.5, mb: 0.5 }}
  />
);

// ========== COMPONENTE PRINCIPAL ==========
export const ConMonitView = ({
  afect,
  formatDate,
  title = "Conocimiento y Monitoreo",
  mtt,
  polAfect,
  setOpenDialog,
  setTypeInput,
  files,
  acciones, // Para Prevención y Mitigación
  recursos, // Para Preparación, Respuesta, Recuperación
  ...props
}) => {
  const [value, setValue] = useState("1");
  const [openEdit, setOpenEdit] = useState(false);

  // Determinar qué datos usar
  const dataSource = afect || acciones || recursos || [];

  // Obtener configuración de icono según el título
  const iconConfig = ICON_CONFIG[title] || ICON_CONFIG.default;
  const IconComponent = iconConfig.icon;

  const getEventIcon = useCallback((status) => {
    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: iconConfig.bgGradient,
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      border: "2px solid white",
      transition: "all 0.3s ease",
    };
    const html = renderToString(
      <div style={circleStyle}>
        <IconComponent
          sx={{
            color: "#ffffff",
            fontSize: "18px",
          }}
        />
      </div>,
    );
    return divIcon({
      html,
      className: "custom-leaflet-icon",
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });
  }, [IconComponent, iconConfig.bgGradient]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Obtener meses activos
  const getActiveMonths = (data) => {
    const months = [];
    const monthMap = {
      Jun: "Junio",
      Jul: "Julio",
      Ago: "Agosto",
      Sep: "Septiembre",
      Oct: "Octubre",
      Nov: "Noviembre",
      Dic: "Diciembre",
    };
    Object.keys(monthMap).forEach((key) => {
      if (data[key]) {
        months.push(monthMap[key]);
      }
    });
    return months;
  };

  // Calcular progreso del evento
  const getProgress = (status) => {
    switch (status) {
      case "Vigente":
        return 25;
      case "en ejecución":
        return 50;
      case "finalizado":
        return 100;
      default:
        return 0;
    }
  };

  // Procesar datos si es necesario
  const processData = (item) => {
    // Si los datos vienen en formato de marcador procesado
    if (item.position && item.data) {
      return item;
    }
    // Si los datos vienen crudos
    if (item.ubi) {
      const coords = coordForm(item.ubi);
      return coords ? { id: item._id, position: [coords.lat, coords.lng], data: item } : null;
    }
    return null;
  };

  const processedData = Array.isArray(dataSource) 
    ? dataSource.map(processData).filter(Boolean)
    : [];

  if (!processedData || processedData.length === 0) {
    return null;
  }

  return (
    <>
      {processedData.map((marker) => {
        const byData = parseByField(marker.data.by);
        const activeMonths = getActiveMonths(marker.data);
        const progress = getProgress(marker.data.estado);
        const position = marker.position || [marker.data.lat, marker.data.lng];

        return (
          <Marker
            key={marker.id || marker.data._id}
            position={position}
            icon={getEventIcon(marker.data.estado)}
          >
            <Popup
              options={{ maxWidth: 600, minWidth: 450 }}
              maxWidth={600}
              className="custom-popup"
            >
              <Box
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  px: 1,
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#1976d2",
                    borderRadius: "2px",
                  },
                }}
              >
                {/* Header con título y estado */}
                <Box sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: iconConfig.color,
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        flex: 1,
                      }}
                    >
                      🏛️ {title}
                    </Typography>
                    <StatusChip status={marker.data.estado || marker.data.status} />
                  </Stack>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#3519d2",
                      fontWeight: 600,
                      mt: 0.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    {`${marker.data.accion || marker.data.nombre || marker.data.titulo || "Acción sin definir"}`}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

             

                {/* Grid de información */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<CalendarToday fontSize="small" color="primary" />}
                      title="Fecha del evento"
                      content={formatDate(marker.data.fecha || marker.data.date)}
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<AccessTime fontSize="small" color="secondary" />}
                      title="Última actualización"
                      content={formatDate(marker.data.date_act || marker.data.actualizacion)}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12 }}>
                    <InfoCard
                      icon={<LocationOn fontSize="small" color="success" />}
                      title="Ubicación"
                      content={`Lat: ${position[0]?.toFixed(6) || "N/A"}, Lng: ${position[1]?.toFixed(6) || "N/A"}`}
                    />
                  </Grid>
                </Grid>

                {/* Reportado por */}
                {byData && !byData.error && (
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 1.5,
                      backgroundColor: "#e3f2fd",
                      borderColor: "#90caf9",
                    }}
                  >
                    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#1565c0", fontWeight: "bold", mb: 0.5 }}
                      >
                        📋 Reportado por
                      </Typography>
                      <Stack spacing={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Person fontSize="small" color="primary" />
                          <Typography variant="body2">
                            <strong>{byData.name || byData.miembro || "No especificado"}</strong>
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Business fontSize="small" color="primary" />
                          <Typography variant="body2">
                            {byData.cargo || "Cargo no especificado"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Description fontSize="small" color="primary" />
                          <Typography variant="body2">
                            CI: {byData.ci || "No especificado"}
                          </Typography>
                        </Stack>
                        {byData.telf && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Phone fontSize="small" color="primary" />
                            <Typography variant="body2">
                              {byData.telf}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* Descripción */}
                <InfoCard
                  icon={<Description fontSize="small" color="info" />}
                  title="Descripción"
                  content={marker.data.desc || marker.data.descripcion || "No disponible"}
                  color="info"
                />

                {/* Presupuesto e Instituciones */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<AttachMoney fontSize="small" color="success" />}
                      title="Presupuesto"
                      content={
                        marker.data.cash || marker.data.presupuesto
                          ? `$${Number(marker.data.cash || marker.data.presupuesto).toLocaleString()}`
                          : "No disponible"
                      }
                      color="success"
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<Business fontSize="small" color="warning" />}
                      title="Instituciones"
                      content={marker.data.inst || marker.data.instituciones || "No disponible"}
                      color="warning"
                    />
                  </Grid>
                </Grid>

                {/* Plazos de ejecución */}
                {activeMonths.length > 0 && (
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 1.5,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        📅 Plazos de ejecución
                      </Typography>
                      <Box>
                        {activeMonths.map((month) => (
                          <MonthBadge key={month} month={month} active={true} />
                        ))}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 0.5 }}
                      >
                        {activeMonths.length} mes(es) activo(s)
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Acciones */}
                <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                  <Button
                    size="small"
                    //disabled
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setOpenEdit(!openEdit)}
                    sx={{ flex: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    disabled
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => console.log("eliminar archivo")}
                    sx={{ flex: 1 }}
                  >
                    Eliminar
                  </Button>
                </Box>
                {openEdit && (
                  <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    color="warning"
                    startIcon={<Save />}
                    sx={{ mt: 1 }}
                  >
                    Guardar Cambios
                  </Button>
                )}
              </Box>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};