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
  Autocomplete,
} from "@mui/material";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePlanA } from "../script";
import DriveManager from "./loadfile";
import InstApoyo from "../../../../components/utils/inst_info_canton.json";
import { ESTADO_OPTIONS, INITIAL_DATA, MONTHS, TIPO_OPTIONS, VERIFICABLE_OPTIONS } from "./config";



// Extraer nombres de instituciones (strings)
const INSTITUCIONES_LIST = InstApoyo.map((item) => 
  typeof item === 'string' ? item : item.nombre || item.label || ""
).filter(Boolean);


MONTHS.forEach((m) => (INITIAL_DATA[m.key] = false));

// ========== COMPONENTE PRINCIPAL ==========
export const DialogAccion = ({
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

  // ========== ESTADOS ==========
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificableLink, setVerificableLink] = useState("");
  const [instituciones, setInstituciones] = useState([]); // Array de strings
  const [inputInstValue, setInputInstValue] = useState("");

  const driveManagerRef = useRef(null);

  // ========== CARGAR ACCIONES ==========
  useEffect(() => {
    if (open) {
      setData({ ...INITIAL_DATA, by: member || "", mtt: mtt || "" });
      setInstituciones([]);
      setInputInstValue("");
      setVerificableLink("");
      setError(null);
      searchAccion("opcions");
    }
  }, [open, member, mtt, searchAccion]);

  // ========== OPCIONES DE ACCIONES AGRUPADAS ==========
  const accionesPorTipo = useMemo(() => {
    if (!dataGet?.datos || !Array.isArray(dataGet.datos)) return {};

    const grouped = {};
    dataGet.datos.forEach((item) => {
      const tipo = item.tipo;
      if (!tipo) return;
      if (!grouped[tipo]) grouped[tipo] = [];
      grouped[tipo].push({
        value: item.accion || item.desc || "",
        label: item.accion || item.desc || "Sin nombre",
        desc: item.desc || "",
        inst: item.inst || "",
        responsable: item.responsable || "",
      });
    });
    return grouped;
  }, [dataGet]);

  const accionesOptions = useMemo(() => {
    if (!data.tipe) return [];
    return accionesPorTipo[data.tipe] || [];
  }, [data.tipe, accionesPorTipo]);

  // ========== AUTOFILL AL SELECCIONAR ACCIÓN ==========
  useEffect(() => {
    if (data.accion && data.tipe) {
      const selected = accionesOptions.find(
        (item) => item.value === data.accion
      );
      if (selected) {
        const instArray = selected.inst
          ? selected.inst.split(",").map((i) => i.trim()).filter(Boolean)
          : [];

        setData((prev) => ({
          ...prev,
          desc: selected.desc,
          responsable: selected.responsable,
        }));
        setInstituciones(instArray);
      }
    }
  }, [data.accion, data.tipe, accionesOptions]);

  // ========== HANDLERS ==========
  const handleClose = () => {
    setData(INITIAL_DATA);
    setInstituciones([]);
    setInputInstValue("");
    setVerificableLink("");
    setError(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError(null);

    if (name === "tipe") {
      setData((prev) => ({ ...prev, accion: "", desc: "" }));
      setInstituciones([]);
    }
  };

  const handleMonthToggle = (key) => {
    setData((prev) => ({ ...prev, [key]: !prev[key] }));
  };


  const handleAddInstitucion = (newInst) => {
    if (!newInst || !newInst.trim()) return;
    const trimmed = newInst.trim();
    if (instituciones.includes(trimmed)) {
      setError("La institución ya está agregada");
      return;
    }
    setInstituciones((prev) => [...prev, trimmed]);
    setInputInstValue("");
    setError(null);
  };

  const handleRemoveInstitucion = (instToRemove) => {
    setInstituciones((prev) => prev.filter((i) => i !== instToRemove));
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

    // Validar verificable
    if (data.verifi === "si") {
      if (driveManagerRef.current) {
        try {
          const link = await driveManagerRef.current.uploadFile();
          setVerificableLink(link);
        } catch (err) {
          setError(err.message || "Error al subir el archivo");
          return;
        }
      }
      if (!verificableLink) {
        setError("Debe proporcionar un enlace o subir un archivo");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        date: new Date().toISOString(),
        ubi: coordString,
       
        verifi: data.verifi,
        inst: instituciones.join(', '), // Array de strings
        verificableUrl: data.verifi === "si" ? verificableLink : null,
      };

      console.log(payload.inst)

      await post(data.tipe, payload);
      handleClose();
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
  ) => {
    // Asegurar que options sea un array
    const safeOptions = Array.isArray(options) ? options : [];

    return (
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
          safeOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
      </TextField>
    );
  };

  // ========== RENDER PRINCIPAL ==========
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
            <Grid item size={{ xs: 12 }}>
              {renderField("tipe", "Tipo", "select", TIPO_OPTIONS)}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("accion", "Acción", "select", accionesOptions, {
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
                    <CircularProgress size={25} sx={{ mr: 1 }} />
                  ),
                },
              })}
            </Grid>

            {/* Descripción */}
            <Grid item size={{ xs: 12 }}>
              <Typography variant="body1" textAlign="justify">
                <strong>Descripción: </strong>{" "}
                {data.desc || "Seleccione una acción"}
              </Typography>
            </Grid>

            {/* Responsable */}
            <Grid item size={{ xs: 12 }}>
              <Typography variant="body1" textAlign="justify">
                <strong>Responsable: </strong>{" "}
                {data.responsable || "No se identifica responsable"}
              </Typography>
            </Grid>

            {/* Instituciones de Apoyo - Autocomplete */}
            <Grid item size={{ xs: 12 }}>
              <Autocomplete
                freeSolo
                options={INSTITUCIONES_LIST}
                inputValue={inputInstValue}
                onInputChange={(_, newValue) => setInputInstValue(newValue || "")}
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleAddInstitucion(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Instituciones de Apoyo"
                    placeholder="Escriba y presione Enter para agregar"
                    helperText="Seleccione o escriba una institución y presione Enter"
                  />
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputInstValue.trim()) {
                    e.preventDefault();
                    handleAddInstitucion(inputInstValue);
                  }
                }}
                clearOnBlur={false}
                clearOnEscape
              />
              
              {/* Mostrar instituciones seleccionadas como chips */}
              {instituciones.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                  {instituciones.map((inst, idx) => (
                    <Chip
                      key={idx}
                      label={inst}
                      onDelete={() => handleRemoveInstitucion(inst)}
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item size={{ xs: 6 }}>
              {renderField("sector", "Sector")}
            </Grid>

            <Grid item size={{ xs: 6 }}>
              {renderField("cash", "Presupuesto")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("detail", "Detalles", "textarea")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("estado", "Estado", "select", ESTADO_OPTIONS)}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("verifi", "Verificable", "select", VERIFICABLE_OPTIONS)}
            </Grid>

            {data.verifi === "si" && (
              <Grid item size={{ xs: 12 }}>
                <DriveManager
                  ref={driveManagerRef}
                  onUploadComplete={setVerificableLink}
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

                <RadioGroup row sx={{ flexWrap: "wrap", gap: 0.5, mt: 1 }}>
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
        <Button
          onClick={handleSubmit}
          disabled={loading || loadingGet}
          variant="contained"
        >
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