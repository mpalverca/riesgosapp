import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Typography
  ,Box
} from "@mui/material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Outlet, useNavigate,useLocation } from "react-router-dom";

export default function Preparacion() {
  const navigate = useNavigate();
   const location = useLocation();
  // Verificar si estamos en la ruta de plan de contingencia
  const isPlanContingencia = location.pathname.includes("plancontingencia");
  return (
    <div>
      {/* {isPlanContingencia && (
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            Plan de Contingencia
          </Typography>
        </Box>
      )} */}
      <Outlet/>
      {/* Mostrar la lista solo cuando NO estamos en una subruta */}
      {!isPlanContingencia && (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem
            secondaryAction={
              <IconButton 
                edge="end" 
                aria-label="delete" 
                onClick={() => {
                  navigate("plancontingencia");
                }}
              >
                <PlaylistAddCheckCircleIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <EditNoteIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Plan de contingencia"
              secondary="El plan contingencia es un manual de actividades a realizar por el organizador de un evento de concentración masiva, contiene tanto a los actores, como a la locación donde se realizara el evento, los recursos humanos y materiales a utilizar"
            />
          </ListItem>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <PlaylistAddCheckCircleIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <HealthAndSafetyIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Plan Familiar de emergencia"
              secondary="El Plan Familiar de Emergencias es un conjunto de actividades que deben realizar las familias, nos permite identificar y reducir riesgos que se generan en la familia, en el entorno social o natural. Y con ello realizar preparativos para reaccionar adecuadamente en caso de emergencias. Nos permite identificar los sitios de peligros, zonas de peligros y rutas de evacuación cercana a tu hogar. Además de descubrir las vulnerabilidades, acciones a realizar y asignar responsabilidades a cada integrante de la familia, a quien se deberá dar prioridad en una emergencia y la importancia de una mochila de emergencia."
            />
          </ListItem>
        </List>
      )}
    </div>
  );
}