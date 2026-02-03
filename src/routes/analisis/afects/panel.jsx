import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Divider,
} from "@mui/material";

export default function Panel({
  addbar,
  prioridad,
  selectedPriority,
  estado,
  setestado,
  afect,
  setAfect,
  cantAfects,
  radioafect,
  parroq,
  setParroq,
}) {
  const [form, setForm] = useState({ latitud: "", longitud: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePriorityChange = (e) => {
    prioridad(e.target.value);
    // Llama la función pasada por props
  };

  const handleStateChange = (e) => {
    setestado(e.target.value);

    // Llama la función pasada por props
  };
  const handleAfectChange = (e) => {
    setAfect(e.target.value);

    // Llama la función pasada por props
  };

  const handleParroqChange = (e) => {
    setParroq(e.target.value);

    // Llama la función pasada por props
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addbar(form.latitud, form.longitud);
  };

  return (
    <div>
      <Typography variant="h5">
        <strong>Visor Territorial de Afectaciones</strong>
      </Typography>
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fff3cd",
          borderLeft: "8px solid rgb(54, 17, 221)",
          borderRadius: "4px",
          color: "#856404",
          margin: "2px 0",
        }}
      >
        <Typography align="justify" variant="body2">
          ⚠️ <strong>Importante:</strong> La información presentada es de manera
          referencial y deberá asumirse con el mayor cuidado y responsabilidad
          ya que la divulgación inadecuada de la misma está sujeta a acciones y
          sanciones contempladas en la LOGIRD.
        </Typography>
      </div>
      <Divider />
      <Typography align="center" variant="h6">
        Ubicación
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="number"
          name="latitud"
          label="Latitud"
          value={form.latitud}
          onChange={handleChange}
          placeholder="Ej: -3.99313"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          type="number"
          name="longitud"
          label="Longitud"
          value={form.longitud}
          onChange={handleChange}
          placeholder="Ej: -79.20422"
          variant="outlined"
          margin="normal"
        />
        <Button
          id="search-btn"
          variant="contained"
          type="submit"
          style={{
            background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
            marginTop: "16px",
            padding: "10px 0",
          }}
          fullWidth
          size="large"
        >
          Buscar en Mapa
        </Button>
      </form>
      <Divider sx={{ mt: 2 }} />
      <div
        style={{
          padding: "10px",
          borderRadius: "4px",
          margin: "2px 0",
          alignContent: "normal",
        }}
      >
        <Typography align="justify" variant="body2">
          <strong>Afectación:</strong> Es una situación, suceso o hecho que
          produce alteración en la Vida de las personas, de la economía, los
          sistemas sociales y el ambiente, causado por fenómenos de origen
          natural o provocado por los seres humanos (Lit. 8, art. 5 de la
          LOGIRD)
        </Typography>
      </div>
      <Divider />
      <Typography variant="subtitle1" align="center">
        <strong>Total de afectaciones:</strong>
        {cantAfects}
      </Typography>
      <Divider />
      <Typography variant="subtitle1" align="center">
        <strong>Eventos criticos:</strong>
        {radioafect.length}
      </Typography>
      <Divider />

      <FormControl fullWidth margin="normal">
        <InputLabel id="priority-label">Prioridad</InputLabel>
        <Select
          labelId="priority-label"
          id="priority-select"
          value={selectedPriority}
          label="Prioridad"
          onChange={handlePriorityChange}
        >
          <MenuItem value="Alta">Alta</MenuItem>
          <MenuItem value="Media">Media</MenuItem>
          <MenuItem value="Baja">Baja</MenuItem>
          <MenuItem value="Todos">Todos</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="state-label">Estado</InputLabel>
        <Select
          labelId="state-label"
          id="state-select"
          value={estado}
          label="Estado"
          onChange={handleStateChange}
        >
          <MenuItem value="Pendiente">Pendiente</MenuItem>
          <MenuItem value="Atendido">Atendido</MenuItem>
          <MenuItem value="Todos">Todos</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="afect-label">afectacion</InputLabel>
        <Select
          labelId="afect-label"
          id="afect-select"
          value={afect}
          label="Afectación"
          onChange={handleAfectChange}
        >
          <MenuItem value="Equipamiento">Equipamiento</MenuItem>
          <MenuItem value="Vialidad">Vialidad</MenuItem>
          <MenuItem value="Servicios de AAPP/AALL/AASS">
            Servicios básicos
          </MenuItem>
          <MenuItem value="Vivienda">Vivienda</MenuItem>
          <MenuItem value="Infraestructura">Infraestructura</MenuItem>
          <MenuItem value="Predio">Predio</MenuItem>
          <MenuItem value="Todos">Todos</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="Parroq-label">Parroquia</InputLabel>
        <Select
          labelId="Parroq-label"
          id="Parroq-select"
          value={parroq}
          label="Parroquia"
          onChange={handleParroqChange}
        >
          <MenuItem value="Chantaco">Chantaco</MenuItem>
          <MenuItem value="Chuquiribamba">Chuquiribamba</MenuItem>
          <MenuItem value="El Cisne">El Cisne</MenuItem>
          <MenuItem value="Gualel">Gualel</MenuItem>
          <MenuItem value="Jimbilla">Jimbilla</MenuItem>
          <MenuItem value="Loja">Loja</MenuItem>
          <MenuItem value="Malacatos">Malacatos</MenuItem>
          <MenuItem value="Taquil">Sagrario</MenuItem>
          <MenuItem value="San Lucas">San Lucas</MenuItem>
          <MenuItem value="Santiago">Santiago</MenuItem>
          <MenuItem value="San Pedro de Vilcabamba">
            San Pedro de Vilcabamba
          </MenuItem>
          <MenuItem value="Sucre">Sucre</MenuItem>
          <MenuItem value="Taquil">Taquil</MenuItem>
          <MenuItem value="Quinara">Quinara</MenuItem>
          <MenuItem value="Valle">Valle</MenuItem>
          <MenuItem value="Vilcabamba">Vilcabamba</MenuItem>
          <MenuItem value="Yangana">Yangana</MenuItem>
          <MenuItem value="Todos">Todos</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="Parroq-label">Atiende</InputLabel>
        <Select
          labelId="Parroq-label"
          id="Parroq-select"
          value={parroq}
          label="Parroquia"
          onChange={handleParroqChange}
        >
          <MenuItem value="Chantaco">Obras Publicas</MenuItem>
          <MenuItem value="Chuquiribamba">UMAPAL</MenuItem>
          <MenuItem value="El Cisne">Ornato</MenuItem>
          <MenuItem value="Gualel">Gestión Ambiental</MenuItem>
          <MenuItem value="Jimbilla">Higiene</MenuItem>
          <MenuItem value="Loja">Gestión de Riesgos</MenuItem>
          <MenuItem value="Malacatos">CBL-Bomberos</MenuItem>
          <MenuItem value="Taquil">Seguridad Ciudadana</MenuItem>
          <MenuItem value="Taquil">Todos</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
