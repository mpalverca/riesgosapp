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
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import WaterIcon from "@mui/icons-material/Water";
import PipeIcon from "@mui/icons-material/CompareArrows";
import WellIcon from "@mui/icons-material/Assessment";

// Configuración de infraestructura
const CONFIG = {
  infraestructura: {
    title: "Registrar Infraestructura de Drenaje",
    icon: <WaterIcon color="info" />,
    subtypes: [
      { value: "sumidero", label: "🧹 Sumidero" },
      { value: "tuberia", label: "🔧 Tubería" },
      { value: "pozo", label: "🕳️ Pozo" },
    ],
  },
};

// Textos informativos para cada tipo de infraestructura
const INFRAESTRUCTURA_INFO = {
  sumidero: {
    titulo: "🧹 Registro de Sumidero",
    descripcion:
      "Estructura de captación de aguas pluviales en la vía o calzada. Puede estar obstruida por materiales pétreos, material orgánico o basura general. La capacidad de infiltración se evalúa mediante el ensayo de campo (0: permeable, 100%: no permeable).",
    campos: {
      capacidad: "Capacidad de infiltración (0-10)",
      tipo_material: "Tipo de material obstruyente",
      obs: "Nivel de obstrucción (%)",
      dimx: "Dimensión X (cm)",
      dimy: "Dimensión Y (cm)",
      profundidad: "Profundidad (m)",
    },
  },
  tuberia: {
    titulo: "🔧 Registro de Tubería",
    descripcion:
      "Conducto que transporta aguas pluviales o residuales. Su capacidad hidráulica depende del diámetro, longitud y nivel de obstrucción.",
    campos: {
      obs: "Nivel de obstrucción (%)",
      diametro: "Diámetro (cm)",
      longitud: "Longitud (m)",
    },
  },
  pozo: {
    titulo: "🕳️ Registro de Pozo",
    descripcion:
      "Punto de acceso a la red de alcantarillado para inspección y mantenimiento. Permite la conexión entre tuberías y la superficie.",
    campos: {
      profundidad: "Profundidad de agua (m)",
    },
  },
};

// Componente de campo reutilizable
const FormField = ({
  name,
  label,
  type = "text",
  options = [],
  value,
  onChange,
  required = false,
  helperText = "",
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
    helperText={helperText}
    inputProps={type === "number" ? { min: 0, step: "any" } : {}}
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

// Componente específico para infraestructura de drenaje
const InfraestructuraParams = ({ data, onChange }) => {
  const tipo = data.subtype || "";

  // Renderizar campos según el tipo de infraestructura
  const renderCamposEspecificos = () => {
    switch (tipo) {
      case "sumidero":
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormField
                name="cap"
                label="Capacidad de infiltración"
                type="select"
                value={data.cap}
                options={[
                  { value: 2, label: "vacio" },
                  { value: 3, label: "medio" },
                  { value: 4, label: "lleno" },
                  { value: 5, label: "Saturado" },
                ]}
                onChange={onChange}
                required
                //helperText="Valor de 2 a 5 según eobservado"
                // inputProps={{ min: 2, max: 5, step: 1 }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormField
                name="tipo_mat"
                label="Tipo de material obstruyente"
                type="select"
                options={[
                  { value: 1, label: " sin Obstrucción" },
                  { value: 2, label: " Material Organico (hojas, ramas)" },
                  { value: 3, label: " Material Petreo(arena, grava)" },
                  {
                    value: 4,
                    label: " Material Inorganico (plásticos, papeles)",
                  },
                  { value: 5, label: " Material Mixto (Inorganicos/petreos)" },
                ]}
                value={data.tipo_mat}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <Typography
                alignContent="center"
                align="center"
                alignItems="center"
              >
                La obstrucción del sumidero es {(data.tipo_mat + data.cap) * 10}%
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                <Typography variant="caption" color="textSecondary">
                  🔍 <strong>Interpretación de campo:</strong>
                  Nivel de obstrucción 0% = Permeable (0) | Nivel de obstrucción
                  1-100% = No Permeable
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  📊 <strong>Para SWMM:</strong> El % de obstrucción se traduce
                  como reducción del área hidráulica efectiva del sumidero.
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{ xs: 6, sm: 4 }}>
              <FormField
                name="dimx"
                label="Dimensión X (cm)"
                type="number"
                value={data.dimx}
                onChange={onChange}
                required
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item size={{ xs: 6, sm: 4 }}>
              <FormField
                name="dimy"
                label="Dimensión Y (cm)"
                type="number"
                value={data.dimy}
                onChange={onChange}
                required
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item size={{ xs: 6, sm: 4 }}>
              <FormField
                name="prof"
                label="Profundidad (m)"
                type="number"
                value={data.prof}
                onChange={onChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>
        );

      case "tuberia":
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{ xs: 12, sm: 4 }}>
              <FormField
                name="obs"
                label="Nivel de obstrucción (%)"
                type="number"
                value={data.obs}
                onChange={onChange}
                required
                helperText="% de reducción del área hidráulica"
                inputProps={{ min: 0, max: 100, step: 1 }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 4 }}>
              <FormField
                name="diam"
                label="Diámetro (cm)"
                type="number"
                value={data.diam}
                onChange={onChange}
                required
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 4 }}>
              <FormField
                name="lng"
                label="Longitud (m)"
                type="number"
                value={data.lng}
                onChange={onChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ bgcolor: "#f5f5f5" }}>
                <Typography variant="caption" color="textSecondary">
                  🔧 <strong>Para SWMM:</strong> La obstrucción en tuberías
                  reduce la capacidad de conducción. Se modela como reducción
                  del área hidráulica efectiva.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );

      case "pozo":
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormField
                name="total"
                label="Profundidad total (m)"
                type="number"
                value={data.total}
                onChange={onChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormField
                name="diametro"
                label="Diametro (cm)"
                type="number"
                value={data.prof}
                onChange={onChange}
                required
                // helperText="Nivel de agua en el pozo"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                <Typography variant="caption" color="textSecondary">
                  🕳️ <strong>Para SWMM:</strong> El pozo se modela como un nodo
                  (Junction). La capacidad y profundidad definen el
                  almacenamiento y la conexión con tuberías.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" gutterBottom>
        Parámetros de Infraestructura
      </Typography>
      {tipo && INFRAESTRUCTURA_INFO[tipo] && (
        <Typography
          variant="body2"
          color="textSecondary"
          align="justify"
          sx={{ mb: 2 }}
        >
          {INFRAESTRUCTURA_INFO[tipo].descripcion}
        </Typography>
      )}
      {renderCamposEspecificos()}
    </Box>
  );
};

export const DialogAdd = ({
  dialogOpen,
  handleCloseDialog,
  dialogCoords,
  comite,
  setMarkData,
  ...props
}) => {
  const [dialogData, setDialogData] = useState({
    type: "Infraestructura", // Fijo como Infraestructura
    subtype: "",
    desc: "",
    img: "",
    // Campos para infraestructura
    cap: "",
    tipo_mat: "",
    obs: "",
    dimx: "",
    dimy: "",
    prof: "",
    total: "",
    diam: "",
    lng: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");

  const userName = JSON.parse(localStorage.getItem("user") || null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      setDialogData({
        type: "Infraestructura",
        subtype: "",
        desc: "",
        img: "",
        cap: "",
        tipo_mat: "",
        obs: "",
        dimx: "",
        dimy: "",
        prof: "",
        total: "",
        diam: "",
        lng: "",
      });
      setError("");
      setSelectedTipo("");
    }
  }, [dialogOpen]);

  const handleData = useCallback(
    (e) => {
      const { name, value } = e.target;
      setDialogData((prev) => ({ ...prev, [name]: value }));
      // Si cambia el subtipo, resetear campos específicos
      if (name === "subtype") {
        setSelectedTipo(value);
        const resetFields = {
          cap: "",
          tipo_mat: "",
          obs: "",
          dimx: "",
          dimy: "",
          prof: "",
          total: "",
          diam: "",
          lng: "",
        };
        setDialogData((prev) => ({ ...prev, ...resetFields, subtype: value }));
      }
      if (error) setError("");
    },
    [error],
  );

  const validateForm = () => {
    if (!dialogData.subtype) {
      setError("Por favor seleccione el tipo de infraestructura");
      return false;
    }
    if (!dialogData.desc?.trim()) {
      setError("Por favor ingrese una descripción");
      return false;
    }

    // Validaciones específicas según el tipo
    const tipo = dialogData.subtype;
    if (tipo === "sumidero") {
      if (!dialogData.cap || dialogData.cap === "") {
        setError("Por favor ingrese la capacidad de infiltración");
        return false;
      }
      if (!dialogData.tipo_mat) {
        setError("Por favor seleccione el tipo de material obstruyente");
        return false;
      }
      if (dialogData.obs === "" || dialogData.obs === null) {
        setError("Por favor ingrese el nivel de obstrucción");
        return false;
      }
      if (!dialogData.dimx || dialogData.dimx === "") {
        setError("Por favor ingrese la dimensión X");
        return false;
      }
      if (!dialogData.dimy || dialogData.dimy === "") {
        setError("Por favor ingrese la dimensión Y");
        return false;
      }
      if (dialogData.prof === "" || dialogData.prof === null) {
        setError("Por favor ingrese la profundidad");
        return false;
      }
    }
    if (tipo === "tuberia") {
      if (dialogData.obs === "" || dialogData.obs === null) {
        setError("Por favor ingrese el nivel de obstrucción");
        return false;
      }
      if (!dialogData.diam || dialogData.diam === "") {
        setError("Por favor ingrese el diámetro");
        return false;
      }
      if (!dialogData.lng || dialogData.lng === "") {
        setError("Por favor ingrese la longitud");
        return false;
      }
    }
    if (tipo === "pozo") {
      if (!dialogData.cap || dialogData.cap === "") {
        setError("Por favor ingrese la capacidad de almacenamiento");
        return false;
      }
      if (!dialogData.tipo_mat) {
        setError("Por favor seleccione el tipo de material");
        return false;
      }
      if (dialogData.total === "" || dialogData.total === null) {
        setError("Por favor ingrese la profundidad total");
        return false;
      }
      if (!dialogData.dimx || dialogData.dimx === "") {
        setError("Por favor ingrese la dimensión X");
        return false;
      }
      if (!dialogData.dimy || dialogData.dimy === "") {
        setError("Por favor ingrese la dimensión Y");
        return false;
      }
      if (dialogData.prof === "" || dialogData.prof === null) {
        setError("Por favor ingrese la profundidad de agua");
        return false;
      }
    }

    return true;
  };

  const cleanCoordinate = (coord) => {
    if (!coord) return null;
    let coordStr = coord.toString();
    coordStr = coordStr.replace(",", ".");
    coordStr = coordStr.replace(/[^0-9.-]/g, "");
    const num = parseFloat(coordStr);
    return isNaN(num) ? null : num;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!comite) {
      setError("No hay un comité seleccionado");
      return;
    }
    const cleanLat = cleanCoordinate(dialogCoords?.lat);
    const cleanLng = cleanCoordinate(dialogCoords?.lng);
    setLoading(true);
    try {
      const newMarker = {
        ...dialogData,
        lat: cleanLat,
        lng: cleanLng,
        comite,
        by: userName,
        created_at: new Date().toISOString(),
      };

      console.log("Enviando marcador de infraestructura:", newMarker);
      handleCloseDialog();
      setMarkData((prev) => [...(Array.isArray(prev) ? prev : []), newMarker]);
    } catch (err) {
      setError("Error al guardar el marcador. Intente nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDialogTitle = () => {
    if (dialogData.subtype && INFRAESTRUCTURA_INFO[dialogData.subtype]) {
      return INFRAESTRUCTURA_INFO[dialogData.subtype].titulo;
    }
    return "Registrar Infraestructura de Drenaje";
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WaterIcon color="info" />
          <Typography variant="h6">{getDialogTitle()}</Typography>
        </Box>
        <IconButton edge="end" onClick={props.handleEditPol} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Información de ubicación */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f8f9fa" }}>
            <Typography variant="body2" color="textSecondary">
              📍 <strong>Ubicación:</strong> {dialogCoords?.lat},{" "}
              {dialogCoords?.lng}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              🏢 <strong>Comité:</strong> {comite || "No seleccionado"}
            </Typography>
          </Paper>

          {/* Selector de tipo de infraestructura */}
          <FormField
            name="subtype"
            label="Tipo de Infraestructura"
            type="select"
            options={CONFIG.infraestructura.subtypes}
            value={dialogData.subtype}
            onChange={handleData}
            required
          />

          {/* Texto descriptivo según tipo */}
          <Typography
            variant="caption"
            color="textSecondary"
            align="justify"
            sx={{ mt: 1, display: "block" }}
          >
            Registro de elementos del sistema de drenaje pluvial y
            alcantarillado. Incluye sumideros, tuberías y pozos de inspección.
            Los datos recopilados permiten evaluar la capacidad hidráulica y el
            nivel de obstrucción de la infraestructura, fundamental para
            prevenir inundaciones y planificar el mantenimiento.
          </Typography>

          {/* Campos específicos según el tipo */}
          {dialogData.subtype && (
            <InfraestructuraParams data={dialogData} onChange={handleData} />
          )}

          {/* Campos comunes */}
          <FormField
            name="desc"
            label="Descripción detallada"
            type="textarea"
            value={dialogData.desc}
            onChange={handleData}
            required
            helperText="Describa el estado, ubicación específica y observaciones relevantes"
          />

          <FormField
            name="img"
            label="URL de imagen (opcional)"
            value={dialogData.img}
            onChange={handleData}
            placeholder="https://ejemplo.com/imagen.jpg"
            helperText="Adjunte una imagen del elemento para documentación visual"
          />

          {/* Mensaje de error */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Requisitos */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: "block", mt: 2 }}
          >
            * Campos obligatorios
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleCloseDialog} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !comite || !dialogData.subtype}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? "Guardando..." : "Guardar Infraestructura"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
