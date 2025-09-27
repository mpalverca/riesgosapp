import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip,
  Card,
  CardContent
} from "@mui/material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import TerrainIcon from "@mui/icons-material/Terrain";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Analisis() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const subRoutes = ["alertmap", "threatmap", "geologia", "fire_camp"];
  const isAnalisis = subRoutes.some(route => location.pathname.includes(route));

  // Datos mejorados con más información
  const analisisItems = [
    {
      id: 1,
      route: "alertmap",
      primary: "Afectaciones",
      secondary: "Las afectaciones registradas en las distintas etapas del año corresponden a las afectaciones a los servicios básicos como a la propiedad privada",
      icon: <EditNoteIcon />,
      avatarColor: "#2196f3",
      badge: "Actualizado",
      badgeColor: "success",
      description: "Registro histórico de afectaciones por eventos naturales"
    },
    {
      id: 2,
      route: "threatmap",
      primary: "Mapa de Susceptibilidad",
      secondary: "Es una situación, suceso o hecho que produce alteración en la vida de las personas, de la economía, los sistemas sociales y el ambiente",
      icon: <HealthAndSafetyIcon />,
      avatarColor: "#9c27b0",
      badge: "Nuevo",
      badgeColor: "primary",
      description: "Evaluación de áreas con mayor propensión a riesgos"
    },
    {
      id: 3,
      route: "geologia",
      primary: "Mapa Geológico",
      secondary: "El mapa geológico está diseñado en base a los estudios que se encuentran en los archivos municipales",
      icon: <TerrainIcon />,
      avatarColor: "#4caf50",
      badge: "Base de datos",
      badgeColor: "secondary",
      description: "Composición geológica y características del suelo"
    },
    {
      id: 4,
      route: "fire_camp",
      primary: "Susceptibilidad a Incendios Forestales",
      secondary: "La susceptibilidad a incendios forestales muestra el nivel de alerta de cada parroquia del cantón Loja",
      icon: <LocalFireDepartmentIcon />,
      avatarColor: "#ff9800",
      badge: "En tiempo real",
      badgeColor: "warning",
      description: "Monitoreo de riesgo de incendios basado en datos INAMHI y Smartland UTPL"
    },
     {
      id: 5,
      route: "fire_camp",
      primary: "Analisis de riesgo",
      secondary: "Los riesgos en canton de loja son de orgien natural o antropico",
      icon: <LocalFireDepartmentIcon />,
      avatarColor: "#ff9800",
      badge: "Nuevo",
      badgeColor: "warning",
      description: "Realizar un analisis de riesgos de predio en particular"
}];

  const handleItemClick = (route) => {
    navigate(route);
  };

  if (isAnalisis) {
    return <Outlet />;
  }

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: "bold",
            color: "primary.main",
            mb: 2
          }}
        >
          Sistema de Análisis de Riesgos
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: "text.secondary",
            maxWidth: "800px",
            mx: "auto",
            lineHeight: 1.6
          }}
        >
          Plataforma integral para el monitoreo y análisis de riesgos naturales en el cantón Loja
        </Typography>
      </Box>

      {/* Grid de items */}
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: 3,
        maxWidth: "1200px",
        mx: "auto"
      }}>
        {analisisItems.map((item) => (
          <Card 
            key={item.id}
            sx={{ 
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6
              },
              height: "100%",
              display: "flex",
              flexDirection: "column"
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
                    mr: 2
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}>
                {item.secondary}
              </Typography>
              
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
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
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Footer informativo */}
      <Box sx={{ 
        mt: 6, 
        p: 3, 
        bgcolor: "#d67d17ff", 
        color: "white",
        borderRadius: 2,
        textAlign: "center"
      }}>
        <Typography variant="body1">
          🎯 Selecciona un módulo para acceder al análisis detallado y herramientas interactivas
        </Typography>
      </Box>
    </Box>
  );
}