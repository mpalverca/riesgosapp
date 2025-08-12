import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Grid,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';

const InfoPanel = () => {
  // Estilos personalizados
  const RiskIndicator = styled('span')(({ theme }) => ({
    display: 'inline-block',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    marginRight: theme.spacing(1),
    verticalAlign: 'middle'
  }));

  const RiskHigh = styled('span')(({ theme }) => ({
    color: theme.palette.error.main
  }));

  const RiskMedium = styled('span')(({ theme }) => ({
    color: theme.palette.warning.main
  }));

  const RiskLow = styled('span')(({ theme }) => ({
    color: theme.palette.success.main
  }));

  const InfoSection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    '&.low': {
      backgroundColor: theme.palette.success.light,
      fontWeight: 'bold'
    },
    '&.medium': {
      backgroundColor: theme.palette.warning.light,
      fontWeight: 'bold'
    },
    '&.high': {
      backgroundColor: theme.palette.error.light,
      fontWeight: 'bold'
    }
  }));

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        height: '75vh',
        py: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: (theme) => theme.palette.primary.main,
            borderRadius: '3px',
          },
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ position: 'sticky', top: 0, bgcolor: 'background.default', zIndex: 1, py: 1 }}>
          Loja - Análisis de Riesgos
        </Typography>
        
        <InfoSection elevation={3}>
          <Typography variant="h5" gutterBottom>
            Buscar por Coordenadas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="latitude"
                label="Latitud"
                placeholder="Ej: -3.99313"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="longitude"
                label="Longitud"
                placeholder="Ej: -79.20422"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="clavecatas"
                label="Clave Catastral"
                placeholder="Ej: 1100141123458"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                id="search-btn" 
                variant="contained" 
                color="primary"
                fullWidth
                size="large"
              >
                Buscar en Mapa
              </Button>
            </Grid>
          </Grid>
        </InfoSection>
        
        <InfoSection elevation={3}>
          <Typography variant="h5" gutterBottom>
            Instrucciones
          </Typography>
          <Typography paragraph>1. Haz clic en cualquier punto del mapa <strong>o</strong>Ingresa coordenadas manualmente <strong>o</strong> clave catastral</Typography>
          <Typography paragraph>2. Analiza los polígonos que intersectan</Typography>
          <Typography paragraph>3. Genera tu reporte en PDF</Typography>
          <Typography variant="body2" color="text.secondary">
            Centro del mapa: -3.99576, -79.20190 (Loja, Ecuador)
          </Typography>
        </InfoSection>
        
        <InfoSection elevation={3} id="intersection-info">
          <Typography variant="h5" gutterBottom>
            Información de Intersección
          </Typography>
          <Typography>
            Selecciona un punto en el mapa o ingresa coordenadas para ver el análisis de riesgo.
          </Typography>
        </InfoSection>
        
        <InfoSection elevation={3} id="risk-calculation">
          <Typography variant="h5" gutterBottom>
            Cálculo de Riesgo
          </Typography>
          <Typography paragraph>
            La matriz de riesgo combina niveles de amenaza y vulnerabilidad:
          </Typography>
          
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Amenaza \ Vulnerabilidad</TableCell>
                <TableCell align="center">Bajo (1)</TableCell>
                <TableCell align="center">Medio (2)</TableCell>
                <TableCell align="center">Alto (3)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th">Bajo (1)</TableCell>
                <StyledTableCell className="low" align="center">Bajo</StyledTableCell>
                <StyledTableCell className="low" align="center">Bajo</StyledTableCell>
                <StyledTableCell className="medium" align="center">Medio</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Medio (2)</TableCell>
                <StyledTableCell className="low" align="center">Bajo</StyledTableCell>
                <StyledTableCell className="medium" align="center">Medio</StyledTableCell>
                <StyledTableCell className="high" align="center">Alto</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Alto (3)</TableCell>
                <StyledTableCell className="medium" align="center">Medio</StyledTableCell>
                <StyledTableCell className="high" align="center">Alto</StyledTableCell>
                <StyledTableCell className="high" align="center">Alto</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </InfoSection>
        
        <InfoSection elevation={3}>
          <Typography variant="h5" gutterBottom>
            Leyenda
          </Typography>
          <Typography paragraph><strong>Amenazas:</strong></Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor: "#ffff00" }} />
            Movimiento en masa
          </Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor:  "#0000ff" }} />
            Inundación
          </Typography>
          <Typography paragraph><strong>Vulnerabilidades:</strong></Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor: 'info.main' }} />
            Vulnerabilidad
          </Typography>
          <Typography paragraph><strong>Eventos reportados:</strong></Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor: 'error.main' }} />
            Movimiento en masa
          </Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor: 'secondary.main' }} />
            Inundación
          </Typography>
          <Typography paragraph><strong>Niveles de riesgo:</strong></Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor: 'error.main' }} />
            <RiskHigh>Alto (3)</RiskHigh>
          </Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor: 'warning.main' }} />
            <RiskMedium>Medio (2)</RiskMedium>
          </Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor: 'success.main' }} />
            <RiskLow>Bajo (1)</RiskLow>
          </Typography>
        </InfoSection>
      </Box>
      
      <Box 
        id="pdf-report" 
        sx={{ 
          mt: 'auto',
          pt: 2,
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.default'
        }}
      >
        <Button 
          id="generate-pdf" 
          variant="contained" 
          color="primary"
          fullWidth
          size="large"
        >
          Generar Reporte PDF
        </Button>
      </Box>
    </Container>
  );
};

export default InfoPanel;