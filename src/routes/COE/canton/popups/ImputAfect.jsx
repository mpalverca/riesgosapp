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
  const { loadingIAF, errorIAF, dataIAF, createIAF } = useAfectaciones();
  const [fixData, setFixData] = useState({
    date_event: null,
    date_act: null,
    by: props.member,
    ubi: getUbiString(),
    provincia: "Loja",
    canton: "Loja_",
    parroq: "",
    event: "",
    radio: "",
    sector: "",
    desc: "",
  });
  console.log(fixData);
  const [formData4, setFormData4] = useState({
    perm_dam: null,
    fam_damn: null,
    perf_afect: null,
    fam_afect: null,
    per_ind: null,
    fam_ind: null,
    perd_desp: null,
    fam_despl: null,
    alb_afect: null,
    camp_afect: null,
    per_fam: null,
    fam_fam: null,
    per_cam: null,
    fam_camp: null,
    per_ref: null,
    fam_ref: null,
    per_emerg: null,
    fami_emerg: null,
  });
  // Verificar coordenadas antes de usarlas

  const getColorByMTT = (mttValue) => {
    switch (mttValue) {
      case "MTT1":
        return <MTT1Afect />;
      case "MTT2":
        return "blue";
      case "MTT3":
        return "green";
      case "MTT4":
        return <MTT4Afect setFormData={setFormData4} formData={formData4} />;
      case "MTT5":
        return "purple";
      default:
        return "cargndo información";
    }
  };

  const currentColor = getColorByMTT(mtt);

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

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          Ingrese Afectaciones en la Mesa técnica de trabajo/Grupo de Trabajo -{" "}
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
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Fecha del Evento"
                      value={fixData.date_event}
                      onChange={(value) =>
                        setFixData((prev) => ({ ...prev, date_event: value }))
                      }
                      slotProps={{
                        textField: { fullWidth: true, required: true },
                      }}
                    />
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
                    {renderField("parroq", "Parroquia", "select", [
                      { value: "carigan", label: "Carigan" },
                      { value: "el_sagrario", label: "El Sagrario" },
                      { value: "el_valle", label: "El Valle" },
                      { value: "punzara", label: "Punzara" },
                      { value: "san_sebastian", label: "San Sebastián" },
                      { value: "sucre", label: "Sucre" },
                      { value: "chantaco", label: "Chantaco" },
                      { value: " chuquiribamba,", label: " Chuquiribamba" },
                      { value: "el_cisne", label: "El Cisne" },
                      { value: "gualel", label: "Gualel" },
                      { value: "jimbilla", label: "Jimbilla" },
                      { value: "malacatos", label: "Malacatos" },
                      { value: "quinara", label: "Quinara" },
                      { value: "san_lucas", label: "San Lucas" },
                      {
                        value: "san_pedro_de_vilcabamba",
                        label: "San Pedro de Vilcabamba",
                      },
                      { value: "santiago", label: "Santiago" },
                      { value: "taquil", label: "Taquil" },
                      { value: "vilcabamba", label: "Vilcabamba" },
                      { value: "yangana", label: "Yangana" },

                      ,
                    ])}
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    {renderField("sector", "Sector")}
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    {renderField("event", "Tipo de Evento", "select", [
                      { value: "", label: "Seleccione" },
                      { value: "deslizamiento", label: "Movimiento en masa" },
                      { value: "colapso", label: "Colapso Estructural" },
                      { value: "granizada", label: "Granizada" },
                      { value: "helada", label: "Helada" },
                      { value: "hundimiento", label: "Hundimiento" },
                      { value: "inundacion", label: "Inundación" },
                      { value: "socavamiento", label: "Socavamiento" },
                      { value: "subsidencia", label: "Subsidencia" },
                      { value: "tormenta", label: "Tormenta Eléctrica" },
                      { value: "vendaval,", label: "Vendaval" },
                    ])}
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
          {currentColor}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              createIAF(mtt, { ...formData4, ...fixData });
              handleClose()
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

const MTT1Afect = () => {
  return (
    <>
      <TextField></TextField>
    </>
  );
};

