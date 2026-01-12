import { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";

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

// Hook personalizado (crea este archivo en ./hooks/useDetailSector.js)
const useDetailSector = () => {
  const [sectorData, setSectorData] = useState(null);
  const [sectorLoading, setLoading] = useState(false);
  const [sectorError, setError] = useState(null);
  const sector_info =
    "https://script.google.com/macros/s/AKfycbw7vtu_OvQBjpIkqpBqm-X4cG2PMfkkRCQRHQPyIENrn3za_BAdBwoWqLBZSAJWuFo7/exec";

  const detailSector = async (barrio) => {
    if (!barrio || barrio.trim() === "") {
      setError("El barrio no puede estar vacío");
      return null;
    }

    setLoading(true);
    setError(null);
    setSectorData(null);

    try {
      const url = `${sector_info}?barrio=${encodeURIComponent(barrio)}`;
      console.log("🔍 Buscando datos para barrio:", barrio);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 Datos recibidos:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      setSectorData(result);
      return result;
    } catch (err) {
      console.error("❌ Error en detailSector:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearSectorData = () => {
    setSectorData(null);
    setError(null);
    setLoading(false);
  };

  return {
    sectorData,
    sectorLoading,
    sectorError,
    detailSector,
    clearSectorData,
  };
};

export default function Panel({ selectedValue, setSelectedValue, ...props }) {
  const {
    sectorData,
    sectorLoading,
    sectorError,
    detailSector,
    clearSectorData,
  } = useDetailSector();

  // Obtener los barrios de props.data (asegúrate que sea un array de strings)
  const barriosOptions = Array.isArray(props.data) ? props.data : [];

  // Manejar la búsqueda
  const handleSearch = async () => {
    if (!selectedValue) {
      return;
    }
    await detailSector(selectedValue);
  };

  // Limpiar búsqueda
  const handleClear = () => {
    clearSectorData();
    setSelectedValue(null);
  };

  // Si no hay barrios disponibles, mostrar mensaje
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
    <Box sx={{ p: 2 }}>
      {/* Título */}
      <Typography variant="h4" align="center" gutterBottom>
        <strong>{props.title || "Panel de Consulta"}</strong>
      </Typography>

      {/* Advertencia importante */}
      <Alert
        severity="warning"
        // sx={{ mb: 3, borderRadius: 2 }}
        //icon={<WarningIcon />}
      >
        <Typography variant="body2">
          <strong> Importante:</strong> La información presentada es de manera
          referencial y deberá asumirse con el mayor cuidado y responsabilidad
          ya que la divulgación inadecuada de la misma está sujeta a acciones y
          sanciones contempladas en la LOGIRD.
        </Typography>
      </Alert>
      <Typography align="center" variant="h6">
        <strong>
          <p>Ley organica de Gestión integral de riesgos de desastres</p>
          Art. 39.-Comités comunitarios de gestión de riesgos y participación
          ciudadana
        </strong>
      </Typography>
      <Typography align="justify" variant="body2">
          Se promoverá la participación ciudadana en gestión de riesgos a
          través de comités comunitarios de gestión de riesgos. Estos comités
          son instancias creadas para la gestión integral de riesgos de
          desastres de conformidad con los lineamientos para su reconocimiento,
          conformación y funcionamiento expedidos por el ente rector de la
          gestión integral del riesgo de desastres. Los procesos de
          reconocimiento legal, conformación, capacitación y fortalecimiento de
          los comités locales de gestión de riesgos son responsabilidad de los
          gobiernos autónomos descentralizados municipales en el ámbito urbano y
          de los gobiernos autónomos descentralizados provinciales en el ámbito
          rural, los que informarán, de manera anual sobre el avance de este
          proceso al ente rector, de conformidad con el instructivo que se
          expida para el efecto.
     
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Barra de búsqueda */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <SearchIcon sx={{ mr: 1 }} />
          Buscar Información de Barrio
        </Typography>

        <Autocomplete
          options={barriosOptions}
          value={selectedValue}
          onChange={(event, newValue) => {
            setSelectedValue(newValue);
            if (sectorData) clearSectorData();
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
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={index}
                color="primary"
                variant="outlined"
              />
            ))
          }
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            disabled={!selectedValue || sectorLoading}
            startIcon={
              sectorLoading ? <CircularProgress size={20} /> : <SearchIcon />
            }
          >
            {sectorLoading ? "Consultando..." : "Consultar"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleClear}
            disabled={!sectorData && !selectedValue}
          >
            Limpiar
          </Button>
        </Box>
      </Paper>

      {/* Estado de carga */}
      {sectorLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            Cargando información del barrio...
          </Typography>
        </Box>
      )}

      {/* Mensaje de error */}
      {sectorError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Error: {sectorError}
        </Alert>
      )}

      {/* Resultados */}
      {sectorData && !sectorLoading && (
        <Box>
          {/* Verificar estructura de datos */}
          {sectorData.resultados && Array.isArray(sectorData.resultados) ? (
            sectorData.resultados.map((item, index) => (
              <BarrioResultItem key={index} item={item} index={index} />
            ))
          ) : (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              No se encontraron resultados para este barrio.
            </Alert>
          )}
        </Box>
      )}

      {/* Mensaje si no hay selección */}
      {!selectedValue && !sectorLoading && !sectorError && !sectorData && (
        <Paper
          elevation={0}
          sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}
        >
          <Typography variant="body1" color="text.secondary">
            Selecciona un barrio y haz clic en "Consultar" para ver la
            información
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

// Componente separado para cada resultado de barrio
const BarrioResultItem = ({ item, index }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        mb: 3,
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Encabezado del sector */}
      <Box
        sx={{
          p: 3,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocationOnIcon sx={{ mr: 1.5 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {item.sector || "Sin nombre"}
          </Typography>
        </Box>

        <Chip
          label={item.estado || "No especificado"}
          color={
            item.estado?.toLowerCase() === "activo"
              ? "success"
              : item.estado?.toLowerCase() === "pendiente"
              ? "warning"
              : "default"
          }
          sx={{
            bgcolor: "white",
            fontWeight: "bold",
            fontSize: "0.875rem",
          }}
        />
      </Box>

      {/* Contenido */}
      <Box sx={{ p: 1 }}>
        {/* Sección de Criterios de Priorización */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <ChecklistIcon color="secondary" sx={{ mr: 1.5, fontSize: 28 }} />
            <Typography
              variant="h5"
              color="secondary"
              sx={{ fontWeight: "bold" }}
            >
              Criterios de Priorización
            </Typography>
          </Box>

          {/* Grid para los criterios */}
          <Grid container spacing={3}>
            {[
              {
                title: "Exposición a eventos",
                value: item.exp_evnt,
                color: "error",
                icon: <WarningIcon />,
                description: "Sismo, inundaciones, deslizamientos, etc.",
                formula:
                  "1 evento = 0.5 • 2 eventos = 1 • 3 eventos = 1.5 • 4+ eventos = 2",
              },
              {
                title: "Recurrencia de eventos",
                value: item.rq_evnt,
                color: "warning",
                icon: <UpdateIcon />,
                description: "Frecuencia de ocurrencia",
                formula:
                  "Cada año = 2 • 5 años = 1.5 • 10 años = 1 • >10 años = 0.5",
              },
              {
                title: "Vulnerabilidad socio-organizativa",
                value: item.vuln_evnt,
                color: "info",
                icon: <GroupIcon />,
                description: "Organización de base y participación en RRD",
                formula: "Muy Alta = 2 • Alta = 1.5 • Media = 1 • Baja = 0.5",
              },
              {
                title: "Acceso a recursos",
                value: item.a_r_emerrg,
                color: "success",
                icon: <LocalHospitalIcon />,
                description: "Centros de Salud, Educativos, Policías, Bomberos",
                formula: "Ninguna = 2 • Uno = 1.5 • 2-3 = 1 • Más de 3 = 0.5",
              },
              {
                title: "Proyectos de RRD",
                value: item.pry_rrd,
                color: "primary",
                icon: <EngineeringIcon />,
                description:
                  "Sistema de Alerta Temprana (SAT), reubicación, obras de mitigación",
                formula: "Existe = 2 • No existe = 0.5",
              },
            ].map((criterio, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <CriterioCard {...criterio} />
              </Grid>
            ))}

            {/* Total - Destacado */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #fa6d0f 0%, #ecc30b 60%)",
                  color: "white",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalculateIcon
                      sx={{ mr: 2, fontSize: 30, color: "white" }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "white" }}
                    >
                      PUNTAJE TOTAL
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      textAlign: "center",
                      my: 3,
                    }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
                        fontSize: { xs: "3rem", md: "4rem" },
                      }}
                    >
                      {item.total || "0"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.9)", mt: 1 }}
                    >
                      Puntaje de priorización
                    </Typography>
                  </Box>

                  {/* Indicador de nivel de prioridad */}
                  <Box sx={{ mt: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(((item.total || 0) / 10) * 100, 100)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#ffd700",
                          borderRadius: 5,
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
                      {["Baja", "Media", "Alta"].map((nivel) => (
                        <Typography
                          key={nivel}
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {nivel}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Observaciones */}
        {item.observaciones && (
          <Alert
            severity="info"
            icon={<InfoIcon />}
            sx={{ borderRadius: 2, mt: 2 }}
          >
            <Typography variant="body1">
              <strong>Observaciones:</strong> {item.observaciones}
            </Typography>
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

// Componente para cada criterio
const CriterioCard = ({ title, value, color, icon, description, formula }) => {
  const colorMap = {
    error: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
    success: "#28a745",
    primary: "#007bff",
  };

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 3,
        border: `2px solid ${colorMap[color] || colorMap.primary}20`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${colorMap[color] || colorMap.primary}40`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Box
            sx={{
              color: colorMap[color] || colorMap.primary,
              mr: 1.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: 40 }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mt: "auto",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            {formula}
          </Typography>

          <Chip
            label={value || "N/A"}
            sx={{
              backgroundColor: colorMap[color] || colorMap.primary,
              color: "white",
              fontWeight: "bold",
              fontSize: "0.9rem",
              minWidth: 60,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
