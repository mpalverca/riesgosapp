import React, { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  IconButton,
  Stack,
  Fade,
  CircularProgress,
  Alert,
  Snackbar,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";

// Opciones para el select de tipo
const TIPO_OPTIONS = [
  {
    value: "sumidero",
    label: "Sumidero",
    description: "Estructuras de drenaje pluvial",
  },
  { value: "tuberia", label: "Tubería", description: "Sistemas de tuberías" },
  {
    value: "pozo",
    label: "Pozo de Revisión ",
    description: "Pozos de Revisión del sistema de Alcantarillado",
  },
];

function Panel({ getData, getAllData, loading = false, error = null,selectedValue, setSelectedValue, ...props }) {
  const [search, setSearch] = useState({
    parroq: "",
    sector: "",
    tipo: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const barriosOptions = Array.isArray(props.data) ? props.barData : [];
const handleSearch = async () => {
    if (!selectedValue) {
      console.warn("No hay valor seleccionado");
      return;
    }

    try {
      
       getData(search.parroq, selectedValue, search.tipo);
      // No necesitas llamar a props.setSelectSect aquí porque el useEffect lo hará
    } catch (error) {
      console.error("Error al buscar sector:", error);
    }
  };
  // Handlers optimizados
  const handleChange = useCallback(
    (field) => (event) => {
      setSearch((prev) => ({ ...prev, [field]: event.target.value }));
    },
    [],
  );

  
  const handleSearchAll = useCallback(() => {
    getAllData();
    setSnackbar({
      open: true,
      message: "Mostrando todos los registros",
      severity: "info",
    });
  }, [getData]);

  const handleClear = useCallback(() => {
    setSearch({ parroq: "", sector: "", tipo: "" });
    setSnackbar({
      open: true,
      message: "Filtros limpiados",
      severity: "success",
    });
  }, []);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch],
  );

  const activeFiltersCount = [search.parroq, search.sector, search.tipo].filter(
    Boolean,
  ).length;

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#1976d2",
          fontWeight: 600,
        }}
      >
        <LocationOnIcon fontSize="large" />
        Servicios Básicos
        {activeFiltersCount > 0 && (
          <Chip
            label={`${activeFiltersCount} filtro(s) activo(s)`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
        )}
      </Typography>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onKeyPress={handleKeyPress}
      >
        <Grid container spacing={2} alignItems="center">
         
          {/* Campo Sector */}
          <Grid item size={{ xs: 12, md: 5 }}>
            {/* Campo Parroquia */}
          <Autocomplete
            options={barriosOptions}
            value={selectedValue}
            onChange={(event, newValue) => {
              setSelectedValue(newValue);

              //if (sectorD) clearSectorData();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecciona un Sector"
                variant="outlined"
                fullWidth
               // helperText="Selecciona un barrio de la lista"
              />
            )}
          />
          </Grid>

          {/* Select de Tipo (mejorado con MUI) */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <FormControl
              fullWidth
              size="medium"
              sx={{ bgcolor: "white", borderRadius: 1 }}
            >
              <InputLabel id="tipo-select-label">
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CategoryIcon fontSize="small" />
                  Tipo de servicio
                </Box>
              </InputLabel>
              <Select
                labelId="tipo-select-label"
                value={search.tipo}
                onChange={handleChange("tipo")}
                label="Tipo de servicio"
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>Todos los tipos</em>
                </MenuItem>
                {TIPO_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="body2">{option.label}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {option.description}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Botones de acción */}
          <Grid item size={{ xs: 12, md: 1 }}>
            <Button
              type="button"
              variant="contained"
              fullWidth
              onClick={handleSearch}
              disabled={loading}
              sx={{
                height: "56px",
                borderRadius: 2,
                background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                },
              }}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
            >
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </Grid>

          <Grid item size={{ xs: 12, md: 1 }}>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={handleSearchAll}
              disabled={loading}
              sx={{
                height: "56px",
                borderRadius: 2,
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
              startIcon={<RefreshIcon />}
            >
              Todo
            </Button>
          </Grid>

          <Grid item size={{ xs: 12, md: 1 }}>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={handleClear}
              disabled={loading}
              sx={{
                height: "56px",
                borderRadius: 2,
                borderColor: "#dc004e",
                color: "#dc004e",
                "&:hover": {
                  borderColor: "#c51162",
                  backgroundColor: "rgba(220, 0, 78, 0.04)",
                },
              }}
              startIcon={<ClearAllIcon />}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>

        {/* Indicadores de búsqueda activa */}
        {activeFiltersCount > 0 && (
          <Fade in timeout={500}>
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {search.parroq && (
                <Chip
                  label={`Parroquia: ${search.parroq}`}
                  onDelete={() =>
                    setSearch((prev) => ({ ...prev, parroq: "" }))
                  }
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedValue && (
                <Chip
                  label={`Sector: ${selectedValue}`}
                  onDelete={() =>
                    setSelectedValue(null)
                  }
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {search.tipo && (
                <Chip
                  label={`Tipo: ${TIPO_OPTIONS.find((opt) => opt.value === search.tipo)?.label || search.tipo}`}
                  onDelete={() => setSearch((prev) => ({ ...prev, tipo: "" }))}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Fade>
        )}

        {/* Mensaje de error */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => {}}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default Panel;
