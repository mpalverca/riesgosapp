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
import inst_info from "../../../../components/utils/inst_info.json";
export const DialogAccions = ({
  open,
  onClose,
  mtt,
  coordinates,
  ...props
}) => {
  const length=props.length
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
  const { post, dataGet } = useGetInfo();
  const [fixData, setFixData] = useState({
    date_event: null,
    date_act: null,
    inst_atent: "",
    by: props.member,
    ubi: getUbiString(),
    event: null,
    prov_atent: "Loja",
    canton_aten: "Loja_",
    parroq_aten: "",
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
    code: `Loja - Loja_ - ${mtt} - ${length + 1} - `,
    date_req: null,
    //code_req: "",
    date_req: "",
    to_mtt_gt: "",
    need: "",
    state_req: "",
  });
 
  const mesas = [
    {
      value: "MTT1",
      label: "MTT1-Agua segura, saneamiento y gestión de residuos",
    },
    {
      value: "MTT2",
      label: "MTT2-Salud y ATención Prehospitalaria",
    },
    {
      value: "MTT3",
      label: "MTT3-Servicios básicos esenciales",
    },
    {
      value: "MTT4",
      label: "MTT4-Alojamientos Temporales y Asistencia Humanitaria",
    },
    {
      value: "MTT5",
      label: "MTT5-Educación en emergencia",
    },
    {
      value: "MTT6",
      label: "MTT6-Medios de vida y productividad",
    },
    {
      value: "MTT7",
      label: "MTT7-Infraestructura esencial y Vivienda",
    },
    {
      value: "GT1",
      label: "GT1-Logística",
    },
    {
      value: "GT2",
      label: "GT2-Seguridad y Control",
    },
    {
      value: "GT3",
      label: "GT3-Búsqueda, salvamento y rescate",
    },
  ];

  useEffect(() => {
    setFixData((prev) => ({
      ...prev,
      ubi: getUbiString(),
      code: `Loja - Loja_ - ${mtt} - ${length + 1} - `
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
                      "row_event",
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
                    {renderField(
                      "inst_atent",
                      "Institución que atiende_AR",
                      "select",                      
                      inst_info,
                    )}
                  </Grid>
                  <Grid item size={{ xs: 12 }}>
                    {renderField(
                      "acc_resp",
                      "Acción de respuesta_AR",
                      "textarea",
                    )}
                  </Grid>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    {/* Primera sección: Información básica */}

                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField(
                        "sector_COE",
                        "Sector que atiendó - Según manual del COE_AR",
                        "select",
                        mesas,
                      )}
                    </Grid>

                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField("estado", "Estado_AR", "select", [
                        { value: "Vigente", label: "Vigente" },
                        { value: "Finalizada", label: "Finalizada" },
                      ])}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 12 }}>
                      {renderField("obs", "Observación_AR", "textarea")}
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
                        "select",
                        inst_info,
                      )}
                    </Grid>

                    {/* Separador */}
                    <Grid item size={{ xs: 12 }}>
                      <Typography variant="body1">
                        Recursos Asignados
                      </Typography>
                    </Grid>

                    {/* Recursos numéricos */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("n_herramientas", "Herramientas", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("n_personal", "#Personal", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField(
                        "u_emerg",
                        "#Unidades de Emergencia",
                        "number",
                      )}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField(
                        "n_livianos",
                        "#Vehículos livianos",
                        "number",
                      )}
                    </Grid>

                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("n_pesados", "#Vehículos Pesados", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("u_aereas", "#Unidades aéreas", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("otro", "#Otro", "number")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 12 }}>
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

                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField(
                        "date_req",
                        "Fecha del requerimiento",
                        "date",
                      )}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField(
                        "to_mtt_gt",
                        "Dirigido a MTT-GT",
                        "select",
                        mesas,
                      )}
                    </Grid>
                    <Grid
                      item
                      size={{ xs: 12, md: 6 }}
                      sx={{
                        alignContent: "center",
                        border: 2,
                        borderColor: "red",
                      }}
                    >
                      <Typography
                        align="center"
                        alignItems="center"
                        alignContent="center"
                      >
                        {fixData.code + fixData.to_mtt_gt}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField(
                        "state_req",
                        "Estado del requerimiento",
                        "select",
                        [
                          { value: "Atendido", label: "Atendido" },
                          { value: "Pendiente", label: "Pendiente" },
                          { value: "En proceso", label: "En proceso" },
                          { value: "No Atendido", label: "No Atendido" },
                          { value: "Insubsistente", label: "Insubsistente" },
                        ],
                      )}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 12 }}>
                      {renderField("need", "Necesidad", "textarea")}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </LocalizationProvider>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              props.dataPol?.length === 0 ||
              !props.dataPol ||
              !fixData.date_act ||
              !fixData.row_event ||
             length == 0 
             
                ? true
                : false
            }
            onClick={() => {
              post(mtt, "Acciones", {
                code_req: fixData.code + fixData.to_mtt_gt,
                ...fixData,
              });
              handleClose();
              if (dataGet?.success == true) {
                alert(
                  "Se ha agregado la información correctamente, recargue las acciones",
                );
                setFixData({});
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
