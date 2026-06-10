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
import { Apartment, Flag, House, People } from "@mui/icons-material";
import AnalisisCards from "../../components/pages/homePages";

export default function Preparacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const subRoutes = [
    "plancontingencia",
    "planfamiliar",
    "geologia",
    "zonas_seguras",
    "comite_comunitario",
    "comite_comunitario_parroquial",
  ];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route),
  );

  const analisisItems = [
    {
      id: 1,
      route: "plancontingencia",
      primary: "Plan de contingencia",
      secondary:
        "El plan contingencia es un manual de actividades a realizar por el organizador de un evento de concentración masiva, contiene tanto a los actores, como a la locación donde se realizara el evento, los recursos humanos y materiales a utilizar",
      icon: <EditNoteIcon />,
     color: "#2196f3",
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
      icon: <House />,
      color: "#f39821",
      badge: "Actualizado",
      badgeColor: "success",
      description: "Elaboración de plan familiar de emergencia",
    },
    {
      id: 3,
      route: "zonas_seguras",
      primary: "Zonas seguras",
      secondary:
        "zonas seguras son ubicaciones o espacios dodne se tiene o se peude realizar concentracion publico",
      icon: <Flag />,
      color: "#418141",
      badge: "Actualizado",
      badgeColor: "success",
      description: "revisar zonas seguras",
    },
    {
      id: 4,
      route: "alojamientos_temporales",
      primary: "Alojamientos Temporales",
      icon: <Apartment />,
      secondary:
        "los lojamientos temporales son espacios para persoans que han sido afectadas por un evento natural o antropico",
      color: "#b6b44b",
      badge: "Actualizado",
      badgeColor: "success",
      description: "zonas destinadas a alojamientos temporales",
    },
    {
      id: 5,
      route: "comite_comunitario",
      primary: "Comites Comunitarios",
      icon: <People />,

      secondary: "Los comites comunitarios son espacios de personas",
      color: "#b821f3",
      badge: "Nuevo",
      badgeColor: "success",
      description: "organizaciones comunitarias para atender una situación",
    },
    {
      id: 6,
      route: "comite_comunitario_parroquial",
      primary: "Comites Comunitarios parroquiales",
      icon: <People />,
      secondary: "Los comites comunitarios son organización de personas",
      color: "#21f333",
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
    <AnalisisCards
      items={analisisItems}
      title="Preparación ante Aventos Adversoss"
      subtitle="Plataforma integral para el monitoreo y análisis de riesgos naturales          en el cantón Loja"
      footerText="Selecciona un módulo para acceder al análisis detallado"
      redirectOutletRoutes={subRoutes}
    />
  );
}
