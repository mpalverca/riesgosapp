import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  //IconButton,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  People as PeopleIcon,
  ExitToApp as ExitIcon,
  Build as BuildIcon,
  LocalFireDepartment as FireIcon,
} from "@mui/icons-material";

export default function Cronograma() {
  const [cronograma, setCronograma] = useState([
    {
      id: 1,
      fase: "Montaje -- Preparación",
      fecha: "24/10/2025",
      horaInicio: "18h00",
      horaFin: "24H00",
      observaciones: "",
    },
    {
      id: 2,
      fase: "Ingreso de Público",
      fecha: "25/10/2025",
      horaInicio: "10h00",
      horaFin: "23H30",
      observaciones:
        "Se tendrá la recepción del publico durante todo el evento",
    },
    {
      id: 3,
      fase: "Presentaciones",
      fecha: "25/10/2025",
      horaInicio: "17h00",
      horaFin: "23H00",
      observaciones: "",
    },
    {
      id: 4,
      fase: "Salida de Público",
      fecha: "25/10/2025",
      horaInicio: "23h30",
      horaFin: "24H00",
      observaciones: "",
    },
    {
      id: 5,
      fase: "Reacondicionamiento del área",
      fecha: "26/10/2025",
      horaInicio: "00h00",
      horaFin: "01H00",
      observaciones: "Se realizar el desmontaje de la tarima o escenario",
    },
  ]);

  const [pirotecnia, setPirotecnia] = useState({
    instalacion: { fecha: "", horaInicio: "", horaFin: "", observaciones: "" },
    activacion: { fecha: "", horaInicio: "", horaFin: "", observaciones: "" },
  });

  const handleCronogramaChange = (id, field, value) => {
    setCronograma((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handlePirotecniaChange = (tipo, field, value) => {
    setPirotecnia((prev) => ({
      ...prev,
      [tipo]: {
        ...prev[tipo],
        [field]: value,
      },
    }));
  };

  const addNuevaFase = () => {
    setCronograma((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        fase: "",
        fecha: "",
        horaInicio: "",
        horaFin: "",
        observaciones: "",
      },
    ]);
  };

  const getFaseIcon = (fase) => {
    if (fase.includes("Montaje")) return <BuildIcon color="primary" />;
    if (fase.includes("Ingreso")) return <PeopleIcon color="success" />;
    if (fase.includes("Presentaciones")) return <EventIcon color="secondary" />;
    if (fase.includes("Salida")) return <ExitIcon color="info" />;
    if (fase.includes("Reacondicionamiento"))
      return <BuildIcon color="action" />;
    return <ScheduleIcon />;
  };

  return (
    <Box sx={{ p: 3, margin: "auto" }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ScheduleIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Cronograma del Evento
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell width="10%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Icono
                  </Typography>
                </TableCell>
                <TableCell width="20%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Fase
                  </Typography>
                </TableCell>
                <TableCell width="15%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Fecha
                  </Typography>
                </TableCell>
                <TableCell width="15%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Hora Inicio
                  </Typography>
                </TableCell>
                <TableCell width="15%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Hora Fin
                  </Typography>
                </TableCell>
                <TableCell width="25%" align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Observaciones
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cronograma.map((fase) => (
                <TableRow key={fase.id} hover>
                  <TableCell align="center">{getFaseIcon(fase.fase)}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={fase.fase}
                      onChange={(e) =>
                        handleCronogramaChange(fase.id, "fase", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={fase.fecha}
                      onChange={(e) =>
                        handleCronogramaChange(fase.id, "fecha", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                      value={fase.horaInicio}
                      onChange={(e) =>
                        handleCronogramaChange(
                          fase.id,
                          "horaInicio",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                      value={fase.horaFin}
                      onChange={(e) =>
                        handleCronogramaChange(
                          fase.id,
                          "horaFin",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      value={fase.observaciones}
                      onChange={(e) =>
                        handleCronogramaChange(
                          fase.id,
                          "observaciones",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addNuevaFase}
          >
            Agregar Fase
          </Button>
        </Box>
      </Paper>

      {/* Sección de Pirotecnia */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FireIcon color="warning" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6" component="h3">
            Uso de Pirotecnia (debe ser autorizada por la Autoridad competente)
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, md: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Instalación de Pirotecnia
            </Typography>
            <Grid container spacing={2}>
              <Grid item  size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={pirotecnia.instalacion.fecha}
                  onChange={(e) =>
                    handlePirotecniaChange(
                      "instalacion",
                      "fecha",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Hora Inicio"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={pirotecnia.instalacion.horaInicio}
                  onChange={(e) =>
                    handlePirotecniaChange(
                      "instalacion",
                      "horaInicio",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Hora Fin"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={pirotecnia.instalacion.horaFin}
                  onChange={(e) =>
                    handlePirotecniaChange(
                      "instalacion",
                      "horaFin",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Observaciones"
                  multiline
                  rows={2}
                  value={pirotecnia.instalacion.observaciones}
                  onChange={(e) =>
                    handlePirotecniaChange(
                      "instalacion",
                      "observaciones",
                      e.target.value
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item  size={{ xs: 12, md: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Activación de Pirotecnia
            </Typography>
            <Grid container spacing={2}>
              <Grid item  size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={pirotecnia.activacion.fecha}
                  onChange={(e) =>
                    handlePirotecniaChange(
                      "activacion",
                      "fecha",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item  size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Hora Inicio"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={pirotecnia.activacion.horaInicio}
                  onChange={(e) =>
                    handlePirotecniaChange(
                      "activacion",
                      "horaInicio",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item  size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Hora Fin"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={pirotecnia.activacion.horaFin}
                  onChange={(e) =>
                    handlePirotecniaChange(
                      "activacion",
                      "horaFin",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item  size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Observaciones"
                  multiline
                  rows={2}
                  value={pirotecnia.activacion.observaciones}
                  onChange={(e) =>
                    handlePirotecniaChange(
                      "activacion",
                      "observaciones",
                      e.target.value
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Chip
            label="Pirotecnia requiere autorización especial"
            color="warning"
            variant="outlined"
          />
        </Box>
      </Paper>
    </Box>
  );
}
