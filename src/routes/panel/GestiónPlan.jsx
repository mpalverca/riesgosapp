import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useGetEvent } from "./script";
import { parseByField } from "../utils/utils";

export const GestionPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { read, dataEv, loadingEv, errorEv, message, success, clearGet } =
    useGetEvent();
  const [eventos, setEventos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetName] = useState("Plan");

  const handleItemClick = (tramite) => {
    console.log("Tramite seleccionado:", tramite);
    const basePath = location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname;
    if (tramite) {
      navigate(`${basePath}/${tramite}`);
    }
  };

  // Cargar eventos al montar el componente
  useEffect(() => {
    const searchMember = async () => {
      await read(sheetName);
    };
  }, []);

  // Actualizar eventos cuando dataGet cambia
  useEffect(() => {
    if (dataEv && Array.isArray(dataEv)) {
      setEventos(dataEv);
    }
  }, [dataEv]);

  // Filtrar eventos por estado y búsqueda
  const eventosFiltrados = eventos.filter((evento) => {
    const cumpleFiltroEstado =
      filtroEstado === "todos" || evento.estado === filtroEstado;
    const cumpleSearchTerm =
      searchTerm === "" ||
      evento.id_organizador?.toString().includes(searchTerm) ||
      evento.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    return cumpleFiltroEstado && cumpleSearchTerm;
  });

  const getColorEstado = (estado) => {
    switch (estado) {
      case "pendiente":
        return "warning";
      case "realizado":
        return "success";
      default:
        return "default";
    }
  };

  const handleRecargar = () => {
    clearGet();
    read(sheetName);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gestión de Eventos
      </Typography>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              label="Estado"
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="pendiente">Pendientes</MenuItem>
              <MenuItem value="realizado">Realizados</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            placeholder="Buscar por ID del organizador o por tramite"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            variant="outlined"
          />

          <Button
            variant="contained"
            onClick={handleRecargar}
            disabled={loadingEv}
          >
            {loadingEv ? <CircularProgress size={24} /> : "Recargar"}
          </Button>
        </Stack>
      </Paper>

      {/* Errores */}
      {errorEv && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorEv}
        </Alert>
      )}

      {/* Loading */}
      {loadingEv && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Lista de eventos */}
      {!loadingEv && eventosFiltrados.length > 0 ? (
        <List component={Paper}>
          {eventosFiltrados.map((ev, index) => {
            const lugar = parseByField(ev.lugar);
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleItemClick(ev.tramite)}>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {ev.name_e} - {lugar.tipe}, - {lugar.place} -
                          {ev.tramite == null ? "No definido" : ev.tramite}
                        </Typography>
                        <Chip
                          label={ev.estado}
                          size="small"
                          color={getColorEstado(ev.estado)}
                          variant="outlined"
                        />
                      </Stack>
                    }
                    secondary={
                      <Stack spacing={0.5} sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Lugar:</strong>
                          {lugar.ubi}, {lugar.bar}, {lugar.parroq},
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Organizador:</strong> {ev.orgz}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>ID Organizador:</strong> {ev.id_orgz}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      ) : (
        !loadingEv && <Alert severity="info">No se encontraron eventos</Alert>
      )}
    </Container>
  );
};
