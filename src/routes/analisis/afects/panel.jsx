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
  filters,
  cantAfects,
  setFilters,
  handleAfect,
}) {
  const [form, setForm] = useState({ latitud: "", longitud: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addbar(form.latitud, form.longitud);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      {/* <Typography variant="h5" align="center" alignContent="center">
        <strong>Visor Territorial de Afectaciones</strong>
        <IconButton onClick={() => setSidebarOpen(false)} size="small">
                <ChevronLeftIcon />
              </IconButton>
      </Typography> */}

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
          //margin="normal"
          size="small"
        />
        <TextField
          sx={{ my: 1 }}
          fullWidth
          type="number"
          name="longitud"
          label="Longitud"
          value={form.longitud}
          onChange={handleChange}
          placeholder="Ej: -79.20422"
          variant="outlined"
          // margin="normal"
          size="small"
        />
        <Button
          id="search-btn"
          variant="contained"
          type="submit"
          style={{
            background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
            mt: "10px",
            py: 1,
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
        <strong>Afectaciones Encontradas:</strong>
        {cantAfects}
      </Typography>
      <Divider />
      <FormControl fullWidth margin="normal">
        <InputLabel id="priority-label">Prioridad</InputLabel>
        <Select
          labelId="priority-label"
          id="priority-select"
          label="Prioridad"
          name="prioridad"
          value={filters.prioridad}
          onChange={handleFilterChange}
          size="small"
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
          value={filters.estado}
          name="estado"
          label="Estado"
          onChange={handleFilterChange}
          size="small"
        >
          <MenuItem value="Pendiente">Pendiente</MenuItem>
          <MenuItem value="Atendido">Atendido</MenuItem>
          <MenuItem value="Todos">Todos</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="event-label">Evento</InputLabel>
        <Select
          labelId="event-label"
          id="event-select"
          value={filters.event}
          name="event"
          label="Evento"
          onChange={handleFilterChange}
          size="small"
        >
          <MenuItem value="Inundación">Inundación</MenuItem>
          <MenuItem value="Movimiento en masa">Movimiento en masa</MenuItem>          
          <MenuItem value="Incendio Estructural">Incendio Estructural</MenuItem>          
          <MenuItem value="Colapso Estructural">Colapso Estructural</MenuItem>                 
          <MenuItem value="Época Lluviosa">Época Lluviosa</MenuItem>                        
          <MenuItem value="Maxima Precipitación">Maxima Precipitación</MenuItem>
          <MenuItem value="Todos">Todos</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="afect-label">afectacion</InputLabel>
        <Select
          labelId="afect-label"
          id="afect-select"
          value={filters.afect}
          name="afect"
          label="Afectación"
          onChange={handleFilterChange}
          size="small"
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
          value={filters.parroq}
          name="parroq"
          label="Parroquia"
          onChange={handleFilterChange}
          size="small"
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
          <MenuItem value="San sebastián">
            San Sebastián
          </MenuItem>
          <MenuItem value="Sucre">Sucre</MenuItem>
          <MenuItem value="Taquil">Taquil</MenuItem>
          <MenuItem value="Quinara">Quinara</MenuItem>
          <MenuItem value="El Valle"> El Valle</MenuItem>
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
          value={filters.atiende}
          name="atiende"
          label="Parroquia"
          onChange={handleFilterChange}
          size="small"
        >
          <MenuItem value="CBL">CBL-Bomberos</MenuItem>
          <MenuItem value="Comisarias">Comisarías</MenuItem>
          <MenuItem value="Gestión Ambiental">Gestión Ambiental</MenuItem>
          <MenuItem value="Gestión de Riesgos">Gestión de Riesgos</MenuItem>
          <MenuItem value="Higiene">Higiene</MenuItem>
          <MenuItem value="Obras Públicas">Obras Públicas</MenuItem>
          <MenuItem value="Umapal">UMAPAL</MenuItem>
          <MenuItem value="Seguridad">Seguridad Ciudadana</MenuItem>
          <MenuItem value="Todos">Todos</MenuItem>
        </Select>
      </FormControl>

      <Button fullWidth variant="contained" onClick={handleAfect}>
        Buscaf Afectaciones
      </Button>
    </div>
  );
}
