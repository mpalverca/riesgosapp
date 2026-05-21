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
} from "@mui/material";

const ComiteInfo = ({ comite }) => {
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

  const puntos=[
      {
        punto: "Puerta principal",
        coords: [-3.4543,-79.3432],
        id: "P001",
        tipo: "Evacuación",
        estado: { by: "Juan", state: "Activo" },
        foto_anex: "foto1.jpg",
        descp: "Revisión de ingreso de personal",
      },
      {
        punto: "Almacén",
        coords: [-3.4543,-79.3432],
        id: "P002",
        tipo: "control",
        estado: { by: "Ana", state: "Pendiente" },
        foto_anex: "foto2.jpg",
        descp: "Verificar insumos y cámaras",
      },
    ]

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
        Información del comité
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Datos de brigada
        </Typography>
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
