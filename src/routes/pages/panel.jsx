import { WarningAmberOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TerrainIcon from "@mui/icons-material/Terrain";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const inicialAcciones = [
  "Revisar registros",
  "Evaluar riesgos",
  "Actualizar medidas",
  "Comunicar hallazgos",
];

const Panel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const subRoutes = ["ges_plan_c", "threatmap"];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route),
  );

  // Datos mejorados con más información
  const analisisItems = [
    {
      id: 1,
      route: "ges_plan_c",
      primary: "gestión de plan de contingencia",
      secondary: "El plan de contingencia es documento que permite validar la seguridad  y realización de un evento",
      icon: <EditNoteIcon />,
      avatarColor: "#2196f3",
      badge: "Actualizado",
      badgeColor: "success",
      //description: "Registro histórico de afectaciones por eventos naturales",
    },
    {
      id: 2,
      route: "accion_secundaria",
      primary: "Accion secundaria",
      secondary:
        "Es una situación, suceso o hecho que produce alteración en la vida de las personas, de la economía, los sistemas sociales y el ambiente",
      icon: <HealthAndSafetyIcon />,
      avatarColor: "#9c27b0",
      badge: "Nuevo",
      badgeColor: "primary",
      description: "Evaluación de áreas con mayor propensión a riesgos",
    },
  ];

  const handleItemClick = (route) => {
    navigate(route);
  };

  if (isAnalisis) {
    return <Outlet />;
  }

  return (
    <Box sx={{ p: 1, minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            //color: "primary.main",
            mb: 1,
          }}
        >
          Panel de Control - Gestión de Riesgos en Loja
        </Typography>
      </Box>

      {/* Grid de items */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {analisisItems.map((item) => (
          <Card
            key={item.id}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => handleItemClick(item.route)}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: item.avatarColor,
                    width: 60,
                    height: 60,
                    mr: 2,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mr: 2 }}>
                      {item.primary}
                    </Typography>
                    <Chip
                      label={item.badge}
                      color={item.badgeColor}
                      size="small"
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}>
                {item.secondary}
              </Typography>

              {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
                <IconButton 
                  color="primary"
                  sx={{
                    "&:hover": {
                      bgcolor: "primary.light",
                      transform: "scale(1.1)"
                    }
                  }}
                >
                  <PlaylistAddCheckCircleIcon />
                </IconButton>
              </Box> */}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Footer informativo */}
      <Box
        sx={{
          mt: 6,
          p: 3,
          bgcolor: "#d67d17ff",
          color: "white",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body1">
          🎯 Selecciona un módulo para acceder al análisis detallado y
          herramientas interactivas
        </Typography>
      </Box>
    </Box>
  );
};

export default Panel;
