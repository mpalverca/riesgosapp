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

// ========== FUNCIÓN PARA PROCESAR MARCADORES ==========
const processMarkers = (rawData) => {
  const dataArray = extractDataArray(rawData);
  if (!dataArray || !Array.isArray(dataArray)) return [];

  return dataArray
    .map((item, index) => {
      if (!item.ubi) return null;
      try {
        const coords = coordForm(item.ubi);
        return coords
          ? { id: item._id || index, position: coords, data: item }
          : null;
      } catch (e) {
        console.warn(`Error procesando marcador ${index}:`, e);
        return null;
      }
    })
    .filter(Boolean);
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
      backgroundColor: "#f8f9fa",
      borderLeft: `4px solid ${color === "primary" ? "#1976d2" : color === "success" ? "#2e7d32" : color === "warning" ? "#ed6c02" : "#d32f2f"}`,
    }}
  >
    <CardContent sx={{ "&:last-child": { pb: 1 } }}>
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
  mtt,
  polAfect,
  setOpenDialog,
  setTypeInput,
  files,
  ...props
}) => {
  const [value, setValue] = useState("1");
  const [openEdit, setOpenEdit] = useState(false);

  const getEventIcon = useCallback((color, status) => {
    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        status === "Vigente" || status === "en ejecución"
          ? "linear-gradient(135deg, #602fbb, #7c4dff)"
          : "linear-gradient(135deg, #3eb13e, #66bb6a)",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      border: "2px solid white",
      transition: "all 0.3s ease",
    };
    const html = renderToString(
      <div style={circleStyle}>
        <DirectionsWalkIcon
          sx={{
            color:
              status === "Vigente" || status === "en ejecución"
                ? "#ffffff"
                : "#000000",
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
  }, []);

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

  if (!afect || afect.length === 0) {
    return null;
  }

  return (
    <>
      {afect.map((marker) => {
        const byData = parseByField(marker.data.by);
        const event_index = Number(marker.data.event_row);
        const pol_row = polAfect?.find((item) => item.row === event_index);
        const activeMonths = getActiveMonths(marker.data);
        const progress = getProgress(marker.data.estado);
        const position = [marker.position[0], marker.position[1]];

        return (
          <Marker
            key={marker.id}
            position={position}
            icon={getEventIcon(marker.data.estado, marker.data.estado)}
          >
            <Popup
              options={{ maxWidth: 400, minWidth: 350 }}
              maxWidth={500}
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
                        color: "#e6101b",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        flex: 1,
                      }}
                    >
                      🏛️ Conocimiento y Monitoreo
                    </Typography>
                    <StatusChip status={marker.data.estado} />
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
                    {`${marker.data.accion || "Acción sin definir"}`}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                {/* Barra de progreso */}
                <Box sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption" color="text.secondary">
                      Progreso
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {progress}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          progress === 100
                            ? "#2e7d32"
                            : progress >= 50
                              ? "#ed6c02"
                              : "#1976d2",
                      },
                    }}
                  />
                </Box>

                {/* Grid de información */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<CalendarToday fontSize="small" color="primary" />}
                      title="Fecha del evento"
                      content={marker.data.date}
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<AccessTime fontSize="small" color="secondary" />}
                      title="Última actualización"
                      content={formatDate(marker.data.date_act)}
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<LocationOn fontSize="small" color="success" />}
                      title="Ubicación"
                      content={`Lat: ${marker.position[0].toFixed(
                        6,
                      )}, Lng: ${marker.position[1].toFixed(6)}`}
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
                            <strong>
                              {byData.name || "No especificado"}
                            </strong>
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
                  content={marker.data.desc || "No disponible"}
                  color="info"
                />

                {/* Presupuesto e Instituciones */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<AttachMoney fontSize="small" color="success" />}
                      title="Presupuesto"
                      content={
                        marker.data.cash
                          ? `$${Number(marker.data.cash).toLocaleString()}`
                          : "No disponible"
                      }
                      color="success"
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<Business fontSize="small" color="warning" />}
                      title="Instituciones"
                      content={marker.data.inst || "No disponible"}
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
                    disabled
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

                {/* Metadata adicional */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1, textAlign: "center" }}
                >
                  ID: {marker.id} | Evento #{event_index}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
