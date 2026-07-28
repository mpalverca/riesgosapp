import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Grid,
  Avatar,
  Stack,
  Card,
  CardContent,
  IconButton,
  Collapse,
 
  Fade,

  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  alpha,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,

  Groups as GroupsIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,

  Download as DownloadIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

// ========== COMPONENTE DE ESTADO ==========
const StatusBadge = ({ status, phase }) => {
  const getStatusConfig = (estado) => {
    const configs = {
      Activo: { color: "success", icon: <CheckCircleIcon />, label: "Activo" },
      "En proceso": {
        color: "warning",
        icon: <PendingIcon />,
        label: "En proceso",
      },
      Pendiente: {
        color: "warning",
        icon: <PendingIcon />,
        label: "Pendiente",
      },
      Inactivo: { color: "error", icon: <WarningIcon />, label: "Inactivo" },
      Completado: {
        color: "success",
        icon: <CheckCircleIcon />,
        label: "Completado",
      },
    };
    return configs[estado] || configs["Pendiente"];
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="medium"
      sx={{ fontWeight: "bold", borderRadius: 2 }}
    />
  );
};

// ========== COMPONENTE DE MIEMBRO ==========
const MemberCard = ({ rol, nombre, telefono, index }) => {
  const colors = ["#1976d2", "#2e7d32", "#ed6c02"];
  const color = colors[index % colors.length];

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.15),
              color: color,
              width: 48,
              height: 48,
            }}
          >
            {nombre !== "N/A" ? nombre.charAt(0).toUpperCase() : <PersonIcon />}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {rol}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {nombre}
            </Typography>
            {telefono !== "N/A" && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {telefono}
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ========== COMPONENTE DE PUNTO DE CONTROL ==========
const ControlPointCard = ({ punto, onToggle, expanded }) => {
  const getEstadoColor = (state) => {
    const colors = {
      Activo: "success",
      "En proceso": "warning",
      Pendiente: "warning",
      Completado: "success",
      Inactivo: "error",
    };
    return colors[state] || "default";
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${alpha("#1976d2", 0.1)}`,
        borderRadius: 2,
        mb: 1,
        transition: "all 0.2s",
        "&:hover": {
          borderColor: alpha("#1976d2", 0.3),
        },
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              {punto.punto}
            </Typography>
            <Chip
              label={punto.tipo}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.65rem" }}
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={punto.estado.state}
              size="small"
              color={getEstadoColor(punto.estado.state)}
              sx={{ fontWeight: "medium" }}
            />
            <IconButton size="small" onClick={() => onToggle(punto.id)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
        </Stack>

        <Collapse in={expanded}>
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px solid ${alpha("#000", 0.08)}`,
            }}
          >
            <Grid container spacing={1}>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  ID del punto
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {punto.id}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Responsable
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {punto.estado.by}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  Descripción
                </Typography>
                <Typography variant="body2">{punto.descp}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

// ========== COMPONENTE DE BRIGADA ==========
const BrigadaSection = ({ data }) => {
  const [expanded, setExpanded] = useState(true);
  console.log(data);
  if (!data?.length) {
    return (
      <Paper
        sx={{
          p: 3,
          textAlign: "center",
          bgcolor: alpha("#1976d2", 0.04),
          borderRadius: 2,
        }}
      >
        <GroupsIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          No hay datos de brigada disponibles
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            <GroupsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Miembros de Brigada
          </Typography>
        <Chip
          label={`${data.length} miembros`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Stack>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          "& .MuiTableRow-root:hover": {
            bgcolor: alpha("#1976d2", 0.04),
          },
        }}
      >
        <Table size="small">
          <TableHead sx={{ bgcolor: alpha("#1976d2", 0.06) }}>
            <TableRow>
              {["Nombre", "Brigada", "Rango", "Equipo", "Estado"].map((h) => (
                <TableCell key={h}>
                  <Typography variant="caption" fontWeight="bold">
                    {h}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={item.ci || idx}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.75rem",
                        bgcolor: alpha("#1976d2", 0.1),
                      }}
                    >
                      {item.nombre?.charAt(0) || "?"}
                    </Avatar>
                    <Typography variant="body2">
                      {item.nombre || "N/A"}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{item.brigada || "N/A"}</TableCell>
                <TableCell>{item.rango || "N/A"}</TableCell>
                <TableCell>{item.equipo || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={item.estado || "N/A"}
                    size="small"
                    color={
                      item.estado?.toLowerCase() === "activo"
                        ? "success"
                        : "default"
                    }
                    sx={{ fontWeight: "medium", fontSize: "0.7rem" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// ========== COMPONENTE DE ESTADÍSTICAS ==========
const StatsCards = ({ comiteData, brigadaData }) => {
  const stats = [
    {
      label: "Miembros del Comité",
      value: "3",
      icon: <PersonIcon />,
      color: "#1976d2",
    },
    {
      label: "Brigada",
      value: brigadaData?.length || 0,
      icon: <GroupsIcon />,
      color: "#2e7d32",
    },
    {
      label: "Puntos de Control",
      value: "2",
      icon: <LocationOnIcon />,
      color: "#ed6c02",
    },
    {
      label: "Estado",
      value: comiteData?.Estado || "N/A",
      icon:
        comiteData?.Estado === "Activo" ? <CheckCircleIcon /> : <PendingIcon />,
      color: comiteData?.Estado === "Activo" ? "#2e7d32" : "#ed6c02",
    },
  ];

  return (
    <Grid container spacing={1.5} sx={{ mb: 2 }}>
      {stats.map((stat, idx) => (
        <Grid item size={{ xs: 6, sm: 3 }} key={idx}>
          <Card
            elevation={0}
            sx={{
              bgcolor: alpha(stat.color, 0.06),
              border: `1px solid ${alpha(stat.color, 0.12)}`,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: alpha(stat.color, 0.12),
                    color: stat.color,
                    width: 32,
                    height: 32,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                    {stat.value}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// ========== COMPONENTE PRINCIPAL ==========
const ComiteInfo = ({ comiteInfo, getBrigada }) => {
  const theme = useTheme();
  const [expandedPoints, setExpandedPoints] = useState({});

  const comiteData = comiteInfo?.data?.[0];
  const brigadaData = getBrigada?.dataC?.data;

  if (!comiteData) return null;

  const puntos = [
    {
      punto: "Puerta principal",
      id: "P001",
      tipo: "Evacuación",
      estado: { by: "Juan", state: "Activo" },
      descp: "Revisión de ingreso de personal y control de acceso",
    },
    {
      punto: "Almacén",
      id: "P002",
      tipo: "Control",
      estado: { by: "Ana", state: "En proceso" },
      descp: "Verificar insumos, cámaras y equipos de emergencia",
    },
  ];

  const handleTogglePoint = (id) => {
    setExpandedPoints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {/* Encabezado */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)}, ${alpha(theme.palette.primary.main, 0.01)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            Ley orgánica de Gestión integral de riesgos de desastres
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: "medium",
              mb: 2,
            }}
          >
            Art. 39.- Comités comunitarios de gestión de riesgos y participación
            ciudadana
          </Typography>
          <Typography
            variant="subtitle2"
            textAlign="justify"
            sx={{
              color: "text.secondary",
              lineHeight: 1.8,
              // maxWidth: 800,
              mx: "auto",
            }}
          >
            Se promoverá la participación ciudadana en gestión de riesgos a
            través de comités comunitarios de gestión de riesgos. Estos comités
            son instancias creadas para la gestión integral de riesgos de
            desastres de conformidad con los lineamientos para su
            reconocimiento, conformación y funcionamiento expedidos por el ente
            rector de la gestión integral del riesgo de desastres.
          </Typography>
        </Paper>

        {/* Información del comité */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {comiteData.comite}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comité Comunitario de Gestión de Riesgos
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: { xs: 1, sm: 0 } }}>
              <StatusBadge status={comiteData.Estado} />
              <Chip
                label={`Fase: ${comiteData.Fase}`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Stack>

          {/* Stats */}
          <StatsCards comiteData={comiteData} brigadaData={brigadaData} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Descripción del Comité
          </Typography>

          <Typography
            variant="subtitle1"
            textAlign="justify"
            sx={{
              mb: 2,
              whiteSpace: "pre-wrap", // Mantiene saltos de línea y espacios
              wordBreak: "break-word",
            }}
          >
            {comiteData.desc}
          </Typography>
          {/* Miembros del comité */}
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Miembros del Comité
          </Typography>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {[
              { rol: "Responsable", data: comiteData.responsable },
              { rol: "Secretario/a", data: comiteData.secretario },
              { rol: "Líder de Brigada", data: comiteData.lider_brigada },
            ].map((item, idx) => {
              const parseData = (str) => {
                if (!str) return { nombre: "N/A", telefono: "N/A" };
                return {
                  nombre:
                    str.match(/responsable=([^,]+)/i)?.[1]?.trim() || "N/A",
                  telefono: str.match(/telf=\s*([^,]+)/i)?.[1]?.trim() || "N/A",
                };
              };
              const data = parseData(item.data);
              return (
                <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                  <MemberCard
                    rol={item.rol}
                    nombre={data.nombre}
                    telefono={data.telefono}
                    index={idx}
                  />
                </Grid>
              );
            })}
          </Grid>

          {/* Brigada */}
          <Divider sx={{ my: 2 }} />
          <BrigadaSection data={brigadaData} />

          {/* Puntos de control */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            <LocationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Puntos de Control / Atención
          </Typography>
          {puntos.map((punto) => (
            <ControlPointCard
              key={punto.id}
              punto={punto}
              expanded={expandedPoints[punto.id] || false}
              onToggle={handleTogglePoint}
            />
          ))}
        </Paper>

        {/* Footer con acciones */}
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.06)}`,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="caption" color="text.secondary">
              Última actualización:{" "}
              {new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
              >
                Imprimir
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  // Función para exportar a PDF o Excel
                }}
              >
                Exportar
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ComiteInfo;
