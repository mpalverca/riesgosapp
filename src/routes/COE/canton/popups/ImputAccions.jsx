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
  console.log(coordinates?.lat);
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
    code: `Loja-Loja_${mtt}-${props.length + 1}-`,
    date_req:null,
    code_req: "",
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
console.log(fixData.code + fixData.to_mtt_gt)
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
      <Dialog onClose={onClose} open={open}>
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
                    {renderField(
                      "inst_atent",
                      "Institución que atiende_AR",
                      "select",
                      [
                        {
                          value: "ACESS",
                          label:
                            "Agencia de Aseguramiento de la Calidad de los Servicios de Salud y Medicina Prepagada (ACESS)",
                        },
                        {
                          value: "ARCERNNR",
                          label:
                            "Agencia de Regulación y Control de Energía y Recursos Naturales no Renovables (ARCERNNR)",
                        },
                        {
                          value: "ABG",
                          label:
                            "Agencia de Regulación y Control de la Bioseguridad y Cuarentena para Galápagos (ABG)",
                        },
                        {
                          value: "ARCA",
                          label:
                            "Agencia de Regulación y Control del Agua (ARCA)",
                        },
                        {
                          value: "ARCOTEL",
                          label:
                            "Agencia de Regulación y Control de las Telecomunicaciones (ARCOTEL)",
                        },
                        {
                          value: "ARCFZ",
                          label:
                            "Agencia de Regulación y Control Fito y Zoosanitario (ARCFZ)",
                        },
                        {
                          value: "ARCSA",
                          label:
                            "Agencia Nacional de Regulación, Control y Vigilancia Sanitaria (ARCSA)",
                        },
                        {
                          value: "ANT",
                          label: "Agencia Nacional de Tránsito (ANT)",
                        },
                        { value: "AN", label: "Asamblea Nacional (AN)" },
                        {
                          value: "AME",
                          label:
                            "Asociación de Municipalidades Ecuatorianas (AME)",
                        },
                        {
                          value: "ASTINAVEEP",
                          label: "Astilleros Navales Ecuatorianos (ASTINAVEEP)",
                        },
                        {
                          value: "APE",
                          label: "Autoridad Portuaria de Esmeraldas (APE)",
                        },
                        {
                          value: "APG",
                          label: "Autoridad Portuaria de Guayaquil (APG)",
                        },
                        {
                          value: "APM",
                          label: "Autoridad Portuaria de Manta (APM)",
                        },
                        {
                          value: "APPB",
                          label: "Autoridad Portuaria de Puerto Bolívar (APPB)",
                        },
                        {
                          value: "BANECUADOR",
                          label:
                            "Banca para el Desarrollo Productivo Rural y Urbano (BANECUADOR BP)",
                        },
                        {
                          value: "BCE",
                          label: "Banco Central del Ecuador (BCE)",
                        },
                        {
                          value: "BDE",
                          label: "Banco de Desarrollo del Ecuador B.P. (BDE)",
                        },
                        {
                          value: "BIESS",
                          label:
                            "Banco del Instituto Ecuatoriano de Seguridad Social (BIESS)",
                        },
                        {
                          value: "CCDOS",
                          label:
                            "Casa de la Cultura, Danza y Orquesta Sinfónica (CCDOS)",
                        },
                        {
                          value: "CCE",
                          label:
                            "Casa de la Cultura Ecuatoriana Benjamín Carrión (CCE)",
                        },
                        {
                          value: "CIDAP",
                          label:
                            "Centro Interamericano de Artesanías y Artes Populares (CIDAP)",
                        },
                        {
                          value: "CCFFAA",
                          label:
                            "Comando Conjunto de las Fuerzas Armadas (CCFFAA)",
                        },
                        {
                          value: "CTE",
                          label: "Comisión de Tránsito del Ecuador (CTE)",
                        },
                        {
                          value: "CACES",
                          label:
                            "Consejo de Aseguramiento de la Calidad de la Educación Superior (CACES)",
                        },
                        {
                          value: "CGREG",
                          label:
                            "Consejo de Gobierno del Régimen Especial de Galápagos (CGREG)",
                        },
                        { value: "CJ", label: "Consejo de la Judicatura (CJ)" },
                        {
                          value: "CPCCS",
                          label:
                            "Consejo de Participación Ciudadana y Control Social (CPCCS)",
                        },
                        {
                          value: "CRDPIC",
                          label:
                            "Consejo de Regulación, Desarrollo y Promoción de la Información y Comunicación (CRDPIC)",
                        },
                        {
                          value: "CNC",
                          label: "Consejo Nacional de Competencias (CNC)",
                        },
                        {
                          value: "CONASA",
                          label: "Consejo Nacional de Salud (CONASA)",
                        },
                        {
                          value: "CNE",
                          label: "Consejo Nacional Electoral (CNE)",
                        },
                        {
                          value: "CONADIS",
                          label:
                            "Consejo Nacional para la Igualdad de Discapacidades (CONADIS)",
                        },
                        {
                          value: "CNIG",
                          label:
                            "Consejo Nacional para la Igualdad de Género (CNIG)",
                        },
                        {
                          value: "CNIMH",
                          label:
                            "Consejo Nacional para la Igualdad de Movilidad Humana (CNIMH)",
                        },
                        {
                          value: "CNIPN",
                          label:
                            "Consejo Nacional para la Igualdad de Pueblos y Nacionalidades (CNIPN)",
                        },
                        {
                          value: "CNII",
                          label:
                            "Consejo Nacional para la Igualdad Intergeneracional (CNII)",
                        },
                        {
                          value: "CCA",
                          label: "Corporación Ciudad Alfaro (CCA)",
                        },
                        {
                          value: "COSEDE",
                          label: "Corporación del Seguro de Depósitos (COSEDE)",
                        },
                        {
                          value: "CELEC",
                          label: "Corporación Eléctrica del Ecuador (CELEC EP)",
                        },
                        {
                          value: "CFN",
                          label: "Corporación Financiera Nacional (CFN)",
                        },
                        {
                          value: "CNEL",
                          label: "Corporación Nacional de Electricidad (CNEL)",
                        },
                        {
                          value: "CONAFIPS",
                          label:
                            "Corporación Nacional de Finanzas Populares y Solidarias (CONAFIPS)",
                        },
                        {
                          value: "CNT",
                          label:
                            "Corporación Nacional de Telecomunicaciones (CNT)",
                        },
                        { value: "CDE", label: "Correos del Ecuador (CDE)" },
                        { value: "BOMBEROS", label: "Cuerpo de Bomberos" },
                        { value: "DPE", label: "Defensoría del Pueblo (DPE)" },
                        {
                          value: "DP",
                          label: "Defensoría Pública de Ecuador (DP)",
                        },
                        {
                          value: "DPNG",
                          label:
                            "Dirección del Parque Nacional Galápagos (DPNG)",
                        },
                        {
                          value: "DGAC",
                          label: "Dirección General de Aviación Civil (DGAC)",
                        },
                        {
                          value: "DGRCIC",
                          label:
                            "Dirección General de Registro Civil Identificación y Cedulación (DGRCIC)",
                        },
                        {
                          value: "DINARDAP",
                          label:
                            "Dirección Nacional de Registro de Datos Públicos (DINARDAP)",
                        },
                        {
                          value: "EEEP",
                          label: "Ecuador Estratégico EP (EEEP)",
                        },
                        {
                          value: "EMELNORTE",
                          label: "EMELNORTE S. A. (EMELNORTE)",
                        },
                        {
                          value: "EMCOEP",
                          label:
                            "Empresa Coordinadora de Empresas Públicas (EMCOEP)",
                        },
                        {
                          value: "EEASA",
                          label:
                            "Empresa Eléctrica Ambato Regional Centro Norte S.A. (EEASA)",
                        },
                        {
                          value: "EEA",
                          label: "Empresa Eléctrica Azogues C.A (EEA)",
                        },
                        {
                          value: "EEPC",
                          label:
                            "Empresa Eléctrica Provincial Cotopaxi S.A. (EEPC)",
                        },
                        {
                          value: "EEPG",
                          label:
                            "Empresa Eléctrica Provincial Galápagos (EEPG)",
                        },

                        {
                          value: "EERSSA",
                          label:
                            "Empresa Eléctrica Regional del Sur S.A. (EERSSA)",
                        },

                        {
                          value: "ENAMI",
                          label: "Empresa Nacional Minera (ENAMI)",
                        },
                        {
                          value: "EPCPT",
                          label: "Empresa Pública Casa para Todos (EPCPT)",
                        },
                        {
                          value: "EPA",
                          label: "Empresa Pública del Agua (EPA)",
                        },
                        {
                          value: "FLOPEC",
                          label:
                            "Empresa Pública Flota Petrolera Ecuatoriana (FLOPEC)",
                        },
                        {
                          value: "EPMAPSP",
                          label:
                            "Empresa Pública Municipal de Agua Potable y Saneamiento de Portoviejo PORTOAGUAS EP (EPMAPSP)",
                        },
                        {
                          value: "EPMRP-SD",
                          label:
                            "Empresa Pública Municipal Registro de la Propiedad del Cantón Santo Domingo (EPMRP-SD)",
                        },
                        {
                          value: "EP PETROECUADOR",
                          label: "EP PETROECUADOR (EP)",
                        },
                        { value: "GAD_CANTONAL", label: "GAD Cantonal" },
                        { value: "GAD_PROVINCIAL", label: "GAD Provincial" },
                        { value: "GAD_PARROQUIAL", label: "GAD Parroquial" },
                        {
                          value: "IFCI",
                          label:
                            "Instituto de Fomento a la Creatividad e Innovación (IFCI)",
                        },
                        {
                          value: "IIGE",
                          label:
                            "Instituto de Investigación Geológico y Energético (IIGE)",
                        },
                        {
                          value: "ISSFA",
                          label:
                            "Instituto de Seguridad Social de las Fuerzas Armadas (ISSFA)",
                        },
                        {
                          value: "IESS",
                          label:
                            "Instituto Ecuatoriano de Seguridad Social (IESS)",
                        },
                        {
                          value: "IGM",
                          label: "Instituto Geográfico Militar (IGM)",
                        },
                        {
                          value: "INABIO",
                          label: "Instituto Nacional de Biodiversidad (INABIO)",
                        },
                        {
                          value: "INDOT",
                          label:
                            "Instituto Nacional de Donación y Trasplante de Órganos, Tejidos y Células (INDOT)",
                        },
                        {
                          value: "IEPS",
                          label:
                            "Instituto Nacional de Economía Popular y Solidaria (IEPS)",
                        },
                        {
                          value: "INEC",
                          label:
                            "Instituto Nacional de Estadística y Censos (INEC)",
                        },
                        {
                          value: "INEVAL",
                          label:
                            "Instituto Nacional de Evaluación Educativa (INEVAL)",
                        },
                        {
                          value: "INSPI",
                          label:
                            "Instituto Nacional de Investigación en Salud Pública Dr. Leopoldo Izquieta Pérez (INSPI)",
                        },
                        {
                          value: "INIAP",
                          label:
                            "Instituto Nacional de Investigaciones Agropecuarias (INIAP)",
                        },
                        {
                          value: "INAMHI",
                          label:
                            "Instituto Nacional de Meteorología e Hidrología (INAMHI)",
                        },
                        {
                          value: "INPC",
                          label:
                            "Instituto Nacional de Patrimonio Cultural (INPC)",
                        },
                        {
                          value: "INOCAR",
                          label:
                            "Instituto Oceanográfico y Antártico de la Armada (INOCAR)",
                        },
                        {
                          value: "IPIAP",
                          label:
                            "Instituto Público de Investigación de Acuicultura y Pesca (IPIAP)",
                        },
                        {
                          value: "MAG",
                          label: "Ministerio de Agricultura y Ganadería (MAG)",
                        },
                        {
                          value: "MCPGAD",
                          label:
                            "Ministerio de Coordinación de la Política y Gobierno Autónomos Descentralizados (MCPGAD)",
                        },
                        {
                          value: "MC",
                          label: "Ministerio de Cultura y Patrimonio (MC)",
                        },
                        {
                          value: "MIDENA",
                          label: "Ministerio de Defensa Nacional (MIDENA)",
                        },
                        {
                          value: "MIDUVI",
                          label:
                            "Ministerio de Desarrollo Urbano y Vivienda (MIDUVI)",
                        },
                        {
                          value: "MEF",
                          label: "Ministerio de Economía y Finanzas (MEF)",
                        },
                        {
                          value: "MINEDUC",
                          label: "Ministerio de Educación (MINEDUC)",
                        },
                        {
                          value: "MIN_ENERGIA",
                          label: "Ministerio de Energía y Minas",
                        },
                        { value: "MDG", label: "Ministerio de Gobierno (MDG)" },
                        {
                          value: "MIES",
                          label:
                            "Ministerio de Inclusión Económica y Social (MIES)",
                        },
                        {
                          value: "MAATE",
                          label:
                            "Ministerio del Ambiente, Agua y Transición Ecológica (MAATE)",
                        },
                        { value: "MD", label: "Ministerio del Deporte (MD)" },
                        {
                          value: "MPCEIP",
                          label:
                            "Ministerio de Producción, Comercio Exterior, Inversiones y Pesca (MPCEIP)",
                        },
                        {
                          value: "MREMH",
                          label:
                            "Ministerio de Relaciones Exteriores y Movilidad Humana (MREMH)",
                        },
                        {
                          value: "MSP",
                          label: "Ministerio de Salud Pública (MSP)",
                        },
                        {
                          value: "MINTEL",
                          label:
                            "Ministerio de Telecomunicaciones y de la Sociedad de la Información (MINTEL)",
                        },
                        { value: "MT", label: "Ministerio de Trabajo (MT)" },
                        {
                          value: "MTOP",
                          label:
                            "Ministerio de Transporte y Obras Públicas (MTOP)",
                        },
                        {
                          value: "MINTUR",
                          label: "Ministerio de Turismo (MINTUR)",
                        },
                        {
                          value: "CENACE",
                          label:
                            "Operador Nacional de Electricidad - CENACE (CENACE)",
                        },
                        {
                          value: "PN",
                          label: "Policía Nacional del Ecuador (PN)",
                        },
                        {
                          value: "PR",
                          label: "Presidencia de la República (PR)",
                        },
                        {
                          value: "PGE",
                          label: "Procuraduría General del Estado (PGE)",
                        },
                        { value: "SBEP", label: "Santa Bárbara EP (SBEP)" },
                        {
                          value: "MMDH",
                          label: "Ministerio de la Mujer y Derechos Humanos",
                        },
                        {
                          value: "SENESCYT",
                          label:
                            "Secretaría de Educación Superior, Ciencia, Tecnología e Innovación (SENESCYT)",
                        },
                        {
                          value: "SGDPN",
                          label:
                            "Secretaría de Gestión y Desarrollo de Pueblos y Nacionalidades (SGDPN)",
                        },
                        {
                          value: "SGR",
                          label: "Secretaría de Gestión de Riesgos",
                        },
                        {
                          value: "SESEIB",
                          label:
                            "Secretaría del Sistema de Educación Intercultural Bilingüe (SESEIB)",
                        },
                        {
                          value: "SNP",
                          label: "Secretaría Nacional de Planificación (SNP)",
                        },
                        {
                          value: "SETEGISP",
                          label:
                            "Secretaría Técnica de Gestión Inmobiliaria del Sector Público (SETEGISP)",
                        },
                        {
                          value: "SETEJU",
                          label: "Secretaría Técnica de Juventudes (SETEJU)",
                        },
                        {
                          value: "STCTEA",
                          label:
                            "Secretaría Técnica de la Circunscripción Territorial Amazónica (STCTEA)",
                        },
                        {
                          value: "STCPAHI",
                          label:
                            "Secretaría Técnica del Comité Interinstitucional de Prevención de Asentamientos Irregulares (STCPAHI)",
                        },
                        {
                          value: "STPE",
                          label: "Secretaría Técnica del Plan Ecuador (STPE)",
                        },
                        {
                          value: "STPTV",
                          label:
                            "Secretaría Técnica del Plan Toda una Vida (STPTV)",
                        },
                        {
                          value: "SAE",
                          label: "Servicio de Acreditación Ecuatoriano (SAE)",
                        },
                        {
                          value: "SECOB",
                          label: "Servicio de Contratación de Obras (SECOB)",
                        },
                        {
                          value: "SRI",
                          label: "Servicio de Rentas Internas (SRI)",
                        },
                        {
                          value: "SECAP",
                          label:
                            "Servicio Ecuatoriano de Capacitación Profesional (SECAP)",
                        },
                        {
                          value: "INEN",
                          label: "Servicio Ecuatoriano de Normalización (INEN)",
                        },
                        {
                          value: "ECU911",
                          label: "Servicio Integrado de Seguridad (ECU 911)",
                        },
                        {
                          value: "SENAE",
                          label:
                            "Servicio Nacional de Aduana del Ecuador (SENAE)",
                        },
                        {
                          value: "SNAI",
                          label:
                            "Servicio Nacional de Atención Integral a Personas Adultas Privadas de la Libertad y a Adolescentes Infractores (SNAI)",
                        },
                        {
                          value: "SERCOP",
                          label:
                            "Servicio Nacional de Contratación Pública (SERCOP)",
                        },
                        {
                          value: "SENADI",
                          label:
                            "Servicio Nacional de Derechos Intelectuales (SENADI)",
                        },
                        { value: "FGE", label: "Fiscalía General del Estado" },
                        {
                          value: "SNMLCF",
                          label:
                            "Servicio Nacional de Medicina Legal y Ciencias Forenses (SNMLCF)",
                        },
                        {
                          value: "SPPAT",
                          label:
                            "Servicio Público para pago de Accidentes de Tránsito (SPPAT)",
                        },
                        { value: "PA", label: "SS Sin Sector (PA)" },
                        {
                          value: "SB",
                          label: "Superintendencia de Bancos (SB)",
                        },
                        {
                          value: "SCVS",
                          label:
                            "Superintendencia de Compañías, Valores y Seguros (SCVS)",
                        },
                        {
                          value: "SCPM",
                          label:
                            "Superintendencia de Control del Poder de Mercado (SCPM)",
                        },
                        {
                          value: "SEPS",
                          label:
                            "Superintendencia de Economía Popular y Solidaria (SEPS)",
                        },
                        {
                          value: "VPR",
                          label: "Vicepresidencia de la República (VPR)",
                        },
                        { value: "CRE", label: "Cruz Roja Ecuatoriana (CRE)" },
                        {
                          value: "SSG",
                          label: "Secretaría de Seguridad y Gobernabilidad",
                        },
                        { value: "SM", label: "Secretaría de Movilidad" },
                        {
                          value: "SERD",
                          label:
                            "Secretario de Educación, Recreación y Deporte",
                        },
                        { value: "SC", label: "Secretaría de Comunicación" },
                        { value: "SA", label: "Secretaría de Ambiente" },
                        { value: "SCUL", label: "Secretaría de Cultura" },
                        { value: "SSAL", label: "Secretaría de Salud" },
                        {
                          value: "SIS",
                          label: "Secretaría de Inclusión Social",
                        },
                        {
                          value: "SCTPC",
                          label:
                            "Secretaría de Coordinación Territorial y Participación Ciudadana",
                        },
                        {
                          value: "SDPC",
                          label:
                            "Secretaría de Desarrollo Productivo y Competitividad",
                        },
                        {
                          value: "SGP",
                          label: "Secretaría General de Planificación",
                        },
                        {
                          value: "STHV",
                          label: "Secretaría de Territorio, Hábitat y Vivienda",
                        },
                        { value: "STICS", label: "Secretaría de TICS" },
                        { value: "EPMSA", label: "EPMSA" },
                        { value: "EMSEGURIDAD", label: "EP EMSEGURIDAD" },
                        { value: "EMAPS", label: "EMAPS" },
                        {
                          value: "AMT",
                          label: "Agencia Metropolitana de Tránsito",
                        },
                        {
                          value: "AMC",
                          label: "Agencia Metropolitana de Control",
                        },
                        {
                          value: "ACDC",
                          label:
                            "Agencia de Coordinación Distrital del Comercio",
                        },

                        {
                          value: "IMP",
                          label: "Instituto Metropolitano de Patrimonio",
                        },
                        {
                          value: "DRI",
                          label: "Dirección de Relaciones Internacionales",
                        },
                        {
                          value: "DMBI",
                          label: "Dirección Metropolitana de Bienes Inmuebles",
                        },
                        {
                          value: "IPP",
                          label: "Intendente de Policía de Pichincha",
                        },
                        {
                          value: "NRC",
                          label: "Consejo Noruego para refugiados - NRC",
                        },
                        {
                          value: "ADRA",
                          label:
                            "Agencia Adventista de Desarrollo y Recursos Asistenciales - ADRA",
                        },
                        {
                          value: "FEPP",
                          label:
                            "Fondo Ecuatoriano Populorum Progressio - FEPP",
                        },
                        { value: "WVE", label: "World Vision Ecuador - WVE" },
                        {
                          value: "COOPI",
                          label: "Cooperazione Internazionale - COOPI",
                        },
                        { value: "AVSI", label: "Fundación AVSI - AVSI" },
                        {
                          value: "PROTOS",
                          label: "Centro de Apoyo al Desarrollo Protos ANDES",
                        },
                        { value: "CARE", label: "CARE Ecuador - CARE" },
                        {
                          value: "MIN_INTERIOR",
                          label: "Ministerio del Interior",
                        },
                        {
                          value: "CUE",
                          label: "Cuerpo de Ingenieros del Ejército",
                        },
                      ],
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
                        mesas
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
                        "text",
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
                    <Grid item size={{ xs: 12, md: 12 }}>
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
                      <Typography
                      align="center"
                      alignItems="center"
                      alignContent="center"
                      >{fixData.code + fixData.to_mtt_gt}</Typography>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField("code_req", "Código Requerimiento", "text")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField(
                        "date_req",
                        "Fecha del requerimiento",
                        "date",
                      )}
                    </Grid>

                    <Grid item size={{ xs: 12, md: 6 }}>
                      {renderField("to_mtt_gt", "Dirigido a MTT-GT", "select",mesas)}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField("need", "Necesidad", "textarea")}
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}>
                      {renderField(
                        "state_req",
                        "Estado del requerimiento",
                        "select",
                        [
                          "Atendido",
                          "Pendiente",
                          "En proceso",
                          "No Atendido",
                          "Insubsistente",
                        ],
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
            disable={!props.length || props.length>0 ? false : true}
            onClick={() => {
              post(mtt, "Acciones", { code_req:fixData.code + fixData.to_mtt_gt , ...fixData });
              onClose();
              if (dataGet?.success == true) {
                alert(
                  "Se ha agregado la información correctamente, recargue las acciones",
                );
              }
            }}
          >
            Añadir
          </Button>
          <Button onClick={onClose} autoFocus>
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
