import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

// Componente principal
const ComiteInfo = ({ comiteInfo, getBrigada }) => {
  // Validación temprana con optional chaining
  const comiteData = comiteInfo?.data?.[0];
  const brigadaData = getBrigada?.dataC?.data;

  if (!comiteData) return null;

  const puntos = [
    { punto: "Puerta principal", id: "P001", tipo: "Evacuación", estado: { by: "Juan", state: "Activo" }, descp: "Revisión de ingreso de personal" },
    { punto: "Almacén", id: "P002", tipo: "control", estado: { by: "Ana", state: "Pendiente" }, descp: "Verificar insumos y cámaras" },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography align="center" variant="h6">
        <strong>Ley orgánica de Gestión integral de riesgos de desastres</strong>
      </Typography>
      <Typography align="center" variant="h6">
        <strong>Art. 39.- Comités comunitarios de gestión de riesgos y participación ciudadana</strong>
      </Typography>
      <Typography align="justify" variant="body2" sx={{ mb: 2 }}>
        Se promoverá la participación ciudadana en gestión de riesgos a través de comités comunitarios de gestión de riesgos. 
        Estos comités son instancias creadas para la gestión integral de riesgos de desastres de conformidad con los lineamientos 
        para su reconocimiento, conformación y funcionamiento expedidos por el ente rector de la gestión integral del riesgo de desastres.
      </Typography>

      <Typography variant="h5" gutterBottom>Información del comité - {comiteData.comite}</Typography>
      <Typography variant="h6" gutterBottom>Miembros del comité</Typography>
      <Typography variant="h6" gutterBottom>Estado: {comiteData.Estado} - Fase: {comiteData.Fase}</Typography>

      <SimpleComiteTable comiteData={comiteData} />

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Datos de brigada</Typography>
        {brigadaData?.length ? 
          <CompactBrigadaTable data={brigadaData} /> : 
          <Typography variant="body2">No hay datos de brigada disponibles.</Typography>
        }
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Puntos de control / atención</Typography>
        {puntos.map((item) => (
          <Box key={item.id} sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">{item.punto}</Typography>
            <List dense>
              <ListItem><ListItemText primary="ID" secondary={item.id} /></ListItem>
              <ListItem><ListItemText primary="Tipo" secondary={item.tipo} /></ListItem>
              <ListItem><ListItemText primary="Estado" secondary={`${item.estado.by} - ${item.estado.state}`} /></ListItem>
              <ListItem><ListItemText primary="Descripción" secondary={item.descp} /></ListItem>
            </List>
            <Divider />
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

// Tabla de roles del comité
const SimpleComiteTable = ({ comiteData }) => {
  if (!comiteData) return null;

  const parseData = (str) => {
    if (!str) return { nombre: "N/A", telefono: "N/A" };
    return {
      nombre: str.match(/responsable=([^,]+)/i)?.[1]?.trim() || "N/A",
      telefono: str.match(/telf=\s*([^,]+)/i)?.[1]?.trim() || "N/A",
    };
  };

  const rows = [
    { rol: "Responsable", ...parseData(comiteData.responsable) },
    { rol: "Secretario/a", ...parseData(comiteData.secretario) },
    { rol: "Líder de Brigada", ...parseData(comiteData.lider_brigada) },
  ];

  return (
    <TableContainer component={Paper} sx={{ m: 2, width: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>Rol</strong></TableCell>
            <TableCell><strong>Nombre</strong></TableCell>
            <TableCell><strong>Teléfono</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.rol}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.telefono}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Tabla compacta de brigada
const CompactBrigadaTable = ({ data }) => {
  if (!data?.length) return null;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            {["Nombre", "Brigada", "Rango", "Equipo", "Estado"].map((h) => (
              <TableCell key={h}><strong>{h}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={item.ci || idx}>
              <TableCell>{item.nombre || "N/A"}</TableCell>
              <TableCell>{item.brigada || "N/A"}</TableCell>
              <TableCell>{item.rango || "N/A"}</TableCell>
              <TableCell>{item.equipo || "N/A"}</TableCell>
              <TableCell>
                <Chip label={item.estado || "N/A"} size="small" color={item.estado === "activo" ? "success" : "default"} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComiteInfo;