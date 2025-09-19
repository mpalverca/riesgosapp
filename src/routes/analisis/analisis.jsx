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
import { Outlet, useNavigate,useLocation } from "react-router-dom";

export default function Analisis() {
  const navigate = useNavigate();
   const location = useLocation();
  // Verificar si estamos en la ruta de plan de contingencia
  const isAnalisis = location.pathname.includes("alertmap" || "threatmap" || "geologia");
  return (
    <div>
      
      <Outlet/>
      {/* Mostrar la lista solo cuando NO estamos en una subruta */}
      {!isAnalisis && (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem
            secondaryAction={
              <IconButton 
                edge="end" 
                aria-label="delete" 
                onClick={() => {
                  navigate("alertmap");
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
              primary="Afectaciones"
              secondary="LAs afectaciones registras en las distintas etapas de año corresponde a las afectaciones a los servicios basicos como propiedad privada"/>
          </ListItem>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => {
                  navigate("threatmap");
                }}>
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
              primary="Mapa de suceptibilidad"
              secondary="Es una situación, suceso o hecho que produce alteración en la Vida de las personas, de la economía, los sistemas sociales y el ambiente, causado por fenómenos de origen natural o provocado por los seres humanos (Lit. 8, art. 5 de la LOGIRD)" />
          </ListItem>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => {
                  navigate("geologia");
                }}>
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
              primary="Mapa Geológico"
              secondary="el mapa geologico esta diseñado en base a los estudios que se encuentran en los archivos municipales, y dan información relevante de la composición de suelo y condicionantes"/>
          </ListItem>
        </List>
      )}
    </div>
  );
}