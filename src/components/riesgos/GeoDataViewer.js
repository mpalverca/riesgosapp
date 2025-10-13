// components/GeoDataViewer.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Radio,
  FormLabel,
  Grid,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const GeoDataViewer = ({ onSearch, onSearchSector, onSearchPugs }) => {
  const [parroquia, setParroquia] = useState("");
  const [sector, setSector] = useState("");
  const [clave, setClave] = useState("");
  const [tramite, setTramite] = useState("");
  const [pugs, setPugs] = useState("");

  const parroquiasDisponibles = [
    "sucre",
    "punzara",
    "el_valle",
    "san_sebastian",
    "sagrario",
    "carigan",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parroquia || sector || clave || tramite) {
      console.log("🔍 Iniciando búsqueda:", {
        parroquia,
        sector,
        clave,
        tramite,
      });
      onSearch(parroquia, sector, clave, tramite);
    }
  };
  const handleSector = (e) => {
    e.preventDefault();
    if (parroquia || sector) {
      console.log("🔍 Iniciando búsqueda:", {
        parroquia,
        sector,
      });
      onSearchSector(parroquia, sector);
      onSearchPugs(parroquia, sector, clave);
    }
  };

  const handleParroquiaChange = (e) => {
    const nuevaParroquia = e.target.value;
    setParroquia(nuevaParroquia);
    // Si cambia la parroquia, limpiar el sector
    setSector("");
  };

  const formatParroquiaName = (name) => {
    return name.replace(/_/g, " ").toUpperCase();
  };

  return (
    <Box sx={{ p: 2, mb: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Análisis de Riesgos
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        Ingrese número de trámite para realizar consulta
      </Typography>

      <TextField
        fullWidth
        sx={{ paddingTop: 2, paddingBottom: 2 }}
        id="tramite"
        label="Trámite"
        value={tramite}
        onChange={(e) => setTramite(e.target.value)}
        placeholder="Ej: 12435-2025, 12345-2024, etc."
      />
      {/* Botón de consulta */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        // disabled={!parroquia && !sector && !clave && !tramite}
        size="large"
        fullWidth
      >
        Consultar Tramite
      </Button>

      {/* agregar condicionante que si no existe numero de tramite no se puede hacer la consulta eso despues */}
      <Box sx={{ paddingTop: 2 }} component="form">
        {/* Parroquia */}
        <FormControl fullWidth required>
          <InputLabel id="parroquia-label">Parroquia</InputLabel>
          <Select
            labelId="parroquia-label"
            id="parroquia"
            value={parroquia}
            label="Parroquia"
            onChange={handleParroquiaChange}
          >
            <MenuItem value="">
              <em>Selecciona una parroquia</em>
            </MenuItem>
            {parroquiasDisponibles.map((p) => (
              <MenuItem key={p} value={p}>
                {formatParroquiaName(p)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sector */}
        <TextField
          sx={{ paddingTop: 2, paddingBottom: 2 }}
          fullWidth
          id="sector"
          label="Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          placeholder="Ej: centro, norte, etc."
        />

        {/* Clave catastral */}
        <TextField
          fullWidth
          sx={{ paddingTop: 2, paddingBottom: 2 }}
          id="clave"
          type="number"
          label="Clave catastral"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          placeholder="Ej: 123-456-789"
        />
        {/* Botón de consulta */}
        <Button
          sx={{ paddingTop: 2 }}
          type="submit"
          variant="contained"
          onClick={handleSector}
          //color="primary"
          disabled={!parroquia && !sector}
          size="large"
          fullWidth
        >
          Buscar Sector
        </Button>
        {/* <Button
          sx={{ paddingTop: 2, paddingBottom:2 }}
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          //color="primary"
          disabled={!parroquia && !sector && !clave && !tramite}
          size="large"
          fullWidth
        >
          Consultar Datos
        </Button> */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Parroquia seleccionada:</strong>{" "}
            {parroquia ? formatParroquiaName(parroquia) : "Ninguna"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Sector:</strong> {sector || "Todos"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Trámite:</strong> {tramite || "Ninguno"}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Clave catastral:</strong> {clave || "Ninguna"}
          </Typography>
        </Box>
        <FormControl>
          <Typography align="center">
            <strong> Capas de Análisis</strong>
          </Typography>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="pit"
              control={<Radio />}
              label="Poligono de intervención terriorial (Urbano)"
            />
            <FormControlLabel
              value="atc"
              control={<Radio />}
              label="Actitud Constructuva"
            />
            <FormControlLabel
              value="vialidad"
              control={<Radio />}
              label="Vialidad"
            />
            <FormControlLabel
              value="red_aapp"
              control={<Radio />}
              label="Red de AAPP"
            />
            <FormControlLabel
              value="red_aall"
              control={<Radio />}
              label="Red de AALL"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      {/* Información de búsqueda */}
    </Box>
  );
};

export default GeoDataViewer;
