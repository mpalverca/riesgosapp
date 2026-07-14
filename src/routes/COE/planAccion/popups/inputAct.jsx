import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  MenuItem,
  RadioGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { usePlanA } from "../script";

export const DialogAccion = ({
  open,
  onClose,
  mtt,
  coordinates: dialogCoords,
  ...props
}) => {
  const getUbiString = () => {
    if (
      !dialogCoords ||
      dialogCoords.lat === undefined ||
      dialogCoords.lng === undefined
    ) {
      return ""; // O algún valor por defecto
    }
    return `[${dialogCoords.lat}, ${dialogCoords.lng}]`;
  };
  const handleClose = () => {
    onClose();
  };


  const [fixData, setFixData] = useState({
    by: props.member,
    mtt:mtt,
    ubi: getUbiString(),
    provincia: "Loja",
    canton: "Loja_",
    sector: "",
    desc: "",
    accion: "",
    cash: "",
    Jun: false,
    Jul: false,
    Ago: false,
    Sept: false,
    Oct: false,
    Nov: false,
    Dic: false,
    detail: "",
    verificable:"",
    tipe: "point"

  });


  const {post}= usePlanA()

  // Verificar coordenadas antes de usarlas
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFixData((prev) => ({ ...prev, [name]: value }));
  };
  const renderField = (
    name,
    label,
    type = "text",
    options = [],
    props = {},
  ) => (
    <TextField
      name={name}
      label={label}
      type={type}
      value={fixData[name] || ""}
      onChange={handleChange}
      select={type === "select"}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 5 : undefined}
      fullWidth
      disabled={name === "by" || name === "ubi"}
      {...props}
    >
      {type === "select" &&
        options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
    </TextField>
  );
  const transformDataToOptions = (rawData) => {
    // Verificamos que sea un array válido
    if (!rawData || !Array.isArray(rawData)) {
      return [{ value: "", label: "Seleccione" }];
    }

    const options = rawData.map((item, index) => {
      // Creamos el label: "sector - event"
      const label = `${index}-${item.sector} - ${item.event}`;

      // Creamos el value: "sector+event.date"
      // Usamos replace para quitar espacios si prefieres un value más limpio
      //const value = `${item.sector}+${item.event}.${item.date_event}`.replace(/\s+/g, '_');

      return {
        value: item.row,
        label: label,
      };
    });

    // Agregamos la opción por defecto al inicio
    return [{ value: "", label: "Seleccione" }, ...options];
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Ingrese Acciones A realizar - {mtt}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Latitud: {dialogCoords?.lat}, Longitud: {dialogCoords?.lng}
          </DialogContentText>
          <Paper elevation={3} sx={{ p: 1, mt: 1 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Información General
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                   <Grid item size={{ xs: 12 }}>
                    {renderField("tipe", "Tipo", "select", [
                      { value: "Conoc_Monit", label: "Conocimiento y Monitoreo" },
                      { value: "prev_mit", label: "Prevención y Mitigación" },
                      { value: "prep", label: "Preparación" },
                      {value: "resp", label: "Respuesta" },
                      {value: "recup", label: "Recuperación" }
                    ])}
                  </Grid>   
                  <Grid item size={{ xs: 12 }}>
                    {renderField("accion", "Acción", "text")}
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    {renderField("sector", "Sector", "text")}
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    {renderField("cash", "Presupuesto", "text")}
                  </Grid>
                  <Grid item size={{ xs: 12 }}>
                    {renderField("desc", "Descripción", "textarea")}
                  </Grid>
                  <Grid item size={{ xs: 12 }}>
                    {renderField("detail", "Detalles", "textarea")}
                  </Grid>
                   <Grid item size={{ xs: 12 }}>
                    {renderField("verificable", "Verificable", "select", [
                      { value: "si", label: "Sí" },
                      { value: "no", label: "No" }
                    ])}
                  </Grid>                  
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: "bold" }}>
                    Tiempo de ejecución (Meses)
                </Typography>
                <RadioGroup>
                    
                </RadioGroup>
              </Box>
            </LocalizationProvider>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              post(fixData.tipe,fixData)
            }}
          >
            Añadir
          </Button>
          <Button onClick={handleClose} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
