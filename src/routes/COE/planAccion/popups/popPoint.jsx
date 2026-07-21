
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Snackbar,
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
  Schedule,
  AddAlertOutlined,
  GppGoodOutlined,
  Favorite,
  Link,
  MonitorHeart,
  
} from "@mui/icons-material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { usePlanA } from "../script";
import EditData from "./editarAct";

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
    icon: MonitorHeart,
      color: "#0066cc",
    bgGradient: "linear-gradient(135deg, #0066cc, #4d94ff)",
    
  },
  "Prevención y Mitigación": {
    icon: AddAlertOutlined,
     color: "#228b22",
    bgGradient: "linear-gradient(135deg, #228b22, #66bb6a)",
  },
  Preparación: {
    icon: GppGoodOutlined,
   color: "#ff8c00",
    bgGradient: "linear-gradient(135deg, #ff8c00, #ffb347)",
  },
  Respuesta: {
    icon: LocalShippingIcon,
    color: "#ff1100",
    bgGradient: "linear-gradient(135deg, #ff0000, #ff9a3c)",
  },
  Recuperación: {
    icon: Favorite,
    color: "#602fbb",
   bgGradient: "linear-gradient(135deg, #602fbb, #7c4dff)",
  },
  
};

// ========== COMPONENTES DE ESTILOS ==========
const StatusChip = ({ status }) => {
  const statusConfig = {
    Vigente: {
      color: "warning",
      icon: <Schedule />,
      label: "En ejecución  " || "Por activar" || "Programado",
    },
    "En ejecución": {
      color: "warning",
      icon: <Schedule />,
      label: "En ejecución  " || "Por activar" || "Programado",
    },
    Permanente: {
      color: "info",
      icon: <Assessment />,
      label: "Permanente" || "  Completado",
    },
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
        color === "primary"
          ? "#1976d2"
          : color === "success"
            ? "#2e7d32"
            : color === "warning"
              ? "#ed6c02"
              : color === "error"
                ? "#d32f2f"
                : "#1976d2"
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
      <Typography variant="body2" sx={{ mt: 0.5 }} textAlign="justify">
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
  formatDate,
  title = "Conocimiento y Monitoreo",
  sheet,
  mtt,
  polAfect,
  setOpenDialog,
  setTypeInput,
  files,
  acciones, // Para Prevención y Mitigación
  ...props
}) => {
  const [value, setValue] = useState("1");
  const [openEdit, setOpenEdit] = useState(false);

  // Determinar qué datos usar
 

  const { deleteRow, dataGet, loadingGet } = usePlanA();
  // Obtener configuración de icono según el título
  const iconConfig = ICON_CONFIG[title] || ICON_CONFIG.default;
  const IconComponent = iconConfig.icon;

  const getEventIcon = useCallback(
    (status) => {
      const circleStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
       // color:iconConfig.color,
        background: iconConfig.bgGradient,
        borderRadius: "50%",
        width: "24px",
        height: "24px",
      //  boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
       // border: "2px solid white",
        //transition: "all 0.3s ease",
      };
      const html = renderToString(
        <div style={circleStyle}>
          <IconComponent
            sx={{
             // color: "#ffffff",
              fontSize: "18px",
            }}
          />
        </div>,
      );
      return divIcon({
        html,
        className: "custom-leaflet-icon",
        iconSize: [24, 24],
        iconAnchor: [18, 24],
      });
    },
    [IconComponent, iconConfig.bgGradient],
  );

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
      case "En ejecución":
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
      return coords
        ? { id: item._id, position: [coords.lat, coords.lng], data: item }
        : null;
    }
    return null;
  };

  const hadleDelete = async (row) => {
    console.log(row);
    try {
      await deleteRow(sheet, row);
      <Snackbar
        open={true}
        autoHideDuration={6000}
        severity="error"
        sx={{ mt: 1 }}
        message="Acción eliminada, actualiza el cambo de acciones"
      />;

      // Opcional: refrescar datos o mostrar snackbar
    } catch (error) {
      console.error("Error al eliminar:", error);
      // Mostrar error
    }
  };

  const processedData = Array.isArray(acciones)
    ? acciones.map(processData).filter(Boolean)
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

        // En el botón:
        const estado = marker.data.estado; // o el campo que indique el estado
        const isCompletado = estado === "Completado";
        return (
          <Marker
            key={marker.id || marker.data._id}
            position={position}
            icon={getEventIcon(progress)}
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
                      {title}- {marker.data.mtt}
                    </Typography>
                    <StatusChip status={progress} />
                  </Stack>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#3519d2",
                      fontWeight: 600,
                      mt: 0.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    <strong>{marker.data.row}</strong> -{" "}
                    {marker.data.accion || "Acción sin definir"}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                {/* Grid de información */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<CalendarToday fontSize="small" color="primary" />}
                      title="Fecha del evento"
                      content={formatDate(marker.data.date || marker.data.date)}
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <InfoCard
                      icon={<AccessTime fontSize="small" color="secondary" />}
                      title="Última actualización"
                      content={formatDate(
                        marker.data.date_act || marker.data.actualizacion,
                      )}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <InfoCard
                      icon={<LocationOn fontSize="small" color="success" />}
                      title="Ubicación"
                      content={
                        <Typography>
                          {position[0]?.toFixed(6) || "N/A"},{" "}
                          {position[1]?.toFixed(6) || "N/A"}
                          <br />
                          <strong>Sector: </strong>
                          {marker.data.sector}
                        </Typography>
                      }
                    />
                  </Grid>

                  <Grid item size={{ xs: 12, md: 6 }}>
                    <InfoCard
                      icon={<Person fontSize="small" color="success" />}
                      title="Reportado por"
                      content={
                        byData &&
                        !byData.error && (
                          <>
                            <Stack spacing={0.5}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Person fontSize="small" color="primary" />
                                <Typography variant="body2">
                                  <strong>
                                    {byData.name ||
                                      byData.miembro ||
                                      "No especificado"}
                                  </strong>
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Business fontSize="small" color="primary" />
                                <Typography variant="body2">
                                  {byData.cargo || "Cargo no especificado"}
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
                          </>
                        )
                      }
                    />
                  </Grid>
                </Grid>

                {/* Reportado por */}

                {/* Descripción */}
                <InfoCard
                  icon={<Description fontSize="small" color="info" />}
                  title="Descripción"
                  content={
                    marker.data.desc ||
                    marker.data.descripcion ||
                    "No disponible"
                  }
                  color="info"
                />
                {openEdit ? (
                  <>
                    <EditData
                      dataI={marker.data}
                      close={() => setOpenEdit(false)}
                      row={marker.data.row}
                      member={props.member}
                      sheet={sheet}
                    />
                  </>
                ) : (
                  <>
                    <InfoCard
                      icon={<Description fontSize="small" color="info" />}
                      title="Detalle de intervención"
                      content={
                        marker.data.detail ||
                        marker.data.detail ||
                        "Detalle de intervención No disponible"
                      }
                      color="info"
                    />

                    {/* Presupuesto e Instituciones */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid item size={{ xs: 6 }}>
                        <InfoCard
                          icon={
                            <AttachMoney fontSize="small" color="success" />
                          }
                          title="Presupuesto"
                          content={
                            marker.data.cash
                              ? marker.data.cash
                              : Number(marker.data.cash)
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
                          content={
                            marker.data.inst ||
                            marker.data.instituciones ||
                            "No disponible"
                          }
                          color="warning"
                        />
                      </Grid>
                    </Grid>
                    <Grid item size={{ xs: 6 }}>
                      <InfoCard
                        icon={<Link fontSize="small" color="success" />}
                        title="Verificable"
                        content={
                          marker.data.verifi === "si" ? (
                            <Typography
                              component="a"
                              href={marker.data.verificableUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "primary.main",
                                textDecoration: "none",
                              }}
                            >
                              DESCARGAR VERIFICABLE
                            </Typography>
                          ) : (
                            <Typography>No existe verificable</Typography>
                          )
                        }
                      />
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
                              <MonthBadge
                                key={month}
                                month={month}
                                active={true}
                              />
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
                  </>
                )}
              </Box>
              {/* Acciones */}
              <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                <Button
                  size="small"
                  disabled={marker.data.mtt && marker.data.mtt !== mtt}
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setOpenEdit(!openEdit)}
                  sx={{ flex: 1 }}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={marker.data.mtt && marker.data.mtt !== mtt}
                  color="error"
                  startIcon={<Delete />}
                  onClick={async () => {
                    if (!isCompletado) {
                      await hadleDelete(marker.data.row); // o marker.data.row sin +6
                    }
                  }}
                  sx={{ flex: 1 }}
                >
                  {loadingGet ? "Eliminando..." : "Eliminar"}
                </Button>
              </Box>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
