import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Chip,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useEffect } from "react";
import { usePlanA } from "../script";

// ========== CONFIGURACIÓN DE MESES ==========
const MONTHS = [
  { key: "Jun", label: "Junio" },
  { key: "Jul", label: "Julio" },
  { key: "Ago", label: "Agosto" },
  { key: "Sep", label: "Septiembre" },
  { key: "Oct", label: "Octubre" },
  { key: "Nov", label: "Noviembre" },
  { key: "Dic", label: "Diciembre" },
];

export const DialogAccion = ({
  open,
  onClose,
  mtt,
  dialogCoords,
  member,
  ...props
}) => {
  const { post } = usePlanA();

  // ========== LIMPIAR COORDENADAS ==========
  const cleanCoordinate = (coord) => {
    if (!coord && coord !== 0) return null;
    let coordStr = coord.toString().replace(",", ".");
    coordStr = coordStr.replace(/[^0-9.-]/g, "");
    const num = parseFloat(coordStr);
    return isNaN(num) ? null : num;
  };

  const cleanLat = cleanCoordinate(dialogCoords?.lat);
  const cleanLng = cleanCoordinate(dialogCoords?.lng);
  // Formatear como string "lat, lng" (formato esperado por coordForm)
  const coordString = cleanLat !== null && cleanLng !== null 
    ? `${cleanLat}, ${cleanLng}` 
    : "";


  // ========== ESTADO INICIAL ==========
  const initialData = {
    by: member || "",
    mtt: mtt || "",
    provincia: "Loja",
    canton: "Loja_",
    sector: "",
    desc: "",
    accion: "",
    cash: "",
    inst: "",
    Jun: false,
    Jul: false,
    Ago: false,
    Sep: false,
    Oct: false,
    Nov: false,
    Dic: false,
    detail: "",
    verificable: "",
    tipe: "",
  };

  const [fixData, setFixData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========== RESETEAR FORMULARIO AL ABRIR ==========
  useEffect(() => {
    if (open) {
      setFixData({
        ...initialData,
        by: member || "",
        mtt: mtt || "",
      });
      setError(null);
    }
  }, [open, member, mtt]);

  // ========== HANDLERS ==========
  const handleClose = () => {
    setFixData(initialData);
    setError(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFixData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleMonthChange = (monthKey) => {
    setFixData((prev) => ({
      ...prev,
      [monthKey]: !prev[monthKey],
    }));
  };

  const handleSubmit = async () => {
    // Validar campos requeridos
    if (!fixData.tipe) {
      setError("Seleccione un tipo de acción");
      return;
    }
    if (!fixData.accion) {
      setError("Ingrese una acción");
      return;
    }
    if (!fixData.sector) {
      setError("Ingrese un sector");
      return;
    }

    // Validar que al menos un mes esté seleccionado
    const hasMonthSelected = MONTHS.some(month => fixData[month.key]);
    if (!hasMonthSelected) {
      setError("Seleccione al menos un mes de ejecución");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...fixData,
        date: new Date().toISOString(),
        ubi: coordString,
        // Lista de meses activos
        meses_activos: MONTHS.filter(m => fixData[m.key]).map(m => m.label),
        // Contar meses activos
        total_meses: MONTHS.filter(m => fixData[m.key]).length,
      };

      await post(fixData.tipe, dataToSend);
      
      // Resetear y cerrar
      setFixData(initialData);
      onClose();
    } catch (err) {
      setError(err.message || "Error al guardar los datos");
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER DE CAMPOS ==========
  const renderField = (name, label, type = "text", options = [], props = {}) => (
    <TextField
      name={name}
      label={label}
      type={type}
      value={fixData[name] || ""}
      onChange={handleChange}
      select={type === "select"}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 5 : undefined}
      fullWidth
      disabled={name === "by"}
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

  // ========== OBTENER MESES ACTIVOS ==========
  const getActiveMonths = () => {
    return MONTHS.filter(month => fixData[month.key]).map(month => month.label);
  };

  // ========== RENDER ==========
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Ingrese Acciones a realizar - {mtt}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Latitud: {dialogCoords?.lat || "N/A"}, 
          Longitud: {dialogCoords?.lng || "N/A"}
        </DialogContentText>

        {error && (
          <Paper sx={{ p: 1, mt: 1, bgcolor: "#ffebee", border: "1px solid #ef5350" }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Información General
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item size={{ xs: 12 }}>
                  {renderField("tipe", "Tipo", "select", [
                    { value: "Conoc_Monit", label: "Conocimiento y Monitoreo" },
                    { value: "prev_mit", label: "Prevención y Mitigación" },
                    { value: "prep", label: "Preparación" },
                    { value: "resp", label: "Respuesta" },
                    { value: "recup", label: "Recuperación" },
                  ])}
                </Grid>

                <Grid item size={{ xs: 12 }}>
                  {renderField("accion", "Acción", "text")}
                </Grid>

                <Grid item size={{ xs: 6 }}>
                  {renderField("sector", "Sector", "text")}
                </Grid>

                <Grid item size={{ xs: 6 }}>
                  {renderField("cash", "Presupuesto", "text")}
                </Grid>

                <Grid item size={{ xs: 12 }}>
                  {renderField("inst", "Instituciones de Apoyo", "text")}
                </Grid>

                <Grid item size={{ xs: 12 }}>
                  {renderField("desc", "Descripción", "textarea")}
                </Grid>

                <Grid item size={{ xs: 12 }}>
                  {renderField("detail", "Detalles", "textarea")}
                </Grid>

                <Grid item size={{ xs: 12 }}>
                  {renderField("verificable", "Verificable", "select", [
                    { value: "si", label: "Sí" },
                    { value: "no", label: "No" },
                  ])}
                </Grid>
                {/* ========== MESES DE EJECUCIÓN ========== */}
                <Grid item size={{ xs: 12 }}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                        Tiempo de ejecución (Meses)
                      </Typography>
                    </FormLabel>
                    
                    {/* Mostrar meses seleccionados */}
                    {getActiveMonths().length > 0 && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {getActiveMonths().map((month) => (
                            <Chip
                              key={month}
                              label={month}
                              color="primary"
                              size="small"
                              onDelete={() => {
                                const monthKey = MONTHS.find(m => m.label === month)?.key;
                                if (monthKey) handleMonthChange(monthKey);
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    <RadioGroup
                      row
                      sx={{ 
                        flexWrap: "wrap", 
                        gap: 0.5, 
                        mt: 1,
                        "& .MuiFormControlLabel-root": {
                          marginRight: 1,
                        }
                      }}
                    >
                      {MONTHS.map((month) => (
                        <FormControlLabel
                          key={month.key}
                          control={
                            <Radio
                              checked={fixData[month.key] || false}
                              onChange={() => handleMonthChange(month.key)}
                              size="small"
                            />
                          }
                          label={month.label}
                        />
                      ))}
                    </RadioGroup>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {getActiveMonths().length > 0 
                        ? `${getActiveMonths().length} mes(es) seleccionado(s)` 
                        : "Seleccione los meses de ejecución"}
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {loading ? "Guardando..." : "Añadir"}
        </Button>
        <Button onClick={handleClose} disabled={loading} autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAccion;