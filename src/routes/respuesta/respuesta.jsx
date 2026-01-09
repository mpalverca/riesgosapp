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

export default function Respuesta() {
  const navigate = useNavigate();
  const location = useLocation();

  const subRoutes = [
    "evin","comite"
  ];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route)
  );

  const analisisItems = [
    {
      id: 1,
      route: "evin",
      primary: "Formulario EVIN",
      secondary:
        "El evin es una herramienta que permite identificar familias afectadas por u evento adverso y redistribuir ayuda necesaria",
         icon: <EditNoteIcon />,
      avatarColor: "#2196f3",
      badge: "Actualizado",
      badgeColor: "success",
      description: "Atención familias afectadas",
    },
    {
      id: 2,
      route: "comites",
      primary: "Comites Comunitarios",
      secondary:
        "Permite identificar lugares donde se ubican comites comunitarios", icon: <EditNoteIcon />,
      avatarColor: "#2196f3",
      badge: "nuevo",
      badgeColor: "success",
      description: "Elaboración de plan familiar de emergencia",
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
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
          }}
        >
          Respuesta Ante eventos
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
          Plataforma integral para respuesta a riesgos de desastre en el cantón Loja
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
          mt: 2,
          p: 2,
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
