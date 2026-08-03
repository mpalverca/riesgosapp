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
  Snackbar,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useState, useEffect, useCallback, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { crearPoligono, crearRegistro } from "../script";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";

// --- Constantes de opciones (sin cambios) ---
const AFECTACIONES = [
  { value: "Equipamiento", label: "Equipamiento" },
  { value: "Infraestructura", label: "Infraestructura" },
  { value: "Márgenes", label: "Márgenes" },
  { value: "Predio", label: "Predio" },
  {
    value: "Servicios de AAPP/AALL/AASS",
    label: "Servicios de AAPP/AALL/AASS",
  },
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
  "Chantaco",
  "Chuquiribamba",
  "El Cisne",
  "Gualel",
  "Jimbilla",
  "Loja",
  "Malacatos",
  "Punzara",
  "Sagrario",
  "San Lucas",
  "Santiago",
  "San Pedro de Vilcabamba",
  "San Sebastián",
  "Sucre",
  "Taquil",
  "Quinara",
  "El Valle",
  "Vilcabamba",
  "Yangana",
].map((p) => ({ value: p, label: p }));

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
    depen: "",
  });
  
  // Estado para polígono
  const [dialogPol, setDialogaPol] = useState({
    parrquia: "",
    sector: "",
    Descripcio: "",
    tipo: "",
  });
  
  // Estado para el polígono dibujado
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);
  const [polygonArea, setPolygonArea] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("point");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const featureGroupRef = useRef(null);
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
        prioridad: "",
        radio: "",
        anex_foto: "",
        depen: "",
      });
      setDialogaPol({
        parrquia: "",
        sector: "",
        Descripcio: "",
        tipo: "",
      });
      setPolygonCoordinates(null);
      setPolygonArea(0);
      setError("");
      setSnackbar((prev) => ({ ...prev, open: false }));
    }
  }, [dialogOpen]);

  // Cargar datos del polígono existente
  useEffect(() => {
    if (type === "poligono" && polyData && polyData.geometry) {
      const coords = polyData.geometry.coordinates[0];
      setPolygonCoordinates(coords);
      // Calcular área si existe
      if (coords && coords.length > 2) {
        const area = L.geoJSON({
          type: "Polygon",
          coordinates: [coords]
        }).getLayers()[0]?.getArea?.() || 0;
        setPolygonArea(area);
      }
    }
  }, [type, polyData]);

  const handleData = useCallback(
    (e) => {
      const { name, value } = e.target;
      setDialogData((prev) => ({ ...prev, [name]: value }));
      if (error) setError("");
    },
    [error],
  );

  const handleDataPol = useCallback(
    (e) => {
      const { name, value } = e.target;
      setDialogaPol((prev) => ({ ...prev, [name]: value }));
      if (error) setError("");
    },
    [error],
  );

  // Manejar dibujo de polígono
  const handleDrawCreated = useCallback((e) => {
    const { layerType, layer } = e;
    
    if (layerType === "polygon") {
      // Extraer coordenadas del polígono
      const latlngs = layer.getLatLngs()[0];
      const coords = latlngs.map((latlng) => [latlng.lng, latlng.lat]);
      
      // Cerrar el polígono (primer y último punto igual)
      if (coords[0][0] !== coords[coords.length - 1][0] || 
          coords[0][1] !== coords[coords.length - 1][1]) {
        coords.push(coords[0]);
      }
      
      setPolygonCoordinates(coords);
      
      // Calcular área (en metros cuadrados)
      const polygonLayer = layer;
      const area = polygonLayer.getArea ? polygonLayer.getArea() : 0;
      setPolygonArea(area);
      
      setError("");
    }
  }, []);

  // Manejar edición de polígono
  const handleDrawEdited = useCallback((e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        const latlngs = layer.getLatLngs()[0];
        const coords = latlngs.map((latlng) => [latlng.lng, latlng.lat]);
        
        // Cerrar el polígono
        if (coords[0][0] !== coords[coords.length - 1][0] || 
            coords[0][1] !== coords[coords.length - 1][1]) {
          coords.push(coords[0]);
        }
        
        setPolygonCoordinates(coords);
        
        const area = layer.getArea ? layer.getArea() : 0;
        setPolygonArea(area);
      }
    });
  }, []);

  // Manejar eliminación de polígono
  const handleDrawDeleted = useCallback(() => {
    setPolygonCoordinates(null);
    setPolygonArea(0);
  }, []);

  // Validación de campos obligatorios
  const validateForm = useCallback(() => {
    if (type === "point") {
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
    } else {
      // Validación para polígono
      const requiredFields = [
        { field: "parrquia", label: "Parroquia" },
        { field: "sector", label: "Sector" },
        { field: "Descripcio", label: "Descripción detallada" },        
        { field: "tipo", label: "Tipo de afectación" },
      ];

      for (const { field, label } of requiredFields) {
        if (!dialogPol[field]?.trim()) {
          setError(`El campo "${label}" es obligatorio`);
          return false;
        }
      }

      if (!polygonCoordinates || polygonCoordinates.length < 4) {
        setError("Debe dibujar un polígono válido");
        return false;
      }

      return true;
    }
  }, [type, dialogData, dialogPol, polygonCoordinates]);

  // Limpieza de coordenadas
  const cleanCoordinate = useCallback((coord) => {
    if (!coord) return null;
    let coordStr = coord.toString().replace(",", ".");
    coordStr = coordStr.replace(/[^0-9.-]/g, "");
    const num = parseFloat(coordStr);
    return isNaN(num) ? null : num;
  }, []);

  // Envío del formulario
  const handleSubmitAfect = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let newMarker;

      if (type === "point") {
        const cleanLat = cleanCoordinate(dialogCoords?.lat);
        const cleanLng = cleanCoordinate(dialogCoords?.lng);

        if (cleanLat === null || cleanLng === null) {
          setError(
            "Coordenadas inválidas. Por favor, seleccione una ubicación válida.",
          );
          setLoading(false);
          return;
        }

        newMarker = {
          ...dialogData,
          geom: { type: "Point", coordinates: [cleanLng, cleanLat] },
          date: new Date().toISOString(),
          radio: parseFloat(dialogData.radio) || 0,
          
        };
      } else {
        // Crear registro de polígono
        newMarker = {
          ...dialogPol,
          geom: {
            type: "MultiPolygon",
            coordinates: [[polygonCoordinates]],
          },
          Date_ev: new Date().toISOString(),
          AREA: polygonArea,
         
          // Propiedades adicionales para polígonos
        
        };
      }

      if (type === "point") {
        await crearRegistro(newMarker);
      } else{
        await crearPoligono(newMarker)
      }

      setSnackbar({
        open: true,
        message: type === "point" 
          ? "Afectación guardada con éxito" 
          : "Polígono guardado con éxito",
        severity: "success",
      });
      
      handleCloseDialog();
      setMarkData((prev) => [...(Array.isArray(prev) ? prev : []), newMarker]);
    } catch (err) {
      setError("Error al guardar. Intente nuevamente.");
      setSnackbar({
        open: true,
        message: "Error al guardar",
        severity: "error",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const hasValidCI = userName?.ci && userName.ci !== "";

  if (!hasValidCI) {
    return (
      <Snackbar open={true} autoHideDuration={5000}>
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          "No se puede ingresar información"
        </Alert>
      </Snackbar>
    );
  }

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {type === "point" ? "Agregar afectación" : "Agregar polígono"}
          </Typography>
          <Button onClick={handleCloseDialog} color="inherit" size="small">
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent dividers>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tipo de dato</InputLabel>
            <Select
              value={type}
              label="Tipo de dato"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="point">Punto</MenuItem>
              <MenuItem value="poligono">Polígono</MenuItem>
            </Select>
          </FormControl>

          {type === "point" ? (
            // ... (código existente para punto - sin cambios) ...
            <Box sx={{ pt: 1 }}>
              {/* Ubicación */}
              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <LocationOnIcon color="action" />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Coordenadas:</strong> {dialogCoords?.lat || "—"}
                      , {dialogCoords?.lng || "—"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                📋 Información general
              </Typography>

              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, md: 6 }}>
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
                <Grid item size={{ xs: 12, md: 6 }}>
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
                <Grid item size={{ xs: 12, md: 6 }}>
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
                <Grid item size={{ xs: 12, md: 6 }}>
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
              <Typography variant="subtitle2" gutterBottom>
                📝 Descripción y acciones
              </Typography>

              <Grid container spacing={2}>
                <Grid item size={{ xs: 12 }}>
                  <FormField
                    name="descripcio"
                    label="Descripción detallada"
                    type="textarea"
                    value={dialogData.descripcio}
                    onChange={handleData}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <FormField
                    name="depen"
                    label="Instituciones que atienden"
                    type="text"
                    value={dialogData.depen}
                    onChange={handleData}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
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
              <Typography variant="subtitle2" gutterBottom>
                ⚙️ Estado y prioridad
              </Typography>

              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, md: 6 }}>
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
                <Grid item size={{ xs: 12, md: 6 }}>
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
                <Grid item size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="radio"
                    label="Radio de afectación (m)"
                    type="number"
                    value={dialogData.radio}
                    onChange={handleData}
                    InputProps={{ inputProps: { min: 0, step: 10 } }}
                  />
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
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
                <Alert
                  severity="error"
                  sx={{ mt: 2 }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: "block", mt: 2 }}
              >
                * Campos obligatorios
              </Typography>
            </Box>
          ) : (
            // --- SECCIÓN DE POLÍGONO CON LEAFLET DRAW ---
            <>
              <Typography variant="subtitle2" gutterBottom>
                📋 Información del polígono
              </Typography>

              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, md: 4 }}>
                  <FormField
                    name="parrquia"
                    label="Parroquia"
                    type="select"
                    options={PARROQUIAS}
                    value={dialogPol.parrquia}
                    onChange={handleDataPol}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 12, md: 4 }}>
                  <FormField
                    name="sector"
                    label="Sector"
                    type="text"
                    value={dialogPol.sector}
                    onChange={handleDataPol}
                    required
                  />
                </Grid>
                 <Grid item size={{ xs: 12,md: 4 }}>
                  <FormField
                    name="tipo"
                    label="Tipo"
                    type="select"
                    options={[
                      { value: "1", label: "Movimiento en masa" },
                      { value: "2", label: "Inundaciones" },
                      { value: "3", label: "Incendios Forestales" },
                    ]}
                    value={dialogPol.tipo}
                    onChange={handleDataPol}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <FormField
                    name="Descripcio"
                    label="Descripción detallada"
                    type="textarea"
                    value={dialogPol.Descripcio}
                    onChange={handleDataPol}
                    required
                  />
                </Grid>
               
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                🗺️ Dibujar polígono en el mapa
              </Typography>

              {/* Información del polígono */}
              {polygonCoordinates && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: "#e3f2fd" }}>
                  <Grid container spacing={1}>
                    <Grid item size={{ xs: 12 }}>
                      <Typography variant="body2">
                        <strong>Área:</strong> {polygonArea.toFixed(2)} m²
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                      <Typography variant="body2">
                        <strong>Vértices:</strong> {polygonCoordinates.length - 1} puntos
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <Box sx={{ height: 400, width: "100%", mb: 2 }}>
                <MapContainer
                  center={dialogCoords?.lat ? [dialogCoords.lat, dialogCoords.lng] : [-4.0, -79.2]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    attribution="&copy; Google Maps"
                  />
                  <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                      position="topright"
                      onCreated={handleDrawCreated}
                      onEdited={handleDrawEdited}
                      onDeleted={handleDrawDeleted}
                      draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        polygon: {
                          allowIntersection: false,
                          showArea: true,
                          shapeOptions: {
                            color: '#1976d2',
                            weight: 3,
                            opacity: 0.8,
                            fillColor: '#1976d2',
                            fillOpacity: 0.3,
                          },
                        },
                      }}
                      edit={{
                        remove: true,
                        edit: true,
                      }}
                    />
                  </FeatureGroup>
                </MapContainer>
              </Box>

              <Typography variant="caption" color="textSecondary">
                💡 Use las herramientas en la esquina superior derecha del mapa para dibujar o editar el polígono
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{ mt: 2 }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitAfect}
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
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};