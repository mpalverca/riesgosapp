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
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Iconos
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChecklistIcon from "@mui/icons-material/Checklist";
import WarningIcon from "@mui/icons-material/Warning";
import UpdateIcon from "@mui/icons-material/Update";
import GroupIcon from "@mui/icons-material/Group";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EngineeringIcon from "@mui/icons-material/Engineering";
import CalculateIcon from "@mui/icons-material/Calculate";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import { useDetailSector } from "./script";
import { dataSector } from "../ComiteComu";

export default function Panel({ selectedValue, setSelectedValue, ...props }) {
  const { sectorD, sLoading, sError, detailSector, clearSectorData } =
    useDetailSector();

  const barriosOptions = Array.isArray(props.data) ? props.barData : [];

  const sectorview = props.data
    .map((feature) => {
      if (feature?.properties) {
        const barrio = feature.properties.barrio;
        const sector = feature.properties.sector;
        if (barrio && barrio.trim() === selectedValue?.trim()) {
          return sector;
        }
      }
      return null;
    })
    .filter((sector) => sector && typeof sector === "string")
    .map((sector) => sector.trim())
    .filter((sector, index, array) => array.indexOf(sector) === index)
    .sort();

  // Efecto para actualizar props cuando sectorD cambie
  useEffect(() => {
    if (sectorD !== null && sectorD !== undefined) {
      props.setSelectSect(sectorD);
      console.log("Sector actualizado:", sectorD);
    }
  }, [sectorD, props.setSelectSect]);

  const handleSearch = async () => {
    if (!selectedValue) {
      console.warn("No hay valor seleccionado");
      return;
    }

    try {
      await detailSector(selectedValue);
      // No necesitas llamar a props.setSelectSect aquí porque el useEffect lo hará
    } catch (error) {
      console.error("Error al buscar sector:", error);
    }
  };

  const handleComiteSearch = (event) => {
    props.getComite("read", "comite", props.selectComite);
    props.getBrigada.read("read", "brigada", props.selectComite);
  };
  const handleComiteChange = (event) => {
    const comiteValue = event.target.value;
    props.setComite(comiteValue);
  };
  const handleClear = () => {
    clearSectorData();
    setSelectedValue(null);
    props.setSelectSect(null);
  };

  if (barriosOptions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No hay barrios disponibles para seleccionar
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 1 }, mx: "auto" }}>
      {/* Título */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          mb: 1,
        }}
      >
        {props.title || "Panel de Consulta"}
      </Typography>

      {/* Advertencia */}
      <Alert
        severity="warning"
        icon={<WarningIcon />}
        sx={{
          mb: 1,
          borderRadius: 2,
          "& .MuiAlert-message": { width: "100%" },
        }}
      >
        <Typography variant="body2">
          <strong>Importante:</strong> La información presentada es de manera
          referencial y deberá asumirse con el mayor cuidado y responsabilidad
          ya que la divulgación inadecuada de la misma está sujeta a acciones y
          sanciones contempladas en la Ley Organica de Gestión Integral de Riesgos de Desastres (LOGIRD).
        </Typography>
      </Alert>

      <Divider sx={{ mb: 2 }} />

      {/* Barra de búsqueda */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          bgcolor: "#fafafa",
        }}
      >
        {!selectedValue && !sLoading && !sError && !sectorD && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 2 }}
          >
            Selecciona un barrio y haz clic en "Consultar" para ver la
            información
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <SearchIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" fontWeight={600}>
            Buscar Información de Barrio
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={barriosOptions}
              value={selectedValue}
              onChange={(event, newValue) => {
                setSelectedValue(newValue);

                if (sectorD) clearSectorData();
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecciona un barrio"
                  variant="outlined"
                  fullWidth
                  helperText="Selecciona un barrio de la lista"
                />
              )}
            />
          </Grid>
          <Grid
            item
            size={{ xs: 12, md: 6 }}
            sx={{ gap: 2, alignContent: "space-between" }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={!selectedValue || sLoading}
              startIcon={
                sLoading ? <CircularProgress size={20} /> : <SearchIcon />
              }
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                mb: { xs: 0, md: 1 },
              }}
            >
              {sLoading ? "Consultando..." : "Consultar"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleClear}
              disabled={!sectorD && !selectedValue}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Estados de carga y error */}
      {sLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            Cargando información del barrio...
          </Typography>
        </Box>
      )}

      {sError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          Error: {sError}
        </Alert>
      )}

      {/* Resultados */}
      {sectorD && !sLoading && (
        <Box>
          {sectorD.resultados && Array.isArray(sectorD.resultados) ? (
            <>
              {sectorD.resultados.map((item, index) => (
                <BarrioResultItem key={index} item={item} index={index} />
              ))}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  bgcolor: "#fafafa",
                }}
              >
                {" "}
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Seleccionar Comité Comunitario
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth size="medium">
                      <InputLabel id="comite-select-label">
                        Comité Comunitario
                      </InputLabel>
                      <Select
                        labelId="comite-select-label"
                        id="comite-select"
                        value={props.selectComite}
                        label="Comité Comunitario"
                        onChange={handleComiteChange}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">
                          <em>Ninguno</em>
                        </MenuItem>
                        {sectorD.resultados.map((item, idx) => (
                          <MenuItem
                            key={idx}
                            value={item.comite || item.sector}
                          >
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography variant="body1" fontWeight={500}>
                                {item.comite || "Comité no especificado"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Sector: {item.sector || "N/A"} | Total:{" "}
                                {item.total || 0}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleComiteSearch}
                      disabled={!selectedValue || props.loadingComite}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        mb: { xs: 0, md: 1 },
                      }}
                    >
                      {props.loadingComite ? "Consultando..." : "Consultar"}
                    </Button>
                  </Grid>
                </Grid>
                {props.selectComite && (
                  <Alert
                    severity="info"
                    sx={{ borderRadius: 2, my: 2 }}
                    icon={<InfoIcon />}
                  >
                    <Typography variant="body2">
                      <strong>Comité seleccionado:</strong> {props.selectComite}
                    </Typography>
                  </Alert>
                )}
              </Paper>{" "}
            </>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              No se encontraron resultados para este barrio.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
}

// Componente de resultado mejorado
const BarrioResultItem = ({ item, index }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 1,
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      {/* Encabezado minimalista */}
      <Box
        sx={{
          p: 2.5,
          // bgcolor: "primary.main",
          //color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocationOnIcon sx={{ mr: 1.5 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {item.sector || "Sin nombre"}
          </Typography>
        </Box>
        {item.comite && (
          <Chip
            label={`Comité: ${item.comite || "No especificado"}`}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              //color: "white",
              fontSize: "1.5rem",
            }}
          />
        )}
      </Box>

      {/* Contenido principal */}
      <Box sx={{ p: 1 }}>
        {/* Título de criterios */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <ChecklistIcon sx={{ mr: 1.5, color: "secondary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Criterios de Priorización
          </Typography>
        </Box>

        {/* Grid de criterios - 2 columnas en desktop, 1 en móvil */}
        <Grid container spacing={3}>
          {[
            {
              title: "Exposición a eventos",
              value: item.exp_evnt,
              color: "#ef5350",
              icon: <WarningIcon />,
              description:
                "(Sismo, inundaciones, deslizamientos, erupciones volcánicas, incendios forestales, aguajes, tsunamis, etc.)",
              formula:
                "1 Evento = 0.5 | 2 Eventos = 1 | 3 Eventos = 1.5 | 4 + Evento = 2",
            },
            {
              title: "Recurrencia de eventos",
              value: item.rq_evnt,
              color: "#ff9800",
              icon: <UpdateIcon />,
              description: "Frecuencia de ocurrencia de eventos",
              formula:
                "Cada 1 año = 2 | Cada 5 años = 1.5 | Cada 10 años = 1 | Mayor a 10 Años =0.5",
            },
            {
              title: "Vulnerabilidad socio-organizativa",
              value: item.vuln_evnt,
              color: "#26c6da",
              icon: <GroupIcon />,
              description:
                "(Sin organización de base, sin participación en acciones de rrd, sin planes de gestión de riesgos, sin sistemas de alerta)",
              formula: "Muy Alta=2 | Alta=1.5 | Media=1 | Baja=1",
            },
            {
              title: "Acceso a recursos",
              value: item.a_r_emerg,
              color: "#66bb6a",
              icon: <LocalHospitalIcon />,
              description:
                "Centros de Salud, Centros Educativos, Policía, Bomberos.",
              formula: "Ninguna=2 | Uno=1.5 | Dos a tres =1 |  Mas de tres=0.5",
            },
            {
              title: "Proyectos de RRD",
              value: item.pry_rrd,
              color: "#42a5f5",
              icon: <EngineeringIcon />,
              description: "SAT, Reubicación, Obras de mitigación",
              formula: "Existe=0.5| No existe=2",
            },
          ].map((criterio, idx) => (
            <Grid item size={{ xs: 12, md: 2 }} key={idx}>
              <CriterioCard {...criterio} />
            </Grid>
          ))}

          {/* Tarjeta de total - ocupa todo el ancho */}
          <Grid item size={{ xs: 12, md: 2 }}>
            <TotalCard total={item.total} />
          </Grid>
        </Grid>

        {/* Observaciones */}
        {item.observaciones && (
          <Alert
            severity="info"
            icon={<InfoIcon />}
            sx={{ borderRadius: 2, mt: 3 }}
          >
            <Typography variant="body2">
              <strong>Observaciones:</strong> {item.observaciones}
            </Typography>
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

// Componente de criterio minimalista
const CriterioCard = ({ title, value, color, icon, description, formula }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: "1px solid #f0f0f0",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: color,
          boxShadow: `0 2px 8px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box sx={{ color: color, mr: 1, display: "flex", mb: 5 }}>{icon}</Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            my: 5,
            color: color,
          }}
        >
          {value || "N/A"}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            display: "block",
            textAlign: "center",
            mb: 1,
          }}
        >
          {description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "block",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {formula}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Componente de total mejorado
const TotalCard = ({ total }) => {
  const getColor = () => {
    const value = total || 0;
    if (value <= 3.9) return { main: "#4caf50", light: "#4caf5020" };
    if (value <= 6.9) return { main: "#ffc107", light: "#ffc10720" };
    return { main: "#dc3545", light: "#dc354520" };
  };

  const color = getColor();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `2px solid ${color.light}`,
        background: `linear-gradient(135deg, ${color.light} 0%, transparent 100%)`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CalculateIcon sx={{ mr: 1.5, color: color.main }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            PUNTAJE TOTAL DE PRIORIZACIÓN
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            textAlign: "center",
            //my: 2,
            color: color.main,
            fontSize: { xs: "3.5rem", sm: "5rem", md: "6rem" },
          }}
        >
          {total || "0"}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 3 }}
        >
          Puntaje de priorización (Escala 0-10)
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(((total || 0) / 10) * 100, 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: color.main,
              borderRadius: 4,
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          {[
            { label: "Baja", range: "0-3", color: "#4caf50" },
            { label: "Media", range: "4-6", color: "#ffc107" },
            { label: "Alta", range: "7-10", color: "#dc3545" },
          ].map((level) => (
            <Box key={level.label} sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{ color: level.color, fontWeight: 600 }}
              >
                {level.label}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                {level.range}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
