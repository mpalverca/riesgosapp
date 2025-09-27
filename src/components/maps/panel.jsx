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
  const n_color = {
    ALTA: "#dc3545",
    MEDIA: "#ffc107",
    BAJA: "#28a745",
    DEFAULT: "#007bff",
  };
  const nAlert = {
    Alta: [
      "•	No realices quemas de ningún tipo.",
      "•	Activa la vigilancia comunitaria en tu sector.",
      "•	Informa a vecinos y comunidad sobre la alerta vigente.",
      "•	Facilita el ingreso de bomberos y brigadas comunitarias en caso de incendio",
      "•	Reporta de inmediato al ECU 911 cualquier foco de calor, humo o actividad sospechosa.",
    ],
    Media: [
      "•	Máxima precaución al usar fuego.",
      "•	Realiza quemas solo con acompañamiento técnico (bomberos o brigadas comunitarias).",
      "•	Coordina con tu Junta Parroquial, Distrito Municipal y/o Tenencia Política.",
      "•	Obtén siempre los permisos de quema.",
      "•	Prepara la parcela y respeta los horarios autorizados para realizar la quema.",
      "•	Vigila durante y después de la quema, hasta confirmar que no queden brasas encendidas.",
    ],
    Baja: [
      "•	Prepara adecuadamente tu parcela antes de cualquier quema.",
      "•	Solicita los permisos correspondientes a las autoridades.",
      "•	Vigila durante y después de la quema.",
      "•	Mantén limpios los alrededores de tu vivienda y terrenos.",
      "•	Reporta al ECU 911 o a tu GAD parroquial cualquier actividad sospechosa.",
    ],
  };
  // Obtener las acciones según el nivel de alerta
  const getAlertActions = () => {
    if (!props.data?.n_alert) return [];

    return props.data.n_alert === "Alto"
      ? nAlert.Alta
      : props.data.n_alert === "Medio"
      ? nAlert.Media
      : nAlert.Baja;
  };

  const alertActions = getAlertActions();
  
    // Dividir los eventos por puntos y crear array de líneas
  const getEventLines = () => {
    if (!props.data?.event_reg) return [];
    
    // Dividir por puntos y limpiar espacios en blanco
    return props.data.event_reg
      .split('.')
      .map(event => event.trim())
      .filter(event => event.length > 0);
  };

  const eventLines = getEventLines();


  return (
    <div>
      <Typography variant="h4"align="center" >
        <strong>{props.title}</strong>
      </Typography>
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fff3cd",
          borderLeft: "5px solid #020202ff",
          borderRadius: "4px",
          color: "#856404",
          margin: "2px 0",
        }}
      >
        <Typography align="justify">
          ⚠️ <strong>Advertencia:</strong> La información presentada es de
          manera referencial y deberá asumirse con el mayor cuidado y
          responsabilidad ya que la divulgación inadecuada de la misma está
          sujeta a acciones y sanciones contempladas en la LOGIRD.
        </Typography>
      </div>
      <Divider />
      {props.data && (
        <div>
          <Typography variant="h4" align="center">
            Parroquia <strong>{props.data.DPA_DESPAR}</strong>
          </Typography>

          <Typography
            variant="h4"
            align="center"
            color={
              props.data.n_alert == "Alto"
                ? n_color.ALTA
                : props.data.n_alert == "Medio"
                ? n_color.MEDIA
                : n_color.BAJA
            }
          >
            Nivel de Alerta <strong>{props.data.n_alert}</strong>
          </Typography>
          <Typography variant="h6" align="center">
            {props.data.date_init} - {props.data.date_end}
          </Typography>
          <Divider />

          {/* Acciones a desarrollar */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Acciones a desarrollar
            </Typography>
            <Box sx={{pl:2}}>
              {alertActions.map((action, index) => (
                  <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                    {action}
                  </Typography>
              ))}
            </Box>
            <Divider sx={{ mt: 1 }} />
          </Box>
          <Divider />
          {/* Eventos Relacionados */}
          <Box >
            <Typography variant="h5" gutterBottom>
              Eventos Relacionados
            </Typography>
           <Box>
              {eventLines.map((event, index) => (
                <Typography 
                  key={index} 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.5,
                   pl:2,
                    backgroundColor: index % 2 === 0 ? 'grey.50' : 'transparent',
                    borderRadius: 1
                  }}
                >
                  • {event.trim()}.
                </Typography>
              ))}
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
}
