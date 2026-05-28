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
  Chip,
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
    props.comiteInfo.data.length === 0 ||
    !props.getBrigada.dataC.data ||
    props.getBrigada.dataC.data.length === 0
  ) {
    return null; // o muestra un mensaje de carga
  }
  const comiteData = props.comiteInfo.data[0];
  console.log("comiteData", comiteData)
  console.log("brigada", props.getBrigada.dataC.data)
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
        {props.getBrigada.dataC.data &&
        props.getBrigada.dataC.data.length > 0 ?  <CompactBrigadaTable
        data={props.getBrigada.dataC.data}
        title="Información detallada de brigada"
        />
         : 
          <Typography variant="body2">
            No hay datos de brigada disponibles.
          </Typography>
        }
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


export const CustomizableBrigadaTable = ({ data, columns, title }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body1" color="textSecondary">
          No hay datos disponibles
        </Typography>
      </Box>
    );
  }

  // Columnas por defecto
  const defaultColumns = [
    { field: "nombre", label: "Nombre", align: "left" },
    { field: "ci", label: "CI", align: "left" },
    { field: "brigada", label: "Brigada", align: "left" },
    { field: "comite", label: "Comité", align: "left" },
    { field: "rango", label: "Rango", align: "left" },
    { field: "estado", label: "Estado", align: "left" },
    { field: "equipo", label: "Equipamiento", align: "left" },
    { field: "row", label: "Fila", align: "center" },
  ];

  const usedColumns = columns || defaultColumns;

  return (
    <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
      {title && (
        <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
          {title}
        </Typography>
      )}
      <Table sx={{ minWidth: 650 }} aria-label="customized table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            {usedColumns.map((col) => (
              <TableCell 
                key={col.field} 
                align={col.align || "left"}
                sx={{ fontWeight: "bold" }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.ci || index}>
              {usedColumns.map((col) => (
                <TableCell key={col.field} align={col.align || "left"}>
                  {col.render ? col.render(item[col.field], item) : item[col.field] || "N/A"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Componente compacto para espacios reducidos
export const CompactBrigadaTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="compact table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Nombre</strong></TableCell>
            <TableCell><strong>Brigada</strong></TableCell>
            <TableCell><strong>Rango</strong></TableCell>            
            <TableCell><strong>Equipo</strong></TableCell>
            <TableCell><strong>Estado</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.ci || index}>
              <TableCell>{item.nombre || "N/A"}</TableCell>
              <TableCell>{item.brigada || "N/A"}</TableCell>
              <TableCell>{item.rango || "N/A"}</TableCell>
              <TableCell>{item.equipo || "N/A"}</TableCell>
              <TableCell>
                <Chip
                  label={item.estado || "N/A"} 
                  size="small"
                  color={item.estado === "activo" ? "success" : "default"}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}