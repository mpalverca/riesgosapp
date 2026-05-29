import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import WarningIcon from "@mui/icons-material/Warning";
import VulnerabilityIcon from "@mui/icons-material/Shield";
import ResourceIcon from "@mui/icons-material/Construction";
import { useInforComite } from "./crud";

// Configuraciones separadas para mejor mantenimiento
const CONFIG = {
  amenaza: {
    title: "Registrar Amenaza",
    icon: <WarningIcon color="error" />,
    subtypes: [
      { value: "natural", label: "Natural" },
      { value: "social_natural", label: "Socio Naturales" },
      { value: "antropica", label: "Antrópica" },
      { value: "tecnologica", label: "Tecnológica" },
    ],
  },
  vulnerabilidad: {
    title: "Registrar Vulnerabilidad",
    icon: <VulnerabilityIcon color="warning" />,
    subtypes: [
      { value: "Fisica", label: "Física" },
      { value: "Economica", label: "Económica" },
      { value: "Social", label: "Social" },
      { value: "Ambiental", label: "Ambiental" },
    ],
  },
  recurso: {
    title: "Registrar Recurso",
    icon: <ResourceIcon color="primary" />,
    subtypes: [
      { value: "Equipamientos", label: "Equipamientos" },
      { value: "Social", label: "Social" },
      { value: "Recursos", label: "Recursos Materiales" },
    ],
  },
};

// Data mappings
const SUBTYPE_OPTIONS = {
  natural: [
    { value: "Inundación", label: "🌊 Inundación" },
    { value: "Movimiento_masa", label: "⛰️ Movimiento en masa" },
    { value: "Sismo", label: "🌋 Sismo" },
    { value: "Sequía", label: "☀️ Sequía" },
    { value: "Helada", label: "❄️ Helada" },
    { value: "Avenidas_torrenciales", label: "💧 Avenidas torrenciales" },
    { value: "Erosión_Litoral", label: "🌊 Erosión Litoral" },
    { value: "Granizada", label: "🧊 Granizada" },
  ],
  social_natural: [
    { value: "Inundación", label: "🌊 Inundación" },
    { value: "Movimiento_masa", label: "⛰️ Movimiento en masa" },
    { value: "incendios", label: "🔥 Incendios Forestales" },
  ],
  antropica: [
    { value: "Aglomeración", label: "👥 Aglomeración" },
    { value: "Contaminación", label: "🏭 Contaminación" },
  ],
  tecnologica: [
    { value: "Derrames", label: "🛢️ Derrames" },
    { value: "Fugas", label: "💨 Fugas" },
    { value: "Explosiones", label: "💥 Explosiones" },
    { value: "incendios", label: "🔥 Incendios (Estructurales y forestales)" },
  ],
  recursos_equipamientos: [
    { value: "a_comunal", label: "🏢 Área Comunal" },
    { value: "a_deportiva", label: "⚽ Área Deportiva" },
    { value: "Bomberos", label: "🚒 Bomberos" },
    { value: "UPC", label: "👮 UPC" },
    { value: "Centro de salud", label: "🏥 Centro de salud" },
    { value: "Albergue", label: "🏠 Albergue" },
    { value: "iglesia", label: "⛪ Iglesia" },
    { value: "otro", label: "📝 Otro (especificar)" },
  ],
  recursos_materiales: [
    { value: "Plan_comu", label: "📋 Plan comunitario" },
    { value: "Sis_alerta", label: "🔔 Sistemas de alerta" },
    { value: "sings", label: "⚠️ Señalética" },
    { value: "chalecos", label: "🦺 Chalecos" },
    { value: "picos", label: "⛏️ Picos" },
    { value: "extintores", label: "🧯 Extintores" },
    { value: "camas", label: "🛏️ Camas" },
    { value: "botiquin", label: "💊 Botiquín" },
    { value: "linternas", label: "🔦 Linternas" },
    { value: "radios", label: "📻 Radios de comunicación" },
    { value: "generador", label: "⚡ Generador eléctrico" },
    { value: "carpa", label: "⛺ Carpa/tienda de campaña" },
    { value: "otro", label: "📝 Otro (especificar)" },
  ],
};

// Componente de texto de vulnerabilidad
const VulnerabilityText = ({ type }) => {
  const texts = {
    Fisica: "La vulnerabilidad física se relaciona con la calidad de construcciones, infraestructura y ubicación geográfica. Incluye viviendas, establecimientos económicos, servicios públicos y la calidad del suelo donde se asientan los centros poblados.",
    Economica: "La vulnerabilidad económica refleja la capacidad de la población para hacer frente a desastres. Está determinada por el nivel de ingresos, acceso a activos económicos y satisfacción de necesidades básicas.",
    Social: "La vulnerabilidad social se analiza desde el nivel de organización y participación comunitaria. Las comunidades organizadas tienen mayor capacidad para prevenir y responder ante emergencias.",
    Ambiental: "La vulnerabilidad ambiental es el grado de resistencia del medio natural ante la variabilidad climática, incluyendo deterioro ambiental, deforestación, contaminación y pérdida de biodiversidad.",
  };
  
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: "#f5f5f5" }}>
      <Typography variant="body2" align="justify" color="textSecondary">
        {texts[type] || "Seleccione un tipo de vulnerabilidad para ver más información"}
      </Typography>
    </Paper>
  );
};

// Componente de campo reutilizable
const FormField = ({ name, label, type = "text", options = [], value, onChange, required = false, ...props }) => (
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
    {...props}
  >
    {type === "select" && options.map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </TextField>
);

// Componente de parámetros para amenazas
const AmenazaParams = ({ data, onChange }) => (
  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle2" gutterBottom>
      Parámetros de evaluación
    </Typography>
    <FormField
      name="freq"
      label="Frecuencia"
      type="select"
      options={[
        { value: "1", label: "🟢 Baja - Evento cada 5-20 años" },
        { value: "2", label: "🟡 Media - Evento cada 3-5 años" },
        { value: "3", label: "🔴 Alta - Evento más de una vez al año" },
      ]}
      value={data.freq}
      onChange={onChange}
    />
    <FormField
      name="intensity"
      label="Magnitud/Intensidad"
      type="select"
      options={[
        { value: "1", label: "🟢 Baja - Sin fallecidos, mínima afectación" },
        { value: "2", label: "🟡 Media - Pocos fallecidos, afectación temporal" },
        { value: "3", label: "🔴 Alta - Numerosos fallecidos, afectación masiva" },
      ]}
      value={data.intensity}
      onChange={onChange}
    />
    <FormField
      name="surface"
      label="Territorio Afectado"
      type="select"
      options={[
        { value: "1", label: "🟢 Baja - Menos del 50% del territorio" },
        { value: "2", label: "🟡 Media - Entre 50% y 80% del territorio" },
        { value: "3", label: "🔴 Alta - Más del 80% del territorio" },
      ]}
      value={data.surface}
      onChange={onChange}
    />
  </Box>
);

export const DialogAdd = ({
  dialogOpen,
  handleCloseDialog,
  dialogCoords,
  comite,
  setMarkData,
}) => {
  const [dialogData, setDialogData] = useState({
    type: "",
    subtype: "",
    specific_type: "",
    specific_resource: "",
    freq: "",
    intensity: "",
    surface: "",
    desc: "",
    img: "",
    nombre: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const { post } = useInforComite();

  const userName = JSON.parse(localStorage.getItem("user") || "Usuario");
  

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      setDialogData({
        type: "", subtype: "", specific_type: "", specific_resource: "",
        freq: "", intensity: "", surface: "", desc: "", img: "", nombre: "",
      });
      setActiveStep(0);
      setError("");
    }
  }, [dialogOpen]);

  const handleData = useCallback((e) => {
    const { name, value } = e.target;
    setDialogData(prev => ({ ...prev, [name]: value }));
    // Clear error when user makes changes
    if (error) setError("");
  }, [error]);

  const getSpecificOptions = useMemo(() => {
    if (dialogData.type === "Amenaza") {
      return SUBTYPE_OPTIONS[dialogData.subtype] || [];
    }
    if (dialogData.type === "Recurso") {
      if (dialogData.subtype === "Equipamientos") return SUBTYPE_OPTIONS.recursos_equipamientos;
      if (dialogData.subtype === "Recursos") return SUBTYPE_OPTIONS.recursos_materiales;
    }
    return [];
  }, [dialogData.type, dialogData.subtype]);

  const validateForm = () => {
    if (!dialogData.type) {
      setError("Por favor seleccione un tipo");
      return false;
    }
    if (!dialogData.subtype) {
      setError("Por favor seleccione una subcategoría");
      return false;
    }
    if (dialogData.type === "Amenaza" && !dialogData.specific_type && getSpecificOptions.length > 0) {
      setError("Por favor seleccione el tipo específico");
      return false;
    }
    if (!dialogData.desc?.trim()) {
      setError("Por favor ingrese una descripción");
      return false;
    }
    return true;
  };
const cleanCoordinate = (coord) => {
  if (!coord) return null;
  
  // Convertir a string si es número
  let coordStr = coord.toString();
  
  // Reemplazar coma por punto (si usa coma como decimal)
  coordStr = coordStr.replace(',', '.');
  
  // Eliminar cualquier caracter que no sea número, punto o signo menos
  coordStr = coordStr.replace(/[^0-9.-]/g, '');
  
  // Convertir a número
  const num = parseFloat(coordStr);
  
  // Validar que sea un número válido
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

      const response = await post("post", "plan", newMarker);
       handleCloseDialog();
        setMarkData(prev => [...(Array.isArray(prev) ? prev : []), newMarker]);
      if (response) {
       
       
      }
    } catch (err) {
      setError("Error al guardar el marcador. Intente nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderDynamicFields = () => {
    switch (dialogData.type) {
      case "Amenaza":
        return (
          <>
            <FormField
              name="subtype"
              label="Clasificación de Amenaza"
              type="select"
              options={CONFIG.amenaza.subtypes}
              value={dialogData.subtype}
              onChange={handleData}
              required
            />
            {dialogData.subtype && getSpecificOptions.length > 0 && (
              <FormField
                name="specific_type"
                label="Tipo específico"
                type="select"
                options={getSpecificOptions}
                value={dialogData.specific_type}
                onChange={handleData}
                required
              />
            )}
            <AmenazaParams data={dialogData} onChange={handleData} />
          </>
        );

      case "Vulnerabilidad":
        return (
          <>
            <FormField
              name="subtype"
              label="Tipo de Vulnerabilidad"
              type="select"
              options={CONFIG.vulnerabilidad.subtypes}
              value={dialogData.subtype}
              onChange={handleData}
              required
            />
            {dialogData.subtype && <VulnerabilityText type={dialogData.subtype} />}
          </>
        );

      case "Recurso":
        return (
          <>
            <FormField
              name="subtype"
              label="Tipo de Recurso"
              type="select"
              options={CONFIG.recurso.subtypes}
              value={dialogData.subtype}
              onChange={handleData}
              required
            />
            {dialogData.subtype && getSpecificOptions.length > 0 && (
              <>
                <FormField
                  name="specific_resource"
                  label="Recurso específico"
                  type="select"
                  options={getSpecificOptions}
                  value={dialogData.specific_resource}
                  onChange={handleData}
                  required
                />
                {dialogData.specific_resource === "otro" && (
                  <FormField
                    name="nombre"
                    label="Especificar recurso"
                    value={dialogData.nombre}
                    onChange={handleData}
                    required
                  />
                )}
              </>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    if (!dialogData.type) return "Agregar Marcador";
    return CONFIG[dialogData.type.toLowerCase()]?.title || "Agregar Marcador";
  };

  const getDialogIcon = () => {
    if (!dialogData.type) return null;
    return CONFIG[dialogData.type.toLowerCase()]?.icon;
  };

  return (
    <Dialog 
      open={dialogOpen} 
      onClose={handleCloseDialog} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getDialogIcon()}
          <Typography variant="h6">{getDialogTitle()}</Typography>
        </Box>
        <IconButton edge="end" onClick={handleCloseDialog} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Información de ubicación */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
            <Typography variant="body2" color="textSecondary">
              📍 <strong>Ubicación:</strong> {dialogCoords?.lat}, {dialogCoords?.lng}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              🏢 <strong>Comité:</strong> {comite || "No seleccionado"}
            </Typography>
          </Paper>

          {/* Selector de tipo principal */}
          <FormField
            name="type"
            label="Tipo de registro"
            type="select"
            options={[
              { value: "Amenaza", label: "⚠️ Amenaza" },
              { value: "Vulnerabilidad", label: "🛡️ Vulnerabilidad" },
              { value: "Recurso", label: "🔧 Recurso" },
            ]}
            value={dialogData.type}
            onChange={handleData}
            required
          />

          {/* Campos dinámicos según el tipo */}
          {dialogData.type && renderDynamicFields()}

          {/* Campos comunes */}
          <FormField
            name="desc"
            label="Descripción detallada"
            type="textarea"
            value={dialogData.desc}
            onChange={handleData}
            required
          />
          
          <FormField
            name="img"
            label="URL de imagen (opcional)"
            value={dialogData.img}
            onChange={handleData}
            placeholder="https://ejemplo.com/imagen.jpg"
          />

          {/* Mensaje de error */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Requisitos */}
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
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
          disabled={loading || !comite || !dialogData.type}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? "Guardando..." : "Guardar Marcador"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};