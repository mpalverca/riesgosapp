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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { useGetInfo } from "../../Crud";
import MTTAfect from "./afectMMT/mtt_general";
import {
  fieldsGT3,
  fieldsMTT1,
  fieldsMTT2,
  fieldsMTT3,
  fieldsMTT4,
  fieldsMTT5,
  fieldsMTT6,
  fieldsMTT7,
} from "./afectMMT/Fields_afect/fiels_mtt";

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

  const { post, dataGet } = useGetInfo();
  //const {createIAF } = useAfectaciones();
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
  });
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
  const [formDataMTT1, setFormDataMTT1] = useState({
    porc_app: null,
    porc_alc: null,
    ton_res: null,
    n_final: null,
    inc_for: null,
    vol_esc: null,
    ha_cont: null,
    n_planta: null,
    n_cap: null,
    n_tanq: null,
  });

  // MTT2 - Salud y Atención Prehospitalaria
  const [formDataMTT2, setFormDataMTT2] = useState({
    vic_he: null,
    eva_sds: null,
    user_afec: null,
    atent: null,
    death: null,
    salud_afect: null,
    salud_dest: null,
    salud_suspend: null,
    rec_afect: null,
    rec_destr: null,
    rec_hum: null,
  });

  // MTT3 - Servicios básicos esenciales
  const [formDataMTT3, setFormDataMTT3] = useState({
    nac_afec: null,
    via_afec: null,
    puent_afec: null,
    puent_dest: null,
    cort_afect: null,
    porc_elect: null,
    refin: null,
    rad_afect: null,
    fibr_afect: null,
    rad_cort: null,
    porc_tele: null,
    porc_hidro: null,
  });

  // MTT4 - Alojamientos Temporales y Asistencia Humanitaria
  const [formDataMTT4, setFormDataMTT4] = useState({
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

  // MTT5 - Educación en emergencia
  const [formDataMTT5, setFormDataMTT5] = useState({
    isti_afec_parc: null,
    isti_afec_total: null,
    distri_afect_parc: null,
    distri_afect_total: null,
    zonal_afect_parc: null,
    zonal_afect_total: null,
    est_afect: null,
    est_death: null,
    doc_afec: null,
    doc_death: null,
    adm_afect: null,
    adm_death: null,
  });

  // MTT6 - Medios de vida y productividad
  const [formDataMTT6, setFormDataMTT6] = useState({
    cult_afec: null,
    cult_destr: null,
    anim_afect: null,
    anim_death: null,
    infr_afect: null,
    infra_destr: null,
    prod_afect_parc: null,
    prod_afect_total: null,
    infr_hotel_afect: null,
    turs_death: null,
    tur_afect: null,
    aloj_afect: null,
    emple_afect: null,
  });

  // MTT7 - Infraestructura esencial y Vivienda
  const [formDataMTT7, setFormDataMTT7] = useState({
    viv_afect: null,
    viv_dest: null,
    bien_afect: null,
    bien_destrido: null,
    bien_priv_afect: null,
    bien_priv_destr: null,
    bienes_afect: null,
    bienes_destr: null,
    arq_afect: null,
    porc_afect: null,
  });

  // GT3 - Búsqueda, salvamento y rescate
  const [formDataGT3, setFormDataGT3] = useState({
    n_vida: null,
    n_sin_vida: null,
    n_evc: null,
    n_trans: null,
  });

  useEffect(() => {
    setFixData((prev) => ({
      ...prev,
      ubi: getUbiString(),
    }));
  }, [coordinates?.lat, coordinates?.lng]); // Dependencias específicas

  // Verificar coordenadas antes de usarlas
  let currentData = null;
  const getMMData = (mttValue) => {
    switch (mttValue) {
      case "MTT1":
        currentData = formDataMTT1;
        return (
          <MTTAfect
            setFormData={setFormDataMTT1}
            formData={formDataMTT1}
            fieldData={fieldsMTT1}
          />
        );
      case "MTT2":
        currentData = formDataMTT2;
        return (
          <MTTAfect
            setFormData={setFormDataMTT2}
            formData={formDataMTT2}
            fieldData={fieldsMTT2}
          />
        );
      case "MTT3":
        currentData = formDataMTT3;
        return (
          <MTTAfect
            setFormData={setFormDataMTT3}
            formData={formDataMTT3}
            fieldData={fieldsMTT3}
          />
        );
      case "MTT4":
        currentData = formData4;
        return (
          <MTTAfect
            setFormData={setFormData4}
            formData={formData4}
            fieldData={fieldsMTT4}
          />
        );
      case "MTT5":
        return (
          <MTTAfect
            setFormData={setFormDataMTT5}
            formData={formDataMTT5}
            fieldData={fieldsMTT5}
          />
        );
      case "MTT6":
        return (
          <MTTAfect
            setFormData={setFormDataMTT6}
            formData={formDataMTT6}
            fieldData={fieldsMTT6}
          />
        );
      case "MTT7":
        return (
          <MTTAfect
            setFormData={setFormDataMTT7}
            formData={formDataMTT7}
            fieldData={fieldsMTT7}
          />
        );
      case "GT3":
        return (
          <MTTAfect
            setFormData={setFormDataGT3}
            formData={formDataGT3}
            fieldData={fieldsGT3}
          />
        );
      default:
        return "cargndo información";
    }
  };

  const CurrentMTT = getMMData(mtt);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFixData((prev) => ({ ...prev, [name]: value }));
  };
  console.log(fixData.date_act);

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
                  <Grid item size={{ xs: 12, sm: 12 }}>
                    {renderField(
                      "row_event",
                      "Evento",
                      "select",
                      transformDataToOptions(props.dataPol),
                    )}
                  </Grid>
                  {/* <Grid item size={{ xs: 12, sm: 6 }}>
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
                  </Grid> */}
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <DatePicker
                      label="Fecha de Actuación"
                      format="dd/MM/yyyy"
                      value={
                        fixData.date_act
                          ? new Date(
                              fixData.date_act.split("/").reverse().join("-"),
                            )
                          : null
                      }
                      onChange={(value) => {
                        if (value) {
                          // Convertir el objeto Date a string en formato dd/MM/yyyy
                          const formattedDate = format(value, "dd/MM/yyyy");
                          setFixData((prev) => ({
                            ...prev,
                            date_act: formattedDate,
                          }));
                        } else {
                          setFixData((prev) => ({ ...prev, date_act: null }));
                        }
                      }}
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
          {CurrentMTT}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              props.dataPol?.length === 0 ||
              !props.dataPol ||
              !fixData.desc ||
              !fixData.date_act ||
              !fixData.row_event
                ? true
                : false
            }
            onClick={() => {
              // createIAF(mtt, "Afectaciones",{ ...formData4, ...fixData });

              post(mtt, "Afectaciones", { ...currentData, ...fixData });
              handleClose();
              if (dataGet?.success == true) {
                alert(
                  "Se ha agregado la información correctamente, recargue las afectaciones",
                );
                setFixData({});
                setFormDataMTT1({});
                setFormDataMTT2({});
                setFormDataMTT3({});
                setFormDataMTT4({});
                setFormDataMTT5({});
                setFormDataMTT6({});
                setFormDataMTT7({});
                setFormDataGT3({});
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
