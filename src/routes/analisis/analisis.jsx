import { useState } from "react";
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Fade,
  useTheme,
  alpha
} from "@mui/material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TerrainIcon from "@mui/icons-material/Terrain";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AnalisisCards from "../../components/pages/homePages";

export default function Analisis() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [hoveredId, setHoveredId] = useState(null);

  const subRoutes = ["alertmap", "threatmap", "geologia", "fire_camp", "risk"];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route)
  );

  const analisisItems = [
    {
      id: 1,
      route: "alertmap",
      title: "Afectaciones",
      description:
        "Registro histórico de afectaciones a servicios básicos y propiedad privada por eventos naturales",
      icon: <EditNoteIcon />,
      color: "#2196f3",
      badge: "Actualizado",
    },
    {
      id: 2,
      route: "threatmap",
      title: "Sistema de Alcantarillado ",
      description:
        "Visualiza el sistema de alcantarillado del cantón Loja, incluyendo su estado actual y vulnerabilidades potenciales",
      icon: <HealthAndSafetyIcon />,
      color: "#9c27b0",
      badge: "Interactivo",
    },
    {
      id: 3,
      route: "geologia",
      title: "Estado de Alcantarillas",
      description:
        "Composición geológica y características del suelo basado en estudios municipales",
      icon: <TerrainIcon />,
      color: "#4caf50",
      badge: "Base datos",
    },
    {
      id: 4,
      route: "fire_camp",
      title: "Incendios Forestales",
      description:
        "Monitoreo de susceptibilidad por parroquia con datos INAMHI y Smartland UTPL",
      icon: <LocalFireDepartmentIcon />,
      color: "#f44336",
      badge: "Tiempo real",
    },
    {
      id: 5,
      route: "risk",
      title: "Análisis de Riesgo (Predios)",
      description: "Evaluación personalizada de riesgos para predios particulares",
      icon: <WarningAmberOutlinedIcon />,
      color: "#ff9800",
      badge: "Nuevo",
    },
    {
      id: 6,
      route: "risk",
      title: "Análisis de Riesgo (Parroquias)",
      description: "Evaluación integral de riesgos a nivel parroquial",
      icon: <AnalyticsIcon />,
      color: "#ff9800",
      badge: "Nuevo",
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
      title="Sistema de Análisis de Riesgos"
      subtitle="Monitoreo y análisis de riesgos naturales en el cantón Loja"
      footerText="Selecciona un módulo para acceder al análisis detallado"
      redirectOutletRoutes={subRoutes}
    />
  );
}