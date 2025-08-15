import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";

export default function Panel({
  addbar,
  prioridad,
  selectedPriority,
  estado,
  setestado,
}) {
  const [form, setForm] = useState({ latitud: "", longitud: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePriorityChange = (e) => {
    prioridad(e.target.value);
    console.log(e.target.value);
    // Llama la función pasada por props
  };

  const handleStateChange = (e) => {
    setestado(e.target.value);
    console.log(e.target.value);
    // Llama la función pasada por props
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addbar(form.latitud, form.longitud);
  };

  return (
    <div>
      <Typography variant="h6">Visor Territorial de Afectaciones</Typography>
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fff3cd",
          borderLeft: "5px solid #020202ff",
          borderRadius: "4px",
          color: "#856404",
          margin: "2px 0",
        }}
      >
        ⚠️ <strong>Advertencia:</strong> La información presentada es de manera
        referencial y deberá asumirse con el mayor cuidado y responsabilidad ya
        que la divulgación inadecuada de la misma está sujeta a acciones y
        sanciones contempladas en la LOGIRD.
      </div>
      <Typography variant="subtitle1">Ubicación</Typography>
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
      <div
        style={{
          padding: "10px",
          borderRadius: "4px",
          margin: "2px 0",
          alignContent: "normal",
        }}
      >
        <strong>Evento Adverso:</strong> Es una situación, suceso o hecho que
        produce alteración en la Vida de las personas, de la economía, los
        sistemas sociales y el ambiente, causado por fenómenos de origen natural
        o provocado por los seres humanos (Lit. 8, art. 5 de la LOGIRD)
      </div>
      <Typography variant="subtitle1">Prioridad</Typography>
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
      <Typography variant="subtitle1">Estado</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="priority-label">Estado</InputLabel>
        <Select
          labelId="priority-label"
          id="priority-select"
          value={estado}
          label="Prioridad"
          onChange={handleStateChange}
        >
          <MenuItem value="Alta">Pendiente</MenuItem>
          <MenuItem value="Media">Atendido</MenuItem>          
          <MenuItem value="Todos">Todos</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
