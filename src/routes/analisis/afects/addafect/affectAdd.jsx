import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { crearRegistro } from "../script";

// --- Constantes de opciones (fuera del componente) ---
const AFECTACIONES = [
  { value: "Equipamiento", label: "Equipamiento" },
  { value: "Infraestructura", label: "Infraestructura" },
  { value: "Márgenes", label: "Márgenes" },
  { value: "Predio", label: "Predio" },
  { value: "Servicios de AAPP/AALL/AASS", label: "Servicios de AAPP/AALL/AASS" },
  { value: "Vialidad", label: "Vialidad" },
  { value: "Vivienda", label: "Vivienda" },
];

const EVENTOS = [
  { value: "Colapso Estructural", label: "Colapso Estructural" },
  { value: "Época Lluviosa", label: "Época Lluviosa" },
  { value: "Erosión Hídrica", label: "Erosión Hídrica" },
  { value: "Inundación", label: "Inundación" },
  { value: "Incendio Estructural", label: "Incendio Estructural" },
  { value: "Máxima Precipitación", label: "Máxima Precipitación" },
  { value: "Movimiento en masa", label: "Movimiento en masa" },
];

const PARROQUIAS = [
  "Chantaco", "Chuquiribamba", "El Cisne", "Gualel", "Jimbilla",
  "Loja", "Malacatos", "Punzara", "Sagrario", "San Lucas",
  "Santiago", "San Pedro de Vilcabamba", "San Sebastián", "Sucre",
  "Taquil", "Quinara", "El Valle", "Vilcabamba", "Yangana"
].map(p => ({ value: p, label: p }));

const ESTADOS = [
  { value: "Atendido", label: "Atendido" },
  { value: "Pendiente", label: "Pendiente" },
];

const PRIORIDADES = [
  { value: "Alta", label: "Alta" },
  { value: "Media", label: "Media" },
  { value: "Baja", label: "Baja" },
];

// --- Componente reutilizable de campo ---
const FormField = ({
  name,
  label,
  type = "text",
  options = [],
  value,
  onChange,
  required = false,
  ...props
}) => (
  <TextField
    fullWidth
    margin="normal"
    size="small"
    name={name}
    label={label}
    type={type}
    value={value || ""}
    onChange={onChange}
    select={type === "select"}
    multiline={type === "textarea"}
    rows={type === "textarea" ? 3 : undefined}
    required={required}
    InputLabelProps={{
      ...(required && { sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }),
    }}
    {...props}
  >
    {type === "select" &&
      options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
  </TextField>
);

// --- Componente principal ---
export const AffectAdd = ({
  dialogOpen,
  handleCloseDialog,
  dialogCoords,
  setMarkData,
  polyData,
}) => {
  // Estado del formulario
  const [dialogData, setDialogData] = useState({
    afectacion: "",
    event: "",
    parroq: "",
    sector: "",
    descripcio: "",
    accions: "",
    estado: "Pendiente",
    prioridad: "Media",
    radio: "",
    anex_foto: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const userName = JSON.parse(localStorage.getItem("user") || "null");

  // Reiniciar formulario al cerrar
  useEffect(() => {
    if (!dialogOpen) {
      setDialogData({
        afectacion: "",
        event: "",
        parroq: "",
        sector: "",
        descripcio: "",
        accions: "",
        estado: "Pendiente",
        prioridad: "Media",
        radio: "",
        img: "",
      });
      setError("");
      setSnackbar(prev => ({ ...prev, open: false }));
    }
  }, [dialogOpen]);

  const handleData = useCallback((e) => {
    const { name, value } = e.target;
    setDialogData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }, [error]);

  // Validación de campos obligatorios
  const validateForm = useCallback(() => {
    const requiredFields = [
      { field: "afectacion", label: "Afectación" },
      { field: "event", label: "Evento" },
      { field: "parroq", label: "Parroquia" },
      { field: "sector", label: "Sector" },
      { field: "descripcio", label: "Descripción detallada" },
      { field: "accions", label: "Acciones a realizar" },
      { field: "estado", label: "Estado" },
      { field: "prioridad", label: "Prioridad" },
    ];

    for (const { field, label } of requiredFields) {
      if (!dialogData[field]?.trim()) {
        setError(`El campo "${label}" es obligatorio`);
        return false;
      }
    }
    return true;
  }, [dialogData]);

  // Limpieza de coordenadas
  const cleanCoordinate = useCallback((coord) => {
    if (!coord) return null;
    let coordStr = coord.toString().replace(",", ".");
    coordStr = coordStr.replace(/[^0-9.-]/g, "");
    const num = parseFloat(coordStr);
    return isNaN(num) ? null : num;
  }, []);

  // Envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const cleanLat = cleanCoordinate(dialogCoords?.lat);
    const cleanLng = cleanCoordinate(dialogCoords?.lng);

    if (cleanLat === null || cleanLng === null) {
      setError("Coordenadas inválidas. Por favor, seleccione una ubicación válida.");
      return;
    }

    setLoading(true);
    try {
      

      const newMarker = {
        ...dialogData,
        geom: { type: "Point", coordinates: [cleanLng, cleanLat] },
        date: new Date().toISOString(),
        depen: userName?.ci || "Anónimo",  // o el campo que uses para dependencia
      
        
        radio: parseFloat(dialogData.radio) || 0,
      };

      await crearRegistro(newMarker);

      setSnackbar({ open: true, message: "Afectación guardada con éxito", severity: "success" });
      handleCloseDialog();
      setMarkData((prev) => [...(Array.isArray(prev) ? prev : []), newMarker]);
    } catch (err) {
      setError("Error al guardar el marcador. Intente nuevamente.");
      setSnackbar({ open: true, message: "Error al guardar", severity: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Agregar afectación</Typography>
          <Button onClick={handleCloseDialog} color="inherit" size="small">
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ pt: 1 }}>
            {/* Ubicación */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <LocationOnIcon color="action" />
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Coordenadas:</strong> {dialogCoords?.lat || "—"}, {dialogCoords?.lng || "—"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>📋 Información general</Typography>

            <Grid container spacing={2}>
              <Grid item size={{xs:12, md:6}}>
                <FormField
                  name="afectacion"
                  label="Afectación"
                  type="select"
                  options={AFECTACIONES}
                  value={dialogData.afectacion}
                  onChange={handleData}
                  required
                />
              </Grid>
              <Grid item size={{xs:12, md:6}}>
                <FormField
                  name="event"
                  label="Evento"
                  type="select"
                  options={EVENTOS}
                  value={dialogData.event}
                  onChange={handleData}
                  required
                />
              </Grid>
              <Grid item size={{xs:12, md:6}}>
                <FormField
                  name="parroq"
                  label="Parroquia"
                  type="select"
                  options={PARROQUIAS}
                  value={dialogData.parroq}
                  onChange={handleData}
                  required
                />
              </Grid>
              <Grid item  size={{xs:12, md:6}}>
                <FormField
                  name="sector"
                  label="Sector"
                  type="text"
                  value={dialogData.sector}
                  onChange={handleData}
                  required
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>📝 Descripción y acciones</Typography>

            <Grid container spacing={2}>
              <Grid item  size={{xs:12}}>
                <FormField
                  name="descripcio"
                  label="Descripción detallada"
                  type="textarea"
                  value={dialogData.descripcio}
                  onChange={handleData}
                  required
                />
              </Grid>
              <Grid item size={{xs:12}}>
                <FormField
                  name="accions"
                  label="Acciones a realizar"
                  type="textarea"
                  value={dialogData.accions}
                  onChange={handleData}
                  required
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>⚙️ Estado y prioridad</Typography>

            <Grid container spacing={2}>
              <Grid item   size={{xs:12, md:6}}>
                <FormField
                  name="estado"
                  label="Estado"
                  type="select"
                  options={ESTADOS}
                  value={dialogData.estado}
                  onChange={handleData}
                  required
                />
              </Grid>
              <Grid item   size={{xs:12, md:6}}>
                <FormField
                  name="prioridad"
                  label="Prioridad"
                  type="select"
                  options={PRIORIDADES}
                  value={dialogData.prioridad}
                  onChange={handleData}
                  required
                />
              </Grid>
              <Grid item  size={{xs:12, md:6}}>
                <FormField
                  name="radio"
                  label="Radio de afectación (m)"
                  type="number"
                  value={dialogData.radio}
                  onChange={handleData}
                  InputProps={{ inputProps: { min: 0, step: 10 } }}
                />
              </Grid>
              <Grid item   size={{xs:12, md:6}}>
                <FormField
                  name="img"
                  label="URL de imagen (opcional)"
                  type="text"
                  value={dialogData.img}
                  onChange={handleData}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </Grid>
            </Grid>

            {/* Mensaje de error en el diálogo */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 2 }}>
              * Campos obligatorios
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificación */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};