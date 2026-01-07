import { useEffect, useState } from "react";
import { Typography, Divider, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled component para los items de la lista
const AlertItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const BulletPoint = styled(Box)(({ theme }) => ({
  minWidth: "24px",
  height: "24px",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
  marginRight: theme.spacing(1.5),
  marginTop: "2px",
}));

export default function Panel(props) {
  console.log(props.fireData);
  const n_color = {
    ALTA: "#dc3545",
    MEDIA: "#ffc107",
    BAJA: "#28a745",
    DEFAULT: "#007bff",
  };
  // Obtener las acciones según el nivel de alerta
 
  // Dividir los eventos por puntos y crear array de líneas
  const getEventLines = () => {
    if (!props.data?.event_reg) return [];

    // Dividir por puntos y limpiar espacios en blanco
    return props.data.event_reg
      .split(".")
      .map((event) => event.trim())
      .filter((event) => event.length > 0);
  };

  const eventLines = getEventLines();

  return (
    <div>
      <Typography variant="h4" align="center">
        <strong>{props.title}</strong>
      </Typography>
      <div
        style={{
          padding: "5px",
          backgroundColor: "#fff3cd",
          borderLeft: "7px solid #4f1cdbff",
          borderRadius: "4px",
          color: "#856404",
          margin: "2px 0",
        }}
      >
        <Typography align="justify" variant="body2">
           <strong> ⚠️ Importante:</strong> La información presentada es de
          manera referencial y deberá asumirse con el mayor cuidado y
          responsabilidad ya que la divulgación inadecuada de la misma está
          sujeta a acciones y sanciones contempladas en la LOGIRD.
        </Typography>
      </div>
      <Divider sx={{mt:"5px"}}/>
      
    </div>
  );
}
