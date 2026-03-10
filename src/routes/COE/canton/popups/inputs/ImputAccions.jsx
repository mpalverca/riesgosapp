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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import MTT4Afect from "./afectMMT/mtt4";
import { useAfectaciones } from "../script_add";

export const DialogAfect = ({ open, onClose, mtt, coordinates, ...props }) => {

  const getUbiString = () => {
    if (
      !coordinates ||
      coordinates.lat === undefined ||
      coordinates.lng === undefined
    ) {
      return ""; // O algún valor por defecto
    }
    return `[${coordinates.lat}, ${coordinates.lng}]`;
  };
  const handleClose = () => {
    onClose();
  };
  const {createIAF } = useAfectaciones();
  const [fixData, setFixData] = useState({
  
    date_act: null,
    by: props.member,
    event: null,
    ubi: getUbiString(),
    provincia: "Loja",
    canton: "Loja_",
    parroq: "",
    radio: "",
    sector: "",
    desc: "",
  });

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

  const options = rawData.map((item,index) => {
    // Creamos el label: "sector - event"
    const label = `${index}-${item.sector} - ${item.event}`;

    // Creamos el value: "sector+event.date" 
    // Usamos replace para quitar espacios si prefieres un value más limpio
    //const value = `${item.sector}+${item.event}.${item.date_event}`.replace(/\s+/g, '_');

    return {
      value: item.row,
      label: label
    };
  });

  // Agregamos la opción por defecto al inicio
  return [{ value: "", label: "Seleccione" }, ...options];

};

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          Ingrese Acciones en la Mesa técnica de trabajo/Grupo de Trabajo -{" "}
          {mtt}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Latitud: {coordinates?.lat}, Longitud: {coordinates?.lng}
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
                  <Grid item size={{ xs: 12, sm: 12 }}>
                    {renderField("evento", "Evento", "select", transformDataToOptions(props.dataPol))}
                  </Grid>
                 
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <DatePicker
                      label="Fecha de Actuación"
                      format="dd/MM/yyyy"
                      value={fixData.date_act}
                      onChange={(value) =>
                        setFixData((prev) => ({ ...prev, date_act: value }))
                      }
                      slotProps={{
                        textField: { fullWidth: true, required: true },
                      }}
                    />
                  </Grid>
                  
               
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    {renderField("radio", "Radio (m)", "number")}
                  </Grid>
                  <Grid item size={{ xs: 12 }}>
                    {renderField("desc", "Descripción", "textarea")}
                  </Grid>
                </Grid>
              </Box>
            </LocalizationProvider>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              createIAF(mtt, { ...formData4, ...fixData });
              handleClose();
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
