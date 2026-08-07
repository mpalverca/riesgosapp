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
  Grid,
  Box,
  Paper,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import DomainDisabledIcon from "@mui/icons-material/DomainDisabled";
import LandscapeIcon from "@mui/icons-material/Landscape";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WaterIcon from "@mui/icons-material/Water";
import FloodIcon from "@mui/icons-material/Flood";

const items = [
  { id: 1, icon: <WhatshotIcon />, label: "Incendio forestal" },
  { id: 2, icon: <DomainDisabledIcon />, label: "Colapso Estructural" },
  { id: 3, icon: <LandscapeIcon />, label: "Deslizamiento de tierra" },
  { id: 4, icon: <WaterDropIcon />, label: "Sequía" },
  { id: 5, icon: <WaterIcon />, label: "Erosión (Hídrica)" },
  { id: 6, icon: <FloodIcon />, label: "Inundación " },
];
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
      <Paper elevation={3} sx={{ p: 2, mt: 2, mb: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>Detalle de afectación</Typography>
        <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item size={{ xs: 12, }} key={item.id}>
            <Paper elevation={2} sx={{ px: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ color: "primary.main", fontSize: 32 }}>
                {item.icon}
              </Box>
              <Typography variant="body1">{item.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      </Paper>

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
          Erosión Hídrica
          <MenuItem value="Colapso Estructural">Colapso Estructural</MenuItem>
          <MenuItem value="Época Lluviosa">Época Lluviosa</MenuItem>
          <MenuItem value="Erosión Hídrica">Erosión Hídrica</MenuItem>
          <MenuItem value="Inundación">Inundación</MenuItem>
          <MenuItem value="Incendio Estructural">Incendio Estructural</MenuItem>
          <MenuItem value="Máxima Precipitación">Máxima Precipitación</MenuItem>
          <MenuItem value="Movimiento en masa">Movimiento en masa</MenuItem>
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
          <MenuItem value="Infraestructura">Infraestructura</MenuItem>
          <MenuItem value="Márgenes">Márgenes</MenuItem>
          <MenuItem value="Predio">Predio</MenuItem>
          <MenuItem value="Servicios de AAPP/AALL/AASS">
            Servicios básicos
          </MenuItem>
          <MenuItem value="Vialidad">Vialidad</MenuItem>
          <MenuItem value="Vivienda">Vivienda</MenuItem>
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
          <MenuItem value="Punzara">Punzara</MenuItem>
          <MenuItem value="Sagrario">Sagrario</MenuItem>
          <MenuItem value="San Lucas">San Lucas</MenuItem>
          <MenuItem value="Santiago">Santiago</MenuItem>
          <MenuItem value="San Pedro de Vilcabamba">
            San Pedro de Vilcabamba
          </MenuItem>
          <MenuItem value="San Sebastián">San Sebastián</MenuItem>
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
