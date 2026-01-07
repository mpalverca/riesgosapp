import React from "react";
import {
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Preparacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const subRoutes = [
    "plancontingencia",
    "planfamiliar",
    "geologia",
    "fire_camp",
    "comite_comunitario"
  ];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route)
  );

  const analisisItems = [
    {
      id: 1,
      route: "plancontingencia",
      primary: "Plan de contingencia",
      secondary:
        "El plan contingencia es un manual de actividades a realizar por el organizador de un evento de concentración masiva, contiene tanto a los actores, como a la locación donde se realizara el evento, los recursos humanos y materiales a utilizar",
      icon: <EditNoteIcon />,
      avatarColor: "#2196f3",
      badge: "Actualizado",
      badgeColor: "success",
      description: "Elaboración de plan de contingencia para eventos masivos",
    },
    {
      id: 2,
      route: "planfamiliar",
      primary: "Plan Familiar de emergencia",
      secondary:
        "El Plan Familiar de Emergencias es un conjunto de actividades que deben realizar las familias, nos permite identificar y reducir riesgos que se generan en la familia, en el entorno social o natural.",
      icon: <EditNoteIcon />,
      avatarColor: "#2196f3",
      badge: "Actualizado",
      badgeColor: "success",
      description: "Elaboración de plan familiar de emergencia",
    },
    {
      id: 3,
      route: "planfamiliar",
      primary: "Zonas seguras",
      secondary:
        "zonas seguras son ubicaciones o espacios dodne se tiene o se peude realizar concentracion publico",
      icon: <EditNoteIcon />,
      avatarColor: "#2196f3",
      badge: "Actualizado",
      badgeColor: "success",
      description: "revisar zonas seguras",
    },
    {
      id: 5,
      route: "planfamiliar",
      primary: "Alojamientos Temporales",
      secondary:
        "los lojamientos temporales son espacios para persoans que han sido afectadas por un evento natural o antropico",
      avatarColor: "#2196f3",
      badge: "Actualizado",
      badgeColor: "success",
      description: "zonas destinadas a alojamientos temporales",
    },
        {
      id: 5,
      route: "comite_comunitario",
      primary: "Comites Comunitarios",
      secondary:
        "Los comites comunitarios son espacios de personas",
      avatarColor: "#2196f3",
      badge: "Nuevo",
      badgeColor: "success",
      description: "organizaciones comunitarias para atender una situación",
    },
  ];
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
            mb: 2,
          }}
        >
          Preparación ante eventos antropicos
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            maxWidth: "800px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Plataforma integral para el monitoreo y análisis de riesgos naturales
          en el cantón Loja
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

              <Box
                sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}
              >
                <IconButton
                  color="primary"
                  sx={{
                    "&:hover": {
                      bgcolor: "primary.light",
                      transform: "scale(1.1)",
                    },
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
}
