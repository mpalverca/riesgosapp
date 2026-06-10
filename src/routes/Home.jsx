import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  Chip,
  Button,
  Fade,
  Zoom,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldIcon from "@mui/icons-material/Shield";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Carousel from "../components/Navbar/carrusel";

// Tema personalizado mejorado
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Verde más moderno
      light: "#60ad5e",
      dark: "#1b5e20",
    },
    secondary: {
      main: "#e65100", // Naranja más vibrante
      light: "#ff8333",
      dark: "#ac2e00",
    },
    info: {
      main: "#0288d1",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", "Arial", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      margin: "1rem 0",
      background: "linear-gradient(135deg, #2e7d32 0%, #e65100 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textAlign: "center",
    },
    h2: {
      fontSize: "1.35rem",
      fontWeight: 600,
      color: "#1a237e",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: "#37474f",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 24px",
        },
      },
    },
  },
});

// Componente para animación al hacer scroll
const FadeInSection = ({ children }) => {
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  return (
    <Slide in={trigger} direction="up" timeout={600}>
      <Box>{children}</Box>
    </Slide>
  );
};

const Home = () => {
  const carouselSlides = [
    {
      image:
        "https://tardeando.com/sitio/wp-content/uploads/2022/02/mitigacion1.jpg",
      alt: "Innovación tecnológica",
      title: "Predios colindantes a ríos y quebradas",
      description:
        "Ordenanza 033-2021-Art 13.- Todos los propietarios de predios que colinden con márgenes de protección de ríos, quebradas y lagunas naturales en el cantón Loja, deberán cuidar la franja de protección correspondiente.",
      buttonText: "Ver ordenanza",
      imageFilter: "brightness(0.7)",
    },
    {
      image:
        "https://i0.wp.com/machalamovil.com/wp-content/uploads/2025/08/web-desing-editor-19.png?fit=1440%2C810&ssl=1",
      alt: "Planes de contingencia",
      title: "Eventos de concentración masiva",
      description: "Conoce los eventos que se realizarán en el cantón Loja",
      buttonText: "Ver eventos",
      buttonLink: "/eventos_concentracion_masiva",
      imageFilter: "brightness(0.6)",
    },
    {
      image:
        "https://www.kpnsafety.com/wp-content/uploads/2022/05/incendios-forestales-altas-temperaturas.jpg",
      alt: "Soporte técnico",
      title: "Incendios Forestales",
      description:
        "Conoce el nivel de alerta de cada parroquia y las medidas preventivas a tomar",
      buttonText: "Ver niveles de alerta",
      buttonLink: "analisis/fire_camp",
      imageFilter: "brightness(0.75)",
    },
  ];

  const features = [
    {
      icon: <ShieldIcon sx={{ fontSize: 48, color: "#2e7d32" }} />,
      title: "Prevención",
      description: "Evitamos la generación de nuevos riesgos",
    },
    {
      icon: <WarningIcon sx={{ fontSize: 48, color: "#e65100" }} />,
      title: "Mitigación",
      description: "Reducimos los riesgos existentes",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: "#0288d1" }} />,
      title: "Preparación",
      description: "Capacitación para respuesta a emergencias",
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 48, color: "#7cb342" }} />,
      title: "Recuperación",
      description: "Rehabilitación post-desastre",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ bgcolor: "background.default", minHeight: "100vh", py: 1, px: 4 }}
      >
        {/* Alerta de prototipo - Mejorada */}

        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{
            mb: 2,
            //borderRadius: 3,
            // borderLeft: "6px solid #e65100",
            "& .MuiAlert-message": {
              fontSize: "0.95rem",
              fontWeight: 500,
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem"
           
            }}
            align="center"
        
          >
            Sitio en fase de prototipo operativo
          </Typography>
          <Typography variant="caption" color="text.secondary">
            El sitio web de Gestión de Riesgos del GAD Loja se presenta como un
            prototipo operativo, gestionado por la Coordinación de Gestión de
            Riesgos, cuyo funcionamiento está sujeto a la priorización
            presupuestaria institucional y a la validación previa a su
            aprobación para uso oficial. Cuenta con un modelo conceptual y
            lineamientos preliminares para su implementación en entornos web y
            móvil.
          </Typography>
        </Alert>

        {/* Carrusel mejorado */}
        <Box sx={{ mb: 2 }}>
          <Carousel
            slides={carouselSlides}
            autoPlay={true}
            interval={5000}
            height={400}
            showIndicators={true}
            showNavigation={true}
          />
        </Box>

        {/* Sección de Introducción */}

        <Card
          elevation={0}
          sx={{
            mb: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <CardContent>
            <Typography variant="h1" gutterBottom>
              ¿Qué es la Gestión Integral de Riesgos de Desastres?
            </Typography>
            <Typography variant="body1" align="justify">
              La{" "}
              <strong>Ley de Gestión de Riesgos de Desastres (LOGIRD)</strong>{" "}
              define la Gestión de Riesgos de Desastres como la la posibilidad
              de ocurrencia de un evento que pueda afectar la economía, bienes
              materiales o vidas humanas.
              <br />
              <br />
              La <strong>Gestión del Riesgo</strong> se refiere al proceso
              social de planeación, ejecución, seguimiento y evaluación de
              políticas y acciones para el conocimiento del riesgo y promoción
              de una mayor conciencia del mismo.
            </Typography>
          </CardContent>
        </Card>

        {/* Tarjetas de Objetivos LOGIRD */}

        <Card elevation={0} sx={{ mb: 3, bgcolor: "#e8f5e9" }}>
          <CardContent>
            <Typography variant="h1" gutterBottom>
              Objetivos de la LOGIRD
            </Typography>
            <Grid container spacing={2}>
              {[
                "Impedir o evitar que se generen riesgos",
                "Reducir o controlar los riesgos existentes",
                "Prepararse y manejar situaciones de desastre",
                "Facilitar la recuperación post-desastre",
              ].map((text, index) => (
                <Grid item size={{ xs: 12, sm: 6 }} key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon color="primary" />
                    <Typography variant="body1">{text}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Características clave */}

        <Typography variant="h1" sx={{ mt: 2, mb: 3 }}>
          Componentes Clave
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {features.map((feature, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  height: "100%",
                  cursor: "pointer",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2e7d32 0%, #e65100 100%)",
                    "& .MuiTypography-root": { color: "white" },
                    "& svg": { color: "white" },
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h2" sx={{ fontSize: "1.2rem", mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section Mejorado */}

        <Card elevation={0} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h1" gutterBottom>
              Preguntas Frecuentes
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Accordion elevation={1} sx={{ mb: 1, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h2">
                    ¿Qué es la Agenda de Reducción de Riesgos?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Es el conjunto de normas, estrategias, mapas y actividades
                    que realiza una comunidad para evitar ser afectada y
                    prevenir cualquier afectación a nivel de desastre. Incluye
                    planes de contingencia, sistemas de alerta temprana y
                    programas de capacitación.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={1} sx={{ mb: 1, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h2">
                    ¿Quién es el responsable de la gestión de riesgos?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Dentro de la LOGIRD, <strong>cada persona</strong> dentro
                    del territorio nacional es corresponsable. Esto incluye:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      mt: 2,
                    }}
                  >
                    <Chip icon={<PeopleIcon />} label="Ciudadanos" />
                    <Chip icon={<ApartmentIcon />} label="Comunidades" />
                    <Chip icon={<BusinessIcon />} label="Instituciones" />
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={1} sx={{ borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h2">
                    ¿Cuáles son los componentes clave de la LOGIRD?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {[
                      "Prevención: Evitar nuevos riesgos",
                      "Mitigación: Reducir riesgos existentes",
                      "Preparación: Capacitación y planificación",
                      "Recuperación: Rehabilitación post-desastre",
                    ].map((item, idx) => (
                      <Grid item size={{ xs: 12, sm: 6 }} key={idx}>
                        <Chip
                          label={item}
                          color="primary"
                          variant="outlined"
                          sx={{
                            width: "100%",
                            justifyContent: "flex-start",
                            p: 1,
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </CardContent>
        </Card>

        {/* Responsabilidades */}

        <Box
          sx={{
            bgcolor: "#e3f2fd",
            p: 3,
            borderRadius: 4,
            mb: 4,
          }}
        >
          <Typography variant="h1" gutterBottom>
            Responsabilidades según la LOGIRD
          </Typography>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "transparent",
                  boxShadow: 0,
                }}
              >
                <CardContent>
                  <PeopleIcon sx={{ fontSize: 48, color: "#2e7d32", mb: 1 }} />
                  <Typography variant="h2">Ciudadanos</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    ✓ Participar en prevención
                    <br />
                    ✓ Conocer riesgos locales
                    <br />
                    ✓ Seguir instrucciones
                    <br />✓ Reportar situaciones de riesgo
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "transparent",
                  boxShadow: 0,
                }}
              >
                <CardContent>
                  <ApartmentIcon
                    sx={{ fontSize: 48, color: "#e65100", mb: 1 }}
                  />
                  <Typography variant="h2">Gobiernos Locales</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    ✓ Mapas de riesgo
                    <br />
                    ✓ Planes de contingencia
                    <br />
                    ✓ Sistemas de alerta temprana
                    <br />✓ Coordinación de emergencias
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "transparent",
                  boxShadow: 0,
                }}
              >
                <CardContent>
                  <BusinessIcon
                    sx={{ fontSize: 48, color: "#0288d1", mb: 1 }}
                  />
                  <Typography variant="h2">Instituciones</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    ✓ Incorporar gestión de riesgos
                    <br />
                    ✓ Capacitar al personal
                    <br />
                    ✓ Monitoreo constante
                    <br />✓ Apoyo en recuperación
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Final Mejorado */}

        <Box
          sx={{
            background: "linear-gradient(135deg, #2e7d32 0%, #e65100 100%)",
            color: "white",
            py: 5,
            px: 3,
            borderRadius: 4,
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <Typography variant="h1" sx={{ color: "white", mb: 2 }}>
            ¡Todos somos parte de la solución!
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
            La gestión de riesgos es una responsabilidad compartida que requiere
            la participación activa de toda la sociedad.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "white",
              color: "#2e7d32",
              "&:hover": { bgcolor: "#f5f5f5", transform: "scale(1.05)" },
            }}
          >
            Conoce cómo ayudar →
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
