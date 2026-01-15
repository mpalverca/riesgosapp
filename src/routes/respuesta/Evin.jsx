import React, { useState } from "react";
import {
  Alert,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MapaUbicacion from "../../components/maps/Ubi";
import { fetchCodeEvin } from "../../services/getCodeEvin";

const EvinCode = () => {
  const [data, setData] = useState(null);
  const [code, setCode] = useState("");
  const [validar, setValidar] = useState(false);
  const [error, setError] = useState("");
  console.log(data);
  const handleValidate = () => {
    if (!code.trim()) {
      setError("Por favor, ingresa un código");
      return;
    }
    setValidar(true);
    setError("");
    fetchCodeEvin(code, setData, setValidar);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (error) setError(""); // Limpiar error al empezar a escribir
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleValidate();
    }
  };

  return (
    <Box
      sx={{
        // p: 3,
        //background: 'linear-gradient(45deg, #FF5733 20%, #FFD700 90%)',
        minHeight: "100vh",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 3, background: "rgba(255, 255, 255, 0.95)" }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          📋 Formulario EVIN - Evaluación Inicial de Necesidades
        </Typography>

        {/* Sección de validación de código */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Código EVIN"
              variant="outlined"
              value={code}
              onChange={handleCodeChange}
              onKeyPress={handleKeyPress}
              disabled={validar}
              error={!!error}
              helperText={error}
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleValidate}
              disabled={validar || !code.trim()}
              sx={{
                height: "56px",
                borderRadius: 2,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)",
                },
              }}
            >
              Validar Código
            </Button>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                borderRadius: 2,
                bgcolor: validar ? "success.light" : "grey.200",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color:
                    data === null ? "#777"
                  : data.length === 0
                  ? "text.secondary"
                  : "success.contrastText",
                }}
              >
                {data === null
                  ? "Esperando validación..."
                  : data.length === 0
                  ? "❌ El código no existe o es incorrecto"
                  : "✅ El evento está registrado"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Advertencia legal */}
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }} icon={false}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            ADVERTENCIA LEGAL:
          </Typography>
          <Typography variant="body2">
            La información debe ser real y concisa. Está sometida al artículo
            Art. 78. de la LOGIRD -Infracciones graves.- 1. La difusión de
            alertas o información falsa referente a emergencias, desastres,
            catástrofes, endemias, epidemias o pandemias por cualquier medio
            cuando esta difusión cause zozobra en la población.
          </Typography>
        </Alert>
        {/* Mostrar formulario si la validación es exitosa */}
        {validar && data && Array.isArray(data) && data.length > 0 && (
          <EvinForm code={data} />
        )}
      </Paper>
    </Box>
  );
};

const EvinForm = ({ code }) => {
  const [formData, setFormData] = useState({
    // I. Ubicación geográfica
    provincia: code[0].provincia,
    canton: code[0].canton,
    parroquia: code[0].parroquia,
    urbana: code[0].type == "urbano" ? true : false,
    rural: code[0].type == "rural" ? true : false,
    sector: code[0].bar,
    puntoReferencia: "",
    indicacionesLlegada: "",
    distanciaKm: "",
    tiempoHoras: "",
    acceso: code[0].access,
    especificacionTransporte: "",
    coordenadaX: "",
    coordenadaY: "",

    // II. Fecha y tipo de evento
    fechaInicio: code[0].date,
    eventoGenerador: code[0].event,
    descripcionEvento: code[0].desc_event,
    efectosSecundarios: "",
    posiblesAmenazas: "",

    // III. Población impactada
    poblacionTotal: "",
    afectados: "",
    damnificados: "",
    evacuados: "",
    alojados: "",
    heridos: "",
    desaparecidos: "",
    fallecidos: "",

    // IV. Medios de vida
    agricultura: "",
    ganaderia: "",
    mineria: "",
    pesca: "",
    turismo: "",
    industria: "",

    // V. Daños en viviendas
    viviendasSinDanio: "",
    viviendasNoHabitables: "",
    viviendasDanioParcial: "",
    viviendasDanioTotal: "",

    // VI. Servicios e infraestructuras
    educativosFunciona: false,
    saludFunciona: false,
    aguaFunciona: false,
    electricidadFunciona: false,
    viasFunciona: false,

    // VII. Salud y alimentación
    unidadesSaludFuncionan: false,
    personasRequierenAtencionMedica: false,
    aguaAptaConsumo: "",
    hayAlimentos: false,
    perdidasCosechas: false,

    // VIII. Asistencia humanitaria
    organizacionesPresentes: "",
    fechaIntervencion: "",
    tipoAsistencia: "",
    hogaresBeneficiados: "",

    // IX. Capacidad de atención
    escalaAtencion: "",

    // X. Necesidades
    necesidadesAlojamiento: "",
    necesidadesAlimentos: "",
    necesidadesAgua: "",
    necesidadesRopa: "",
    necesidadesAseo: "",

    // XI. Observaciones
    observaciones: "",

    // XII. Equipo de evaluación
    fechaEvaluacion: "",
    liderNombre: "",
    liderTelefono: "",
    liderOrganizacion: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    alert("Formulario enviado (ver consola)");
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* I. Ubicación geográfica */}
          <Typography variant="h6" gutterBottom>
            I. Ubicación geográfica
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Provincia"
                disabled
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Cantón"
                disabled
                name="canton"
                value={formData.canton}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Parroquia"
                disabled
                name="parroquia"
                value={formData.parroquia}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled
                    name="urbana"
                    checked={formData.urbana}
                    onChange={handleChange}
                  />
                }
                label="Urbana"
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled
                    name="rural"
                    checked={formData.rural}
                    onChange={handleChange}
                  />
                }
                label="Rural"
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Sector/Dirección"
                name="sector"
                disabled
                value={formData.sector}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Punto de referencia"
                name="puntoReferencia"
                value={formData.puntoReferencia}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Indicaciones de llegada"
                name="indicacionesLlegada"
                value={formData.indicacionesLlegada}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ sx: 12, sm: 12 }}>
              <MapaUbicacion />
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Distancia (km)"
                name="distanciaKm"
                value={formData.distanciaKm}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xsize={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Tiempo estimado (horas)"
                name="tiempoHoras"
                value={formData.tiempoHoras}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Especificación de transporte"
                name="especificacionTransporte"
                value={formData.especificacionTransporte}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                disabled
                label="Coordenada X"
                name="coordenadaX"
                value={formData.coordenadaX}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                disabled
                label="Coordenada Y"
                name="coordenadaY"
                value={formData.coordenadaY}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* II. Fecha y tipo de evento */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            II. Fecha y tipo de evento
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="date"
                disabled
                label="Fecha inicio"
                name="fechaInicio"
                InputLabelProps={{ shrink: true }}
                value={formData.fechaInicio}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Evento generador</InputLabel>
                <Select
                  disabled
                  name="eventoGenerador"
                  value={formData.eventoGenerador}
                  onChange={handleChange}
                >
                  <MenuItem value="Sismo">Sismo</MenuItem>
                  <MenuItem value="Inundación">Inundación</MenuItem>
                  <MenuItem value="Deslizamiento">Deslizamiento</MenuItem>
                  <MenuItem value="Incendio">Incendio</MenuItem>
                  <MenuItem value="Sequía">Sequía</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción del evento"
                name="descripcionEvento"
                value={formData.descripcionEvento}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* III. Población impactada */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            III. Población impactada
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Población total"
                name="poblacionTotal"
                value={formData.poblacionTotal}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Afectados"
                name="afectados"
                value={formData.afectados}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Damnificados"
                name="damnificados"
                value={formData.damnificados}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Evacuados"
                name="evacuados"
                value={formData.evacuados}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Heridos"
                name="heridos"
                value={formData.heridos}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Fallecidos"
                name="fallecidos"
                value={formData.fallecidos}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* X. Necesidades de respuesta */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            X. Necesidades de respuesta
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Alojamiento (personas)"
                name="necesidadesAlojamiento"
                value={formData.necesidadesAlojamiento}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Alimentos (personas)"
                name="necesidadesAlimentos"
                value={formData.necesidadesAlimentos}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Agua (litros/día)"
                name="necesidadesAgua"
                value={formData.necesidadesAgua}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Ropa (personas)"
                name="necesidadesRopa"
                value={formData.necesidadesRopa}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* XII. Equipo de evaluación */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            XII. Equipo de evaluación
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de evaluación"
                name="fechaEvaluacion"
                InputLabelProps={{ shrink: true }}
                value={formData.fechaEvaluacion}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Nombre del líder"
                name="liderNombre"
                value={formData.liderNombre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Teléfono del líder"
                name="liderTelefono"
                value={formData.liderTelefono}
                onChange={handleChange}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Organización del líder"
                name="liderOrganizacion"
                value={formData.liderOrganizacion}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Observaciones */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            XI. Observaciones
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comentarios/Observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
          >
            Enviar formulario
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default EvinCode;
