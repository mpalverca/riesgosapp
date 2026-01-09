import { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Box,
  Autocomplete,
  TextField,
  Chip,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Iconos
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChecklistIcon from '@mui/icons-material/Checklist';
import WarningIcon from '@mui/icons-material/Warning';
import UpdateIcon from '@mui/icons-material/Update';
import GroupIcon from '@mui/icons-material/Group';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CalculateIcon from '@mui/icons-material/Calculate';
import InfoIcon from '@mui/icons-material/Info';

const sector_info =
  "https://script.google.com/macros/s/AKfycbw7vtu_OvQBjpIkqpBqm-X4cG2PMfkkRCQRHQPyIENrn3za_BAdBwoWqLBZSAJWuFo7/exec";

// Styled component para los items de la lista
const AlertItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const BulletPoint = styled(Box)(({ theme }) => ({
  minWidth: "24px",
  height: "24px",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
  marginRight: theme.spacing(1.5),
  marginTop: "2px",
}));

export default function Panel({ selectedValue, setSelectedValue, ...props }) {
  const [sectorData, setSectorData] = useState(null);
  const n_color = {
    ALTA: "#dc3545",
    MEDIA: "#ffc107",
    BAJA: "#28a745",
    DEFAULT: "#007bff",
  };
  // Obtener las acciones según el nivel de alerta

  // Dividir los eventos por puntos y crear array de líneas
  const getEventLines = () => {
    if (!props.data?.event_reg) return [];

    // Dividir por puntos y limpiar espacios en blanco
    return props.data.event_reg
      .split(".")
      .map((event) => event.trim())
      .filter((event) => event.length > 0);
  };

  const eventLines = getEventLines();

  return (
    <div>
      <Typography variant="h4" align="center">
        <strong>{props.title}</strong>
      </Typography>
      <div
        style={{
          padding: "5px",
          backgroundColor: "#fff3cd",
          borderLeft: "7px solid #4f1cdbff",
          borderRadius: "4px",
          color: "#856404",
          margin: "2px 0",
        }}
      >
        <Typography align="justify" variant="body2">
          <strong> ⚠️ Importante:</strong> La información presentada es de
          manera referencial y deberá asumirse con el mayor cuidado y
          responsabilidad ya que la divulgación inadecuada de la misma está
          sujeta a acciones y sanciones contempladas en la LOGIRD.
        </Typography>
      </div>
      <Divider sx={{ mt: "10px" }} />
      <Autocomplete
        sx={{ mt: "10px" }}
        options={props.data}
        value={selectedValue}
        onChange={(event, newValue) => {
          setSelectedValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecciona barrio"
            variant="outlined"
            fullWidth
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} key={index} />
          ))
        }
      />
      <Divider sx={{ mt: "10px" }} />
      <Button
        fullWidth
        variant="contained"
        onClick={async () => {
          const getSector = await detailSector(selectedValue);
          setSectorData(getSector.resultados);
        }}
      >
        Consultar
      </Button>
      <Divider sx={{ mt: "10px" }} />
      <Box>
        {sectorData &&
          sectorData.map((item, index) => {
            return (
              <Box
                sx={{
                  borderBottom: "2px solid #e0e0e0",
                  pb: 2,
                  mb: 3,
                  borderRadius: 1,
                  p: 2,
                  backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 2,
                    backgroundColor: "#f0f7ff",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Encabezado del sector */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Sector:
                    <Box component="span" sx={{ ml: 1, color: "text.primary" }}>
                      {item.sector}
                    </Box>
                  </Typography>

                  {/* Badge de estado */}
                  <Chip
                    label={item.estado}
                    color={
                      item.estado?.toLowerCase() === "activo"
                        ? "success"
                        : item.estado?.toLowerCase() === "pendiente"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Box>

                {/* Sección de Criterios de Priorización */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <ChecklistIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      color="secondary"
                      sx={{ fontWeight: "bold" }}
                    >
                      Checklist de Criterios de Priorización
                    </Typography>
                  </Box>

                  {/* Grid para los criterios */}
                  <Grid container spacing={2}>
                    {/* Exposición a eventos peligrosos */}
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={1}
                        sx={{
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <WarningIcon
                              color="error"
                              sx={{ mr: 1, fontSize: 20 }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              Exposición a eventos
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Sismo, inundaciones, deslizamientos, erupciones
                            volcánicas, incendios forestales, etc.
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              Un evento = 0.5 • Dos eventos = 1 • Tres eventos =
                              1.5 • Cuatro eventos o más = 2
                            </Typography>
                            <Chip
                              label={item.exp_evnt}
                              color="error"
                              size="small"
                              sx={{ fontWeight: "bold", ml: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Recurrencia de eventos */}
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={1}
                        sx={{
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <UpdateIcon
                              color="warning"
                              sx={{ mr: 1, fontSize: 20 }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              Recurrencia de eventos
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Frecuencia de ocurrencia de eventos peligrosos
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              Cada año = 2 • Cada 5 años = 1.5 • Cada 10 años =
                              1 • Mayor a 10 años = 0.5
                            </Typography>
                            <Chip
                              label={item.rq_evnt}
                              color="warning"
                              size="small"
                              sx={{ fontWeight: "bold", ml: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Vulnerabilidad socio-organizativa */}
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={1}
                        sx={{
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <GroupIcon
                              color="info"
                              sx={{ mr: 1, fontSize: 20 }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              Vulnerabilidad socio-organizativa
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Sin organización de base, sin participación en
                            acciones de RRD, sin planes de gestión de riesgos
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              Muy Alta = 2 • Alta = 1.5 • Media = 1 • Baja = 0.5
                            </Typography>
                            <Chip
                              label={item.vuln_evnt}
                              color="info"
                              size="small"
                              sx={{ fontWeight: "bold", ml: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Acceso a recursos de emergencias */}
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={1}
                        sx={{
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <LocalHospitalIcon
                              color="success"
                              sx={{ mr: 1, fontSize: 20 }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              Acceso a recursos
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Centro de Salud, Centros Educativos, Policías,
                            Bomberos
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              Ninguna = 2 • Uno = 1.5 • Dos a tres = 1 • Más de
                              tres = 0.5
                            </Typography>
                            <Chip
                              label={item.a_r_emerrg}
                              color="success"
                              size="small"
                              sx={{ fontWeight: "bold", ml: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Proyectos de RRD */}
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={1}
                        sx={{
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <EngineeringIcon
                              color="primary"
                              sx={{ mr: 1, fontSize: 20 }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              Proyectos de RRD
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            SAT, Proyectos de reubicación, obras de mitigación
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              Existe = 2 • No existe = 0.5
                            </Typography>
                            <Chip
                              label={item.pry_rrd}
                              color="primary"
                              size="small"
                              sx={{ fontWeight: "bold", ml: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Total - Destacado */}
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={3}
                        sx={{
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <CalculateIcon
                              sx={{ mr: 1, fontSize: 24, color: "white" }}
                            />
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "white" }}
                            >
                              PUNTAJE TOTAL
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center", mt: 2, mb: 1 }}>
                            <Typography
                              variant="h2"
                              sx={{
                                fontWeight: "bold",
                                color: "white",
                                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                              }}
                            >
                              {item.total}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(255,255,255,0.8)",
                                display: "block",
                                mt: 1,
                              }}
                            >
                              Puntaje de priorización
                            </Typography>
                          </Box>
                          {/* Indicador de nivel de prioridad */}
                          <Box sx={{ mt: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min((item.total / 10) * 100, 100)}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "rgba(255,255,255,0.2)",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "#ffd700",
                                },
                              }}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "rgba(255,255,255,0.8)" }}
                              >
                                Baja
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "rgba(255,255,255,0.8)" }}
                              >
                                Media
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "rgba(255,255,255,0.8)" }}
                              >
                                Alta
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Footer con información adicional si existe */}
                {item.observaciones && (
                  <Alert
                    severity="info"
                    icon={<InfoIcon />}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    <Typography variant="body2">
                      <strong>Observaciones:</strong> {item.observaciones}
                    </Typography>
                  </Alert>
                )}
              </Box>
            );
          })}
      </Box>
    </div>
  );
}

export const detailSector = async (barrio) => {
  try {
    // setLoading(true);
    let url = `${sector_info}?barrio=${barrio}`;
    console.log(barrio);
    console.log(url);
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    if (result.status === "success") {
    } else {
      console.error("Error al obtener datos:", result);
    }
    return result;
  } catch (error) {
    console.error("Error:", error);
    alert(`error: `, error);
  } finally {
    // setLoading(false);
  }
};
