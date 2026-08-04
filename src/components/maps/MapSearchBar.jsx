// features/map/MapSearchBar.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Popper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Fade,
} from "@mui/material";
import {
  Search,
  MyLocation,
  Close,
  LocationOn,
} from "@mui/icons-material";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const MapSearchBar = ({ onLocationSelect, onUseCurrentLocation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const provider = new OpenStreetMapProvider();

  // Buscar lugares al escribir
  useEffect(() => {
    const searchPlaces = async () => {
      if (searchTerm.length < 3) {
        setResults([]);
        setOpen(false);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await provider.search({ query: searchTerm });
        console.log("Resultados de búsqueda:", searchResults); // Para depuración

        // Normalizar resultados para asegurar que tienen lat/lng
        const normalizedResults = searchResults
          .map((result) => {
            // Intentar extraer coordenadas de diferentes formatos
            let lat = result.lat || result.y || result.latitude || null;
            let lng = result.lng || result.x || result.longitude || null;
            let label = result.label || result.display_name || "Ubicación";

            // Si no hay coordenadas, saltar este resultado
            if (lat === null || lng === null) {
              console.warn("Resultado sin coordenadas válidas:", result);
              return null;
            }

            // Convertir a número
            lat = parseFloat(lat);
            lng = parseFloat(lng);

            // Verificar que sean números válidos
            if (isNaN(lat) || isNaN(lng)) {
              console.warn("Coordenadas inválidas:", result);
              return null;
            }

            return {
              lat,
              lng,
              label: label,
              raw: result, // Guardar datos originales por si se necesitan
            };
          })
          .filter(Boolean); // Eliminar resultados nulos

        setResults(normalizedResults.slice(0, 5));
        setOpen(normalizedResults.length > 0);
      } catch (error) {
        console.error("Error buscando lugares:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPlaces, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Manejar selección de resultado
  const handleSelectResult = (result) => {
    if (!result || result.lat === undefined || result.lng === undefined) {
      console.warn("Resultado inválido seleccionado:", result);
      return;
    }

    const { lat, lng, label } = result;
    onLocationSelect({ lat, lng, label });
    setSearchTerm(label || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    setOpen(false);
    setResults([]);
    setAnchorEl(null);
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelectResult(results[0]);
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          p: "2px 4px",
          borderRadius: 20,
          bgcolor: "white",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <IconButton sx={{ p: "10px" }} aria-label="menu">
          <Search />
        </IconButton>
        <TextField
          inputRef={inputRef}
          placeholder="Buscar lugar o coordenadas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={(e) => {
            setAnchorEl(e.currentTarget);
            if (results.length > 0) setOpen(true);
          }}
          variant="standard"
          fullWidth
          sx={{
            "& .MuiInputBase-root": {
              "&:before": { borderBottom: "none" },
              "&:after": { borderBottom: "none" },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={20} />}
                {searchTerm && (
                  <IconButton size="small" onClick={handleClear}>
                    <Close fontSize="small" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          sx={{ p: "10px" }}
          aria-label="current location"
          onClick={onUseCurrentLocation}
          color="primary"
        >
          <MyLocation />
        </IconButton>
      </Paper>

      <Popper
        open={open && results.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        sx={{
          width: "100%",
          maxWidth: 400,
          zIndex: 10000,
          mt: 1,
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              elevation={3}
              sx={{
                maxHeight: 300,
                overflow: "auto",
                borderRadius: 2,
                bgcolor: "white",
              }}
            >
              <List dense>
                {results.map((result, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSelectResult(result)}
                    sx={{
                      "&:hover": { bgcolor: "#f0f2f5" },
                    }}
                  >
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={result.label || "Ubicación"}
                      secondary={
                        result.lat && result.lng
                          ? `${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`
                          : "Coordenadas no disponibles"
                      }
                      primaryTypographyProps={{ variant: "body2" }}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default MapSearchBar;