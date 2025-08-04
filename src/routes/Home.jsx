import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Divider,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Imágenes de ejemplo (URLs)
const riskManagementImg = 'https://www.lahora.com.ec/__export/1744870377270/sites/lahora/img/2025/04/17/20250417_121248643_Las_zonas_de_Loja_mxs_vulnerables_a_fuertes_lluvias.jpg_1443152915.jpg';
const disasterImg = 'https://www.eluniverso.com/resizer/v2/VFLD3MA5GJHUFEKIJEXJ4ZFTWQ.png?auth=4e159b9dcada17f27f80bbae6fd666b3d8c15a7b25bd3d44635c3f2e9748152b&width=640&height=359&quality=75&smart=true';
const preventionImg = 'https://ubuinvestiga.es/wp-content/uploads/2022/04/riesgo-empresarial.jpg';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#40be27ff', // Verde oscuro
    },
    secondary: {
      main: '#e68210ff', // Rojo
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      margin: '1.5rem 0',
      color: '#e4e021ff',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
      margin: '1rem 0',
      color: '#424242',
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
    },
  },
});
const Home = () => {
    return (
<ThemeProvider theme={theme}>
      <Container maxWidth="ls">
        {/* Hero Section */}
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 8, 
          textAlign: 'center',
          borderRadius: 2,
          mb: 4,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${riskManagementImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Gestión Integral de Riesgos de Desastres
          </Typography>
          <Typography variant="h5" component="h2">
            Protegiendo comunidades y construyendo resiliencia
          </Typography>
          {/* <Button variant="contained" color="secondary" size="large" sx={{ mt: 3 }}>
            Conoce más
          </Button> */}
        </Box>

        {/* Sección de Introducción */}
       
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="300"
                image={disasterImg}
                alt="Gestión de riesgos"
              />
              <CardContent>
                <Typography variant="h1" component="h2">
                  ¿Qué es la Gestión Integral de Riesgos de Desastres?
                </Typography>
                <Typography variant="body1" paragraph>
                  La Ley de Gestión de Riesgos de Desastres (LOGIRD) contempla la posibilidad de ocurrencia de un evento que pueda afectar la economía, bienes materiales o vidas humanas.
                </Typography>
                <Typography variant="body1" paragraph>
                  La Gestión del Riesgo se hace referencia al proceso social de planeación, ejecución, seguimiento y evaluación de políticas y acciones para el conocimiento del riesgo y promoción de una mayor conciencia del mismo.
                </Typography>
              </CardContent>
            </Card>
         
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="300"
                image={preventionImg}
                alt="Prevención de desastres"
              />
              <CardContent>
                <Typography variant="h1" component="h2">
                  Objetivos de la LOGIRD
                </Typography>
                <Typography variant="body1" paragraph>
                  La Ley Orgánica de Gestión Integral de Riesgos de Desastres tiene como objetivos principales:
                </Typography>
                <ul>
                  <li><Typography variant="body1">Impedir o evitar que se generen riesgos</Typography></li>
                  <li><Typography variant="body1">Reducir o controlar los riesgos existentes</Typography></li>
                  <li><Typography variant="body1">Prepararse y manejar situaciones de desastre</Typography></li>
                  <li><Typography variant="body1">Facilitar la recuperación post-desastre</Typography></li>
                </ul>
              </CardContent>
            </Card>
       

        {/* Sección de FAQ con Acordeones */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h1" component="h1" align="center" gutterBottom>
            Preguntas Frecuentes
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h2">¿Qué es la Agenda de Reducción de Riesgos de Desastres?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Es el conjunto de normas, estrategias, mapas y actividades que realiza una comunidad para evitar ser afectada y prevenir cualquier afectación a nivel de desastre. Incluye planes de contingencia, sistemas de alerta temprana y programas de capacitación.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h2">¿Quién es el responsable de la gestión de riesgos?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Dentro de la Ley Orgánica de Gestión Integral de Riesgos de Desastres (LOGIRD), cada persona dentro del territorio nacional es corresponsable de la gestión de riesgos. Esto incluye:
              </Typography>
              <ul>
                <li><Typography>Ciudadanos individuales</Typography></li>
                <li><Typography>Comunidades organizadas</Typography></li>
                <li><Typography>Instituciones públicas y privadas</Typography></li>
                <li><Typography>Gobiernos locales y nacionales</Typography></li>
              </ul>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h2">¿Cuáles son los componentes clave de la LOGIRD?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                La LOGIRD establece cuatro componentes fundamentales:
              </Typography>
              <ol>
                <li><Typography>Prevención: Medidas para evitar la generación de nuevos riesgos</Typography></li>
                <li><Typography>Mitigación: Acciones para reducir riesgos existentes</Typography></li>
                <li><Typography>Preparación: Planificación y capacitación para respuesta a emergencias</Typography></li>
                <li><Typography>Recuperación: Rehabilitación y reconstrucción post-desastre</Typography></li>
              </ol>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Sección de Responsabilidades */}
        <Box sx={{ 
          bgcolor: 'action.hover', 
          p: 4, 
          borderRadius: 2,
          mb: 6
        }}>
          <Typography variant="h1" component="h2" align="center" gutterBottom>
            Responsabilidades según la LOGIRD
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h2" align="center">Ciudadanos</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography>
                    - Participar en actividades de prevención<br />
                    - Conocer los riesgos en su área<br />
                    - Seguir instrucciones en emergencias<br />
                    - Reportar situaciones de riesgo
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h2" align="center">Gobiernos Locales</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography>
                    - Elaborar mapas de riesgo<br />
                    - Desarrollar planes de contingencia<br />
                    - Mantener sistemas de alerta temprana<br />
                    - Coordinar respuesta en emergencias
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h2" align="center">Instituciones</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography>
                    - Incorporar gestión de riesgos en proyectos<br />
                    - Capacitar a su personal<br />
                    - Contribuir a sistemas de monitoreo<br />
                    - Apoyar en respuesta y recuperación
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Llamado a la acción */}
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 4, 
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h1" component="h2" gutterBottom>
            ¡Todos somos parte de la solución!
          </Typography>
          <Typography variant="h5" paragraph>
            La gestión de riesgos es una responsabilidad compartida que requiere la participación activa de toda la sociedad.
          </Typography>
          <Button variant="contained" color="secondary" size="large">
            Descarga Guías de Prevención
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
    
export default Home;