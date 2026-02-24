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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Carousel from "../components/Navbar/carrusel";

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: "#40be27ff", // Verde oscuro
    },
    secondary: {
      main: "#e68210ff", // Rojo
    },
  },
  typography: {
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      margin: "1.5rem 0",
      color: "#e4e021ff",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 500,
      margin: "1rem 0",
      color: "#424242",
    },
    body1: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
    },
  },
});
const Home = () => {
  const carouselSlides = [
    {
      image:
        "https://tardeando.com/sitio/wp-content/uploads/2022/02/mitigacion1.jpg",
      alt: "Innovación tecnológica",
      title: "Predios colindantes a rios y quebradas",
      description:
        "Ordenanza 033-2021-Art 13.- Todos los propietarios de predios que colinden con márgenes de protección de ríos, quebradas y lagunas naturales en el cantón Loja, deberán cuidar la franja de protección correspondiente, y proteger el cauce de las aguas, para este fin el municipio de Loja autorizará la construcción de tajamares, muros u otras estructuras que ofrezcan resistencia a la fuerza de arrastre generada por el agua.",
      buttonText: "Ver ordenanza",
      imageFilter: "brightness(0.7)",
    },
    {
      image:
        "https://i0.wp.com/machalamovil.com/wp-content/uploads/2025/08/web-desing-editor-19.png?fit=1440%2C810&ssl=1",
      alt: "Planes de contingencia",
      title: "Eventos de concentración masiva",
      description:
        "Conocer acerca de los evento que se realizaran en el cantón Loja",
      buttonText: "Eventos de concentración masiva",
      buttonLink: "/eventos_concentracion_masiva",
      imageFilter: "brightness(0.6)",
    },
    {
      image:
        "https://www.kpnsafety.com/wp-content/uploads/2022/05/incendios-forestales-altas-temperaturas.jpg",
      alt: "Soporte técnico",
      title: "Incendios Forestales",
      description:
        "Conoce como se encuentra el nivel de alerta de cada parroquia parroquia y que medidas preventivas tomar",
      buttonText: "Nivel de alerta ",
      buttonLink: "analisis/fire_camp",
      imageFilter: "brightness(0.75)",
    },
  ];
  const colorTitles = "#e28b18ff";
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="ls">
        {/* Hero Section */}
        <Box
          sx={{
            py: 4,
          }}
        >
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

        <Card elevation={3} sx={{ mb: 2 }}>
          <CardContent>
            <Typography
              variant="h1"
              component="h2"
              align="center"
              sx={{ color: colorTitles }}
            >
              ¿Qué es la Gestión Integral de Riesgos de Desastres?
            </Typography>
            <Typography variant="body1" align="justify">
              La Ley de Gestión de Riesgos de Desastres (LOGIRD) contempla la
              posibilidad de ocurrencia de un evento que pueda afectar la
              economía, bienes materiales o vidas humanas.
            </Typography>
            <Typography variant="body1" align="justify">
              La Gestión del Riesgo se hace referencia al proceso social de
              planeación, ejecución, seguimiento y evaluación de políticas y
              acciones para el conocimiento del riesgo y promoción de una mayor
              conciencia del mismo.
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={3} sx={{ padding: "8px" }}>
          <CardContent>
            <Typography
              variant="h1"
              component="h2"
              align="center"
              sx={{ color: colorTitles }}
            >
              Objetivos de la LOGIRD
            </Typography>
            <Typography variant="body1" align="justify">
              La Ley Orgánica de Gestión Integral de Riesgos de Desastres tiene
              como objetivos principales:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1" align="justify">
                  Impedir o evitar que se generen riesgos
                </Typography>
              </li>
              <li>
                <Typography variant="body1" align="justify">
                  Reducir o controlar los riesgos existentes
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Prepararse y manejar situaciones de desastre
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Facilitar la recuperación post-desastre
                </Typography>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Sección de FAQ con Acordeones */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{ color: colorTitles }}
            align="center"
            gutterBottom
          >
            Preguntas Frecuentes
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h2">
                ¿Qué es la Agenda de Reducción de Riesgos de Desastres?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Es el conjunto de normas, estrategias, mapas y actividades que
                realiza una comunidad para evitar ser afectada y prevenir
                cualquier afectación a nivel de desastre. Incluye planes de
                contingencia, sistemas de alerta temprana y programas de
                capacitación.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h2">
                ¿Quién es el responsable de la gestión de riesgos?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Dentro de la Ley Orgánica de Gestión Integral de Riesgos de
                Desastres (LOGIRD), cada persona dentro del territorio nacional
                es corresponsable de la gestión de riesgos. Esto incluye:
              </Typography>
              <ul>
                <li>
                  <Typography>Ciudadanos individuales</Typography>
                </li>
                <li>
                  <Typography>Comunidades organizadas</Typography>
                </li>
                <li>
                  <Typography>Instituciones públicas y privadas</Typography>
                </li>
                <li>
                  <Typography>Gobiernos locales y nacionales</Typography>
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h2">
                ¿Cuáles son los componentes clave de la LOGIRD?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                La LOGIRD establece cuatro componentes fundamentales:
              </Typography>
              <ol>
                <li>
                  <Typography>
                    Prevención: Medidas para evitar la generación de nuevos
                    riesgos
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Mitigación: Acciones para reducir riesgos existentes
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Preparación: Planificación y capacitación para respuesta a
                    emergencias
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Recuperación: Rehabilitación y reconstrucción post-desastre
                  </Typography>
                </li>
              </ol>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Sección de Responsabilidades */}
        <Box
          sx={{
            bgcolor: "action.hover",
            p: 4,
            borderRadius: 2,
            mb: 6,
          }}
        >
          <Typography
            variant="h1"
            component="h2"
            align="center"
            gutterBottom
            sx={{ color: colorTitles }}
          >
            Responsabilidades según la LOGIRD
          </Typography>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h2" align="center">
                    Ciudadanos
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography>
                    - Participar en actividades de prevención
                    <br />
                    - Conocer los riesgos en su área
                    <br />
                    - Seguir instrucciones en emergencias
                    <br />- Reportar situaciones de riesgo
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h2" align="center">
                    Gobiernos Locales
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography>
                    - Elaborar mapas de riesgo
                    <br />
                    - Desarrollar planes de contingencia
                    <br />
                    - Mantener sistemas de alerta temprana
                    <br />- Coordinar respuesta en emergencias
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h2" align="center">
                    Instituciones
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography>
                    - Incorporar gestión de riesgos en proyectos
                    <br />
                    - Capacitar a su personal
                    <br />
                    - Contribuir a sistemas de monitoreo
                    <br />- Apoyar en respuesta y recuperación
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Llamado a la acción */}
        <Box
          sx={{
            bgcolor: "rgba(238, 237, 233, 0.33)",
            color: "white",
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h1"
            component="h2"
            gutterBottom
            sx={{ color: colorTitles }}
          >
            ¡Todos somos parte de la solución!
          </Typography>
          <Typography variant="h5" sx={{ color: "black" }}>
            La gestión de riesgos es una responsabilidad compartida que requiere
            la participación activa de toda la sociedad.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
