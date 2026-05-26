import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
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
} from "@mui/material";

const ComiteInfo = ({ comite, ...props }) => {
  const brigada = [
    {
      nombre: "Juan Pérez",
      brigada: "Primeros Auxilios",
      insumos: ["Botiquín", "Extintor"],
      rango: "Miembro",
      ci: 1234567890,
    },
    {
      nombre: "Ana López",
      brigada: "Primeros Auxilios",
      insumos: ["Botiquín", "Extintor"],
      rango: "Miembro",
      ci: 1234567890,
    },
    {
      nombre: "Carlos Gómez",
      brigada: "Primeros Auxilios",
      insumos: ["Botiquín", "Extintor"],
      rango: "Miembro",
      ci: 1234567890,
    },
  ];

  const puntos = [
    {
      punto: "Puerta principal",
      coords: [-3.4543, -79.3432],
      id: "P001",
      tipo: "Evacuación",
      estado: { by: "Juan", state: "Activo" },
      foto_anex: "foto1.jpg",
      descp: "Revisión de ingreso de personal",
    },
    {
      punto: "Almacén",
      coords: [-3.4543, -79.3432],
      id: "P002",
      tipo: "control",
      estado: { by: "Ana", state: "Pendiente" },
      foto_anex: "foto2.jpg",
      descp: "Verificar insumos y cámaras",
    },
  ];

  if (
    !props.comiteInfo.data[0] ||
    !props.comiteInfo.data ||
    props.comiteInfo.data.length === 0
  ) {
    return null; // o muestra un mensaje de carga
  }
  const comiteData = props.comiteInfo.data[0];
  return (
    <Box sx={{ p: 2 }}>
      <Typography align="center" variant="h6">
        <strong>
          Ley organica de Gestión integral de riesgos de desastres
        </strong>
      </Typography>
      <Typography align="center" variant="h6">
        <strong>
          Art. 39.-Comités comunitarios de gestión de riesgos y participación
          ciudadana
        </strong>
      </Typography>
      <Typography align="justify" variant="body2">
        Se promoverá la participación ciudadana en gestión de riesgos a través
        de comités comunitarios de gestión de riesgos. Estos comités son
        instancias creadas para la gestión integral de riesgos de desastres de
        conformidad con los lineamientos para su reconocimiento, conformación y
        funcionamiento expedidos por el ente rector de la gestión integral del
        riesgo de desastres. Los procesos de reconocimiento legal, conformación,
        capacitación y fortalecimiento de los comités locales de gestión de
        riesgos son responsabilidad de los gobiernos autónomos descentralizados
        municipales en el ámbito urbano y de los gobiernos autónomos
        descentralizados provinciales en el ámbito rural, los que informarán, de
        manera anual sobre el avance de este proceso al ente rector, de
        conformidad con el instructivo que se expida para el efecto.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Información del comité - {comiteData.comite}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Miembros del comité
      </Typography>
      <Typography variant="h5" gutterBottom>
       Estado: {comiteData.Estado } - Fase {comiteData.Fase}
      </Typography>
     <SimpleComiteTable comiteData={comiteData} /> 
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Datos de brigada
        </Typography>
        {Array.isArray(props.getBrigada.data) &&
        props.getBrigada.data.length > 0 ? (
          props.getBrigada.data.map((brigadaItem) => (
            <Box key={brigadaItem.ci} sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold">
                {brigadaItem.nombre || "Nombre no disponible"}
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="CI"
                    secondary={brigadaItem.ci || "N/A"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Brigada"
                    secondary={brigadaItem.brigada || "N/A"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Rango"
                    secondary={brigadaItem.rango || "N/A"}
                  />
                </ListItem>
              </List>
              <Divider />
            </Box>
          ))
        ) : (
          <Typography variant="body2">
            No hay datos de brigada disponibles.
          </Typography>
        )}
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Puntos de control / atención
        </Typography>
        {Array.isArray(puntos) && puntos.length ? (
          puntos.map((puntoItem) => (
            <Box key={puntoItem.id} sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold">
                {puntoItem.punto || "Punto sin nombre"}
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="ID"
                    secondary={puntoItem.id || "N/A"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tipo"
                    secondary={puntoItem.tipo || "N/A"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Estado"
                    secondary={
                      puntoItem.estado
                        ? `${puntoItem.estado.by || "Sin responsable"} - ${puntoItem.estado.state || "Sin estado"}`
                        : "Sin estado"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Foto anexada"
                    secondary={puntoItem.foto_anex || "No aplica"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Descripción"
                    secondary={puntoItem.descp || "Sin descripción"}
                  />
                </ListItem>
              </List>
              <Divider />
            </Box>
          ))
        ) : (
          <Typography variant="body2">
            No hay puntos de control disponibles.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

ComiteInfo.defaultProps = {
  comite: {
    nombre: "Ejemplo Brigada",
    ci: "1234567890",
    rango: "Líder",
  },
};

export default ComiteInfo;

const SimpleComiteTable = ({ comiteData }) => {
  if (!comiteData) return null;
console.log(comiteData)
  const parseData = (str) => {
    if (!str) return { nombre: "N/A", ci: "N/A", telefono: "N/A" };
    const nombre = str.match(/responsable=([^,]+)/i)?.[1]?.trim() || "N/A";
    const ci = str.match(/ci=\s*([^,]+)/i)?.[1]?.trim() || "N/A";
    const telefono = str.match(/telf=\s*([^,]+)/i)?.[1]?.trim() || "N/A";
    return { nombre, ci, telefono };
  };

  const rows = [
    { rol: "Responsable", ...parseData(comiteData.responsable) },
    { rol: "Secretario/a", ...parseData(comiteData.secretario) },
    { rol: "Líder de Brigada", ...parseData(comiteData.lider_brigada) },
  ];

  return (
    <TableContainer component={Paper} sx={{ m: 2 }}>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Rol</strong>
            </TableCell>
            <TableCell>
              <strong>Nombre</strong>
            </TableCell>
           {/*  <TableCell>
              <strong>CI</strong>
            </TableCell> */}
            <TableCell>
              <strong>Teléfono</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.rol}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              {/* <TableCell>{row.ci}</TableCell> */}
              <TableCell>{row.telefono}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
