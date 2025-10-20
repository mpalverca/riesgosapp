// components/GeoDataViewer.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  InputLabel,
  Select,
} from "@mui/material";
import { control } from "leaflet";
import { fetchData } from "./searchTramite";

const GeoDataViewer = ({
  onSearch,
  onSearchSector,
  onSearchPugs,
  onDataTypeChange,
  selectedDataType,
  controlCheck,
  setControlCheck,
}) => {
  const [parroquia, setParroquia] = useState("");
  const [sector, setSector] = useState("");
  const [clave, setClave] = useState("");
  const [tramite, setTramite] = useState("");
  const [searchTramite, setSearchTramite] = useState();
  const [loading,setLoading]=useState(false)

  const parroquiasDisponibles = [
    "sucre",
    "punzara",
    "el_valle",
    "san_sebastian",
    "sagrario",
    "carigan",
  ];

  const handleDataTypeChange = (event) => {
    const newDataType = event.target.value;
    onDataTypeChange(newDataType);
  };

const handleSector = (e) => {
    e.preventDefault();
    if (parroquia || sector || clave) {
      console.log("🔍 Iniciando búsqueda:", {
        parroquia,
        sector,
        clave,
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

  const handleChange1 = (event) => {
    setControlCheck([event.target.checked, controlCheck[0]]);
  };

  const handleChange2 = (event) => {
    setControlCheck([controlCheck[1], event.target.checked]);
  };
  const handleChange3 = (event) => {
    setControlCheck([event.target.checked, event.target.controlCheck]);
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
        sx={{ marginY: 2 }}
        id="tramite"
        label="Trámite"
        value={tramite}
        helperText="ingrese el número de trámite para busqueda"
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
        onClick={() =>
          fetchData(
            tramite,
            setSearchTramite,
            setParroquia,
            setSector,
            setClave,
            setLoading
          )
        }
      >
        Consultar Tramite
      </Button>

      {/* agregar condicionante que si no existe numero de tramite no se puede hacer la consulta eso despues */}
      {loading &&(
        <Box sx={{ marginY: 2 }} component="form">
        {(!searchTramite ||
          !searchTramite.parroq ||
          !searchTramite.sector ||
          !searchTramite.clave_c) && (
          <>
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

            <TextField
              sx={{ marginY: 2 }}
              fullWidth
              id="sector"
              label="Sector"
              required
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Ej: centro, norte, etc."
              helperText="Redactar en minusculas"
            />
            <TextField
              fullWidth
              required
              sx={{ marginY: 2 }}
              id="clave"
              type="number"
              label="Clave catastral"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Ej: 123-456-789"
            />
          </>
        )}

        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Solicitado por:</strong>{" "}
            {searchTramite.solict} - ({searchTramite.id_sol })
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Fecha:</strong>{" "}
            {searchTramite.date_i }
          </Typography>
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
        <Button
          sx={{ marginY: 1 }}
          type="submit"
          variant="contained"
          onClick={handleSector}
          disabled={!parroquia && !sector}
          size="large"
          fullWidth
        >
          Buscar Sector
        </Button>
        {/* agregar texto en de busqueda una vez se cumpla la parroquia */}
        <Button
          sx={{ marginY: 1 }}
          type="submit"
          variant="contained"
          onClick={handleSector}
          disabled={!parroquia && !sector}
          size="large"
          fullWidth
        >
          realizar análisis
        </Button>

        <FormControl>
          <Typography align="center">
            <strong> Capas de control</strong>
          </Typography>
          <FormControlLabel
            label="Todas capas"
            control={
              <Checkbox
                checked={controlCheck[0] && controlCheck[1]}
                indeterminate={controlCheck[0] !== controlCheck[1]}
                onChange={handleChange3}
              />
            }
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={`Sector ${sector}`}
            // value={controlCheck[0]}
            onChange={handleChange1}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={`Predio ${clave}`}
            //value={controlCheck[1]}
            onChange={handleChange2}
          />
        </FormControl>
        <FormControl>
          <Typography align="center">
            <strong> Capas de Análisis</strong>
          </Typography>
          <RadioGroup value={selectedDataType} onChange={handleDataTypeChange}>
            <FormControlLabel
              value="aptconst"
              control={<Radio />}
              label="Aptitud Constructiva"
            />
            <FormControlLabel
              value="pugs"
              control={<Radio />}
              label="Uso de suelo (PIT)"
            />
            <FormControlLabel
              value="vialidad"
              control={<Radio />}
              label="Vialidad"
            />
            <FormControlLabel
              value="aapp"
              control={<Radio />}
              label="Dotación de Agua Potable"
            />
            <FormControlLabel
              value="aass"
              control={<Radio />}
              label="Alcantarillado"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      )}
      {/* Información de búsqueda */}
    </Box>
  );
};

export default GeoDataViewer;
