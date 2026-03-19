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
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";

import { useGetInfo } from "../../Crud";

export const DialogAccions = ({
  open,
  onClose,
  mtt,
  coordinates,
  ...props
}) => {
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
  console.log(coordinates?.lat);
  const { post, dataGet } = useGetInfo();
  const [fixData, setFixData] = useState({
    date_event: null,
    date_act: null,
    by: props.member,
    ubi: getUbiString(),
    event: null,
    provincia: "Loja",
    canton: "Loja_",
    parroq: "",
    radio: "",
    sector: "",
    desc: "",
    acc_resp: "",
    sector_COE: "",
    estado: "",
    obs: "",
    detalle: "",
    date_mov: "",
    Inst_atie: "",
    prov: "Loja",
    canton: "Loja",
    n_herramientas: "",
    n_personal: "",
    u_emerg: "",
    n_livianos: "",
    n_pesados: "",
    u_aereas: "",
    otro: "",
    obser: "",
    code: "",
    code_req: "",
    date_req: "",
    to_mtt_gt: "",
    need: "",
    state_req: "",
  });

  useEffect(() => {
    setFixData((prev) => ({
      ...prev,
      ubi: getUbiString(),
    }));
  }, [coordinates?.lat, coordinates?.lng]); // Dependencias específicas

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
                    {renderField(
                      "evento",
                      "Evento",
                      "select",
                      transformDataToOptions(props.dataPol),
                    )}
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
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    {/* Primera sección: Información básica */}
                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField(
                        "acc_resp",
                        "Acción de respuesta_AR",
                        "text",
                      )}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField(
                        "sector_COE",
                        "Sector que atiendó - Según manual del COE_AR",
                        "text",
                      )}
                    </Grid>

                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("estado", "Estado_AR", "select", {
                        options: [
                        {value:  "Vigente", label:  "Vigente"},
                           
                        
                         {value: "Finalizada", label: "Finalizada"},
                        ],
                      })}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("obs", "Observación_AR", "textarea")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("detalle", "Detalle", "textarea")}
                    </Grid>

                    {/* Separador visual */}
                    <Grid item size={{ xs: 12 }}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6">
                        Información de Movilización
                      </Typography>
                    </Grid>

                    {/* Fecha de Movilización e Institución */}
                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField("date_mov", "Fecha de Movilización", "date")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField(
                        "Inst_atie",
                        "Institución que atiende",
                        "text",
                      )}
                    </Grid>

                    {/* Ubicación */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("prov", "Provincia", "text")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("canton", "Cantón", "text")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("ubicacion", "Ubicación", "text")}
                    </Grid>

                    {/* Separador */}
                    <Grid item size={{ xs: 12 }}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6">Recursos Asignados</Typography>
                    </Grid>

                    {/* Recursos numéricos */}
                    <Grid item size={{ xs: 12, md: 3 }}>
                      {renderField("n_herramientas", "Herramientas", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 3 }}>
                      {renderField("n_personal", "#Personal", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 3 }}>
                      {renderField(
                        "u_emerg",
                        "#Unidades de Emergencia",
                        "number",
                      )}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 3 }}>
                      {renderField(
                        "n_livianos",
                        "#Vehículos livianos",
                        "number",
                      )}
                    </Grid>

                    <Grid item size={{ xs: 12, md: 3 }}>
                      {renderField("n_pesados", "#Vehículos Pesados", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 3 }}>
                      {renderField("u_aereas", "#Unidades aéreas", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 3 }}>
                      {renderField("otro", "#Otro", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 3 }}>
                      {renderField("obser", "Observaciones", "textarea")}
                    </Grid>

                    {/* Separador */}
                    <Grid item size={{ xs: 12 }}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6">
                        Información del Requerimiento
                      </Typography>
                    </Grid>

                    {/* Código y fechas de requerimiento */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField(
                        "code",
                        "Código Requerimiento (MTTX-XXXX)",
                        "text",
                      )}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("code_req", "Código Requerimiento", "text")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField(
                        "date_req",
                        "Fecha del requerimiento",
                        "date",
                      )}
                    </Grid>

                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("to_mtt_gt", "Dirigido a MTT-GT", "text")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("need", "Necesidad", "textarea")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField(
                        "state_req",
                        "Estado del requerimiento",
                        "select",
                        {
                          options: [
                            "Pendiente",
                            "Aprobado",
                            "Rechazado",
                            "En Ejecución",
                            "Completado",
                          ],
                        },
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </LocalizationProvider>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              post(mtt, "Acciones", { fixData });
              handleClose();
              if (dataGet?.success == true) {
                alert(
                  "Se ha agregado la información correctamente, recargue las acciones",
                );
              }
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
