import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Analisis() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar si estamos en alguna de las subrutas - CORREGIDO
  const subRoutes = ["alertmap", "threatmap", "geologia", "fire_camp"];
  const isAnalisis = subRoutes.some(route => location.pathname.includes(route));
  
  // Otra alternativa más específica:
  // const isAnalisis = location.pathname !== "/analisis";
  
  console.log("Ruta actual:", location.pathname);
  console.log("¿Está en subruta?", isAnalisis);

  return (
    <div>
      <Outlet/>
      
      {/* Mostrar la lista solo cuando NO estamos en una subruta */}
      {!isAnalisis && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3, color: "primary.main" }}>
            Análisis de Riesgos
          </Typography>
          
          <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 2, boxShadow: 2 }}>
            <ListItem
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="ir a afectaciones"
                  onClick={() => navigate("alertmap")}
                  color="primary"
                >
                  <PlaylistAddCheckCircleIcon />
                </IconButton>
              }
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <EditNoteIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Afectaciones"
                secondary="Las afectaciones registradas en las distintas etapas del año corresponden a las afectaciones a los servicios básicos como propiedad privada"
              />
            </ListItem>
            
            <ListItem
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="ir a mapa de susceptibilidad"
                  onClick={() => navigate("threatmap")}
                  color="primary"
                >
                  <PlaylistAddCheckCircleIcon />
                </IconButton>
              }
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <HealthAndSafetyIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Mapa de susceptibilidad"
                secondary="Es una situación, suceso o hecho que produce alteración en la vida de las personas, de la economía, los sistemas sociales y el ambiente, causado por fenómenos de origen natural o provocado por los seres humanos"
              />
            </ListItem>
            
            <ListItem
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="ir a mapa geológico"
                  onClick={() => navigate("geologia")}
                  color="primary"
                >
                  <PlaylistAddCheckCircleIcon />
                </IconButton>
              }
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <HealthAndSafetyIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Mapa Geológico"
                secondary="El mapa geológico está diseñado en base a los estudios que se encuentran en los archivos municipales, y dan información relevante de la composición de suelo y condicionantes"
              />
            </ListItem>
            
            <ListItem
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="ir a susceptibilidad de incendios"
                  onClick={() => navigate("fire_camp")}
                  color="primary"
                >
                  <PlaylistAddCheckCircleIcon />
                </IconButton>
              }
              sx={{ 
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <HealthAndSafetyIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Susceptibilidad a incendios forestales"
                secondary="La susceptibilidad a incendios forestales muestra el nivel de alerta de cada parroquia del cantón Loja, a través de la representación de información procesada de INAMHI y del sitio de Smartland UTPL"
              />
            </ListItem>
          </List>
        </Box>
      )}
    </div>
  );
}