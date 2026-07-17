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
  Alert,
} from "@mui/material";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePlanA } from "../script";
import DriveManager from "./loadfile";

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

const estado_OPTIONS = [
    { value: "Por activar", label: "Por activar" },
  { value: "Programado", label: "Programado" },
  { value: "En ejecución", label: "En ejecución" },
  { value: "Permanente", label: "Permanente" },
  { value: "Completado", label: "Completado" },  
  
 
];

const INITIAL_DATA = {
  by: "",
  mtt: "",
  provincia: "Loja",
  canton: "Loja",
  sector: "",
  desc: "",
  accion: "",
  cash: "",
  inst: "",
  detail: "",
  verifi: "",
  estado:" ",
  tipe: "",
};
MONTHS.forEach((m) => (INITIAL_DATA[m.key] = false));

export const EditAccion = ({
  open,
  onClose,
  mtt,
  dialogCoords,
  member,
  ...props
}) => {
  const { post, searchAccion, dataGet, loadingGet } = usePlanA();

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
    // Estado para almacenar el enlace del archivo subido (o manual)
  const [verificableLink, setVerificableLink] = useState('');

  // ========== CARGAR TODAS LAS ACCIONES AL ABRIR ==========
  useEffect(() => {
    if (open) {
      // Resetear formulario
      setData({ ...INITIAL_DATA, by: member || "", mtt: mtt || "" });
      setError(null);
      // Cargar todas las acciones
      searchAccion("opcions");
    }
  }, [open, member, mtt, searchAccion]);

  // ========== OPCIONES DE ACCIONES AGRUPADAS POR TIPO ==========
  const accionesPorTipo = useMemo(() => {
    // ✅ Validar que dataGet tenga datos
    if (!dataGet?.datos || !Array.isArray(dataGet.datos)) {
      return {};
    }

    const grouped = {};
    dataGet.datos.forEach((item) => {
      const tipo = item.tipo;
      if (!tipo) return;
      if (!grouped[tipo]) grouped[tipo] = [];
      grouped[tipo].push({
        value: item.accion || item.desc || "",
        label: item.accion || item.desc || "Sin nombre",
        desc: item.desc || "",
      });
    });
    return grouped;
  }, [dataGet]); // ✅ Dependencia en dataGet para actualizar cuando lleguen los datos

  // ========== OPCIONES PARA EL SELECT DE ACCIÓN (filtradas por tipo) ==========
  const accionesOptions = useMemo(() => {
    if (!data.tipe) return [];
    return accionesPorTipo[data.tipe] || [];
  }, [data.tipe, accionesPorTipo]);

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
    setVerificableLink("")
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError(null);

    if (name === "tipe") {
      // Resetear acción y descripción al cambiar el tipo
      setData((prev) => ({ ...prev, accion: "", desc: "" }));
    }
  };

  const handleMonthToggle = (key) => {
    setData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getActiveMonths = () =>
    MONTHS.filter((m) => data[m.key]).map((m) => m.label);

  const handleSubmit = async () => {
    // Validaciones existentes
    if (!data.tipe) return setError("Seleccione un tipo de acción");
    if (!data.accion) return setError("Seleccione una acción");
    if (!data.sector) return setError("Ingrese un sector");
    if (getActiveMonths().length === 0) return setError("Seleccione al menos un mes");
    if (!coordString) return setError("No hay coordenadas disponibles");

    // Si es verificable, debe haber un enlace (subido o manual)
    if (data.verifi === 'si') {
      // Si hay un archivo pendiente en DriveManager, lo subimos automáticamente
      if (driveManagerRef.current) {
        try {
          // Intentar subir el archivo si existe, o devolver el enlace manual
          const link = await driveManagerRef.current.uploadFile();
          setVerificableLink(link);
        } catch (err) {
          setError(err.message || 'Error al subir el archivo');
          return;
        }
      }

      // Después de intentar subir, verificamos que tengamos un enlace
      if (!verificableLink) {
        setError('Debe proporcionar un enlace o subir un archivo para acciones verificables');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Construir payload incluyendo el enlace (si existe)
      const payload = {
        ...data,
        date: new Date().toISOString(),
        ubi: coordString,
        meses_activos: getActiveMonths(),
        total_meses: getActiveMonths().length,
        verificableUrl: data.verifi === 'si' ? verificableLink : null,
      };

      console.log(payload)

      await post(data.tipe, payload);
      setData(INITIAL_DATA);
      setVerificableLink('');
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

//============manejo de archivos===========

const driveManagerRef = useRef(null); // Referencia al componente DriveManager
// Cuando se complete la subida desde DriveManager (callback)
  const handleUploadComplete = (url) => {
    setVerificableLink(url);
  };

  // Al cambiar el radio "verificable", limpiamos el enlace si se desmarca
  useEffect(() => {
    if (data.verifi !== 'si') {
      setVerificableLink('');
      // También podríamos limpiar el estado interno de DriveManager, pero lo haremos al cerrar
    }
  }, [data.verifi]);

  // ========== RENDER ==========
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Ingrese Acciones - {mtt}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Lat: {dialogCoords?.lat || "N/A"}, Lng: {dialogCoords?.lng || "N/A"}
        </DialogContentText>

        {error && (
          <Alert severity="error" sx={{ mt: 1 }} onClose={() => setError(null)}>
            {error}
          </Alert>
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
                  disabled: !data.tipe || loadingGet,
                  helperText: !data.tipe
                    ? "Seleccione un tipo primero"
                    : loadingGet
                    ? "Cargando acciones..."
                    : accionesOptions.length === 0 && data.tipe
                    ? "No hay acciones disponibles para este tipo"
                    : "",
                  InputProps: {
                    endAdornment: loadingGet && (
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                    ),
                  },
                }
              )}
            </Grid>

            {/* Descripción - autocompletada */}
            <Grid item size={{ xs: 12 }}>
              <Typography variant="body1" textAlign="justify">
                <strong>Descripción: </strong> {data.desc || "Seleccione una acción"}
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
              {renderField("estado", "Estado", "select", estado_OPTIONS)}
            </Grid>
            <Grid item size={{ xs: 12 }}>
              {renderField("verificable", "Verificable", "select", VERIFICABLE_OPTIONS)}
            </Grid>

            {/* Mostrar DriveManager solo si verificable === "si" */}
        {data.verifi === "si" && (
          <Grid item size={{ xs: 12 }}>
            <DriveManager
              ref={driveManagerRef}
              onUploadComplete={handleUploadComplete}
              initialLink={verificableLink}
            />
          </Grid>
        )}

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
        <Button onClick={handleSubmit} disabled={loading || loadingGet} variant="contained">
          {loading ? "Guardando..." : "Añadir"}
        </Button>
        <Button onClick={handleClose} disabled={loading}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccion;