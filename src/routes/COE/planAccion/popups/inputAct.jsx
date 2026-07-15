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
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { usePlanA } from "../script";
import Access from "./acces.json";

// ========== CONFIGURACIÓN ==========
const MONTHS = [
  { key: "Jun", label: "Junio" },
  { key: "Jul", label: "Julio" },
  { key: "Ago", label: "Agosto" },
  { key: "Sep", label: "Septiembre" },
  { key: "Oct", label: "Octubre" },
  { key: "Nov", label: "Noviembre" },
  { key: "Dic", label: "Diciembre" },
];

const TIPO_OPTIONS = [
  { value: "Conoc_Monit", label: "Conocimiento y Monitoreo" },
  { value: "prev_mit", label: "Prevención y Mitigación" },
  { value: "prep", label: "Preparación" },
  { value: "resp", label: "Respuesta" },
  { value: "recup", label: "Recuperación" },
];

const VERIFICABLE_OPTIONS = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

const INITIAL_DATA = {
  by: "",
  mtt: "",
  provincia: "Loja",
  canton: "Loja_",
  sector: "",
  desc: "",
  accion: "",
  cash: "",
  inst: "",
  detail: "",
  verificable: "",
  tipe: "",
};
MONTHS.forEach((m) => (INITIAL_DATA[m.key] = false));

export const DialogAccion = ({
  open,
  onClose,
  mtt,
  dialogCoords,
  member,
  ...props
}) => {
  const { post } = usePlanA();

  // ========== COORDENADAS ==========
  const cleanCoord = (coord) => {
    if (!coord && coord !== 0) return null;
    const num = parseFloat(
      coord.toString().replace(",", ".").replace(/[^0-9.-]/g, "")
    );
    return isNaN(num) ? null : num;
  };

  const lat = cleanCoord(dialogCoords?.lat);
  const lng = cleanCoord(dialogCoords?.lng);
  const coordString = lat !== null && lng !== null ? `${lat}, ${lng}` : "";

  // ========== ESTADO ==========
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingAcciones, setLoadingAcciones] = useState(false);

  // ========== OPCIONES DE ACCIONES DESDE JSON ==========
  const accionesPorTipo = useMemo(() => {
    // Agrupar acciones por tipo desde el JSON
    const grouped = {};
    Access.forEach((item) => {
      if (!grouped[item.tipo]) grouped[item.tipo] = [];
      grouped[item.tipo].push({
        value: item.accion || item.desc, // Usamos desc como fallback si accion está vacío
        label: item.accion || item.desc,
        desc: item.desc,
      });
    });
    return grouped;
  }, []);

  // ========== OPCIONES PARA EL SELECT DE ACCIÓN ==========
  const accionesOptions = useMemo(() => {
    if (!data.tipe) return [];
    return accionesPorTipo[data.tipe] || [];
  }, [data.tipe, accionesPorTipo]);

  // ========== RESET ==========
  useEffect(() => {
    if (open) {
      setData({ ...INITIAL_DATA, by: member || "", mtt: mtt || "" });
      setError(null);
    }
  }, [open, member, mtt]);

  // ========== AUTOCOMPLETAR DESCRIPCIÓN AL SELECCIONAR ACCIÓN ==========
  useEffect(() => {
    if (data.accion && data.tipe) {
      const selected = accionesOptions.find(
        (item) => item.value === data.accion
      );
      if (selected && selected.desc) {
        setData((prev) => ({ ...prev, desc: selected.desc }));
      }
    }
  }, [data.accion, data.tipe, accionesOptions]);

  // ========== HANDLERS ==========
  const handleClose = () => {
    setData(INITIAL_DATA);
    setError(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError(null);

    // Si cambia el tipo, resetear acción y descripción
    if (name === "tipe") {
      setData((prev) => ({ ...prev, accion: "", desc: "" }));
    }
  };

  const handleMonthToggle = (key) => {
    setData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getActiveMonths = () =>
    MONTHS.filter((m) => data[m.key]).map((m) => m.label);

  const handleSubmit = async () => {
    // Validaciones
    if (!data.tipe) return setError("Seleccione un tipo de acción");
    if (!data.accion) return setError("Seleccione una acción");
    if (!data.sector) return setError("Ingrese un sector");
    if (getActiveMonths().length === 0)
      return setError("Seleccione al menos un mes");
    if (!coordString) return setError("No hay coordenadas disponibles");

    setLoading(true);
    setError(null);

    try {
      await post(data.tipe, {
        ...data,
        date: new Date().toISOString(),
        ubi: coordString,
        meses_activos: getActiveMonths(),
        total_meses: getActiveMonths().length,
      });

      setData(INITIAL_DATA);
      onClose();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER DE CAMPO ==========
  const renderField = (
    name,
    label,
    type = "text",
    options = [],
    extraProps = {}
  ) => (
    <TextField
      name={name}
      label={label}
      type={type}
      value={data[name] || ""}
      onChange={handleChange}
      select={type === "select"}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 5 : undefined}
      fullWidth
      disabled={name === "by" || name === "desc"}
      {...extraProps}
    >
      {type === "select" &&
        options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
    </TextField>
  );

  // ========== RENDER ==========
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Ingrese Acciones - {mtt}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Lat: {dialogCoords?.lat || "N/A"}, Lng: {dialogCoords?.lng || "N/A"}
        </DialogContentText>

        {error && (
          <Paper
            sx={{
              p: 1,
              mt: 1,
              bgcolor: "#ffebee",
              border: "1px solid #ef5350",
            }}
          >
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Información General
          </Typography>

          <Grid container spacing={2}>
            {/* Tipo */}
            <Grid item size={{ xs: 12 }}>
              {renderField("tipe", "Tipo", "select", TIPO_OPTIONS)}
            </Grid>

            {/* Acción - dinámico según tipo */}
            <Grid item size={{ xs: 12 }}>
              {renderField(
                "accion",
                "Acción",
                "select",
                accionesOptions,
                {
                  disabled: !data.tipe || loadingAcciones,
                  helperText: !data.tipe
                    ? "Seleccione un tipo primero"
                    : loadingAcciones
                    ? "Cargando acciones..."
                    : accionesOptions.length === 0 && data.tipe
                    ? "No hay acciones disponibles"
                    : "",
                  InputProps: {
                    endAdornment: loadingAcciones && (
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                    ),
                  },
                }
              )}
            </Grid>

            {/* Descripción - autocompletada */}
            <Grid item size={{ xs: 12 }}>
             <Typography about="" variant="body1" textAlign="justify" >
             <strong>Descripción </strong> {data.desc }
             </Typography>
            </Grid>

            <Grid item size={{ xs: 6 }}>
              {renderField("sector", "Sector")}
            </Grid>

            <Grid item size={{ xs: 6 }}>
              {renderField("cash", "Presupuesto")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("inst", "Instituciones de Apoyo")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("detail", "Detalles", "textarea")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("verificable", "Verificable", "select", VERIFICABLE_OPTIONS)}
            </Grid>

            {/* Meses */}
            <Grid item size={{ xs: 12 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Tiempo de ejecución (Meses)
                  </Typography>
                </FormLabel>

                {getActiveMonths().length > 0 && (
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {getActiveMonths().map((month) => (
                        <Chip
                          key={month}
                          label={month}
                          color="primary"
                          size="small"
                          onDelete={() =>
                            handleMonthToggle(
                              MONTHS.find((m) => m.label === month).key
                            )
                          }
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <RadioGroup
                  row
                  sx={{ flexWrap: "wrap", gap: 0.5, mt: 1 }}
                >
                  {MONTHS.map((month) => (
                    <FormControlLabel
                      key={month.key}
                      control={
                        <Radio
                          checked={!!data[month.key]}
                          onChange={() => handleMonthToggle(month.key)}
                          size="small"
                        />
                      }
                      label={month.label}
                      sx={{ mr: 1 }}
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
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} disabled={loading} variant="contained">
          {loading ? "Guardando..." : "Añadir"}
        </Button>
        <Button onClick={handleClose} disabled={loading}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAccion;