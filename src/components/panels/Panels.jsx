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

export default function Panels({title, body, ...props}) {
 
  const n_color = {
    ALTA: "#dc3545",
    MEDIA: "#ffc107",
    BAJA: "#28a745",
    DEFAULT: "#007bff",
  };
  
  // Obtener las acciones según el nivel de alerta

  return (
    <div>
      <Typography variant="h4" align="center">
        <strong>{title}</strong>
      </Typography>
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fff3cd",
          borderLeft: "5px solid rgb(18, 14, 238)",
          borderRadius: "4px",
          color: "#856404",
          margin: "2px 0",
        }}
      >
        <Typography align="justify" variant="body2">
          ⚠️ <strong>Advertencia:</strong> La información presentada es de
          manera referencial y deberá asumirse con el mayor cuidado y
          responsabilidad ya que la divulgación inadecuada de la misma está
          sujeta a acciones y sanciones contempladas en la LOGIRD.
        </Typography>
      </div>
      <Divider sx={{mt:2}}/>
      {body}
    </div>
  );
}


export const AlertText=({text})=>{
  return  <div
        style={{
          padding: "10px",
          backgroundColor: "#fff3cd",
          borderLeft: "5px solid rgb(18, 14, 238)",
          borderRadius: "4px",
          color: "#856404",
          margin: "2px 0",
        }}
      >
        <Typography align="justify" variant="body2">
          {text}
        </Typography>
      </div>
}