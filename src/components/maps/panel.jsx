import { useEffect, useState } from "react";
import { Typography, Divider,Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled component para los items de la lista
const AlertItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const BulletPoint = styled(Box)(({ theme }) => ({
  minWidth: '24px',
  height: '24px',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  marginRight: theme.spacing(1.5),
  marginTop: '2px',
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
  return (
    <div>
      <Typography variant="h5">
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
          <Typography variant="h5">
            Parroquia <strong>{props.data.DPA_DESPAR}</strong>
          </Typography>
          <Divider />
          <Typography
            variant="h5"
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
          <Divider />
          <Typography variant="h5">Acciones a desarrollar</Typography>
          {/* Acciones a desarrollar */}
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Acciones a desarrollar
            </Typography>
            <Box >
              {alertActions.map((action, index) => (
                <AlertItem key={index}>
                  <BulletPoint>•</BulletPoint>
                  <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                    {action}
                  </Typography>
                </AlertItem>
              ))}
            </Box>
            <Divider sx={{ mt: 1 }} />
          </Box>
          <Divider />
          <Typography variant="h5">eventos Relacionados</Typography>
          {props.data.event_reg}
        </div>
      )}
    </div>
  );
}
