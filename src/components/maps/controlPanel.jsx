import React from "react";
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
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const InfoPanel = ({coords,setCoords}) => {
  // Estilos personalizados

  //Edit coord in array
  const handleCoordChange = (index, value) => {
    const nuevoValor = parseFloat(value) || 0;
    setCoords(prev => {
      const nuevasCoords = [...prev];
      nuevasCoords[index] = nuevoValor;
      return nuevasCoords;
    });
  };

  const RiskIndicator = styled("span")(({ theme }) => ({
    display: "inline-block",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    marginRight: theme.spacing(1),
    verticalAlign: "middle",
  }));

  const RiskHigh = styled("span")(({ theme }) => ({
    color: theme.palette.error.main,
  }));

  const RiskMedium = styled("span")(({ theme }) => ({
    color: theme.palette.warning.main,
  }));

  const RiskLow = styled("span")(({ theme }) => ({
    color: theme.palette.success.main,
  }));

  const InfoSection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    "&.low": {
      backgroundColor: theme.palette.success.light,
      fontWeight: "bold",
    },
    "&.medium": {
      backgroundColor: theme.palette.warning.light,
      fontWeight: "bold",
    },
    "&.high": {
      backgroundColor: theme.palette.error.light,
      fontWeight: "bold",
    },
  }));

  return (
    <Box
     // maxWidth="md"
      sx={{
        height: "85vh",
       // py: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: (theme) => theme.palette.primary.main,
            borderRadius: "3px",
          },
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            position: "sticky",
            top: 0,
            bgcolor: "background.default",
            zIndex: 1,
            py: 1,
          }}
        >
          Mapa de susceptibilidad
        </Typography>
        <InfoSection elevation={3}>
          <Typography variant="h5" gutterBottom>
            Instrucciones
          </Typography>
          <Typography paragraph>
            1. Haz clic en cualquier punto del mapa <strong>o</strong>Ingresa
            coordenadas manualmente
          </Typography>          
          <Typography paragraph>3. Genera tu reporte en PDF</Typography>
          <Typography variant="body2" color="text.secondary">
            Centro del mapa: -3.99576, -79.20190 (Loja, Ecuador)
          </Typography>
        </InfoSection>
        <InfoSection elevation={3}>
          <Typography variant="h6" gutterBottom>
            Buscar por Coordenadas
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{xs:12}}>
              <TextField
                fullWidth
                defaultValue={coords[0]}
                onChange={(e) => handleCoordChange(0, e.target.value)}
                id="latitude"
                label="Latitud"
                placeholder="Ej: -3.99313"
                variant="outlined"
                type="number"
          
              />
            </Grid>
            <Grid item size={{xs:12}}>
              <TextField
                fullWidth
                id="longitude"
                onChange={(e) => handleCoordChange(1, e.target.value)}
                defaultValue={coords[1]}
                label="Longitud"
                placeholder="Ej: -79.20422"
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item size={{xs:12}}>
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
        
       {/*  <InfoSection elevation={3} id="risk-calculation">
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
                <StyledTableCell className="low" align="center">
                  Bajo
                </StyledTableCell>
                <StyledTableCell className="low" align="center">
                  Bajo
                </StyledTableCell>
                <StyledTableCell className="medium" align="center">
                  Medio
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Medio (2)</TableCell>
                <StyledTableCell className="low" align="center">
                  Bajo
                </StyledTableCell>
                <StyledTableCell className="medium" align="center">
                  Medio
                </StyledTableCell>
                <StyledTableCell className="high" align="center">
                  Alto
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Alto (3)</TableCell>
                <StyledTableCell className="medium" align="center">
                  Medio
                </StyledTableCell>
                <StyledTableCell className="high" align="center">
                  Alto
                </StyledTableCell>
                <StyledTableCell className="high" align="center">
                  Alto
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </InfoSection> */}

        <InfoSection elevation={3}>
          <Typography variant="h5" gutterBottom>
            Leyenda
          </Typography>
          <Typography paragraph>
            <strong>Amenazas:</strong>
          </Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor: "#ffff00" }} />
         <strong>   Movimiento en masa</strong> <br/>
         Considerado como deslizamientos, flujos, deslaves y caida de rocas 
          </Typography>
          <Typography paragraph>
            <RiskIndicator sx={{ bgcolor: "#0000ff" }} />
           <strong> Inundación</strong> <br/>
            Considerado como desbordamientos de ríos, acumulación hídrica, crecidas súbitas y anegamientos
          </Typography>
          
        </InfoSection>
      </Box>

      <Box
        id="pdf-report"
        sx={{
          mt: "auto",
          pt: 2,
          position: "sticky",
          bottom: 0,
          bgcolor: "background.default",
        }}
      >
        <Button
          id="generate-pdf"
          onClick={()=>alert("Esta funcion no se encuentra habilitada")}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Generar Reporte PDF
        </Button>
      </Box>
    </Box>
  );
};

export default InfoPanel;
