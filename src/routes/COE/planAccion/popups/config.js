// ========== CONSTANTES ==========
export const MONTHS = [
  { key: "Jun", label: "Junio" },
  { key: "Jul", label: "Julio" },
  { key: "Ago", label: "Agosto" },
  { key: "Sep", label: "Septiembre" },
  { key: "Oct", label: "Octubre" },
  { key: "Nov", label: "Noviembre" },
  { key: "Dic", label: "Diciembre" },
];

export const TIPO_OPTIONS = [
  { value: "Conoc_Monit", label: "Conocimiento y Monitoreo" },
  { value: "prev_mit", label: "Prevención y Mitigación" },
  { value: "prep", label: "Preparación" },
  { value: "resp", label: "Respuesta" },
  { value: "recup", label: "Recuperación" },
];

export const VERIFICABLE_OPTIONS = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

export const ESTADO_OPTIONS = [
  { value: "Por activar", label: "Por activar" },
  { value: "Programado", label: "Programado" },
  { value: "En ejecución", label: "En ejecución" },
  { value: "Permanente", label: "Permanente" },
  { value: "Completado", label: "Completado" },
];

export const INITIAL_DATA = {
  by: "",
  mtt: "",
  provincia: "Loja",
  canton: "Loja",
  sector: "",
  desc: "",
  accion: "",
  cash: "",
  detail: "",
  verifi: "",
  estado: " ",
  tipe: "",
  responsable: "",
};