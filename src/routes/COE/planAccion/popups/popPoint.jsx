import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Button, Divider, Tab, Typography } from "@mui/material";
import { divIcon } from "leaflet";
import { useCallback, useState } from "react";
import { renderToString } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { parseByField } from "../../../utils/utils";

// ========== FUNCIÓN AUXILIAR PARA EXTRAER DATOS ==========
const extractDataArray = (data) => {
  // Si es null o undefined
  if (!data) return [];

  // Si ya es un array, devolverlo
  if (Array.isArray(data)) return data;

  // Si es un objeto con propiedad 'datos' que es array
  if (data.datos && Array.isArray(data.datos)) return data.datos;

  // Si es un objeto con propiedad 'data' que es array
  if (data.data && Array.isArray(data.data)) return data.data;

  // Si es un objeto plano, devolverlo como array de un elemento o array vacío
  if (typeof data === "object") {
    return Object.keys(data).length > 0 ? [data] : [];
  }

  return [];
};

// ========== FUNCIÓN PARA PROCESAR MARCADORES ==========
const processMarkers = (rawData) => {
  const dataArray = extractDataArray(rawData);

  if (!dataArray || !Array.isArray(dataArray)) return [];

  return dataArray
    .map((item, index) => {
      if (!item.ubi) return null;
      try {
        // Convertir "lat, lng" a objeto { lat, lng }
        const coords = coordForm(item.ubi);
        return coords
          ? { id: item._id || index, position: coords, data: item }
          : null;
      } catch (e) {
        console.warn(`Error procesando marcador ${index}:`, e);
        return null;
      }
    })
    .filter(Boolean);
};

// ========== FUNCIÓN PARA CONVERTIR COORDENADAS ==========
const coordForm = (ubi) => {
  if (!ubi || typeof ubi !== "string") return null;

  const parts = ubi.split(",").map((part) => part.trim());
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }
  return null;
};

// ========== COMPONENTE PRINCIPAL ==========
export const ConMonitView = ({
  afect, // Datos crudos (puede ser array u objeto con 'datos')
  formatDate,
  mtt,
  polAfect,
  setOpenDialog,
  setTypeInput,
  files,
  ...props
}) => {
  const [value, setValue] = useState("1");
  const [openEdit, setOpenEdit] = useState(false);

  // Procesar los marcadores

  const getEventIcon = useCallback((color) => {
    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        color === "Vigente" || color === "en ejecución" ? "#602fbb" : "#3eb13e",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    };
    const html = renderToString(
      <div style={circleStyle}>
        <DirectionsWalkIcon
          color={color === "Vigente" ? "#f9f9fa" : "#000000"}
          size={14}
        />
      </div>,
    );
    return divIcon({
      html,
      className: "custom-leaflet-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Si no hay marcadores, no renderizar nada
  if (!afect || afect.length === 0) {
    return null;
  }

  return (
    <>
      {afect.map((marker) => {
        const byData = parseByField(marker.data.by);
        const event_index = Number(marker.data.event_row);
        const pol_row = polAfect?.find((item) => item.row === event_index);

        // Posición para Leaflet [lat, lng]
        const position = [marker.position[0], marker.position[1]];

        return (
          <Marker
            key={marker.id}
            position={position}
            icon={getEventIcon(marker.data.estado)}
          >
            <Popup options={{ maxWidth: 300, minWidth: 250 }} maxWidth={500}>
              <Box
                sx={{ height: "60vh", overflowY: "auto", maxWidth: "4700px" }}
              >
                <h3 style={{ marginTop: 0, color: "#e6101b" }}>
                  {`Conocimiento y monitoreo` || "Evento"}
                </h3>
                <h4 style={{ color: "#3519d2" }}>
                  {` ${marker.data.accion} - ${marker.data.estado}` || "Evento"}
                </h4>
                <p>
                  <strong>Fecha del evento:</strong> {marker.data.date}
                </p>
                <p>
                  <strong>Última actualización:</strong>{" "}
                  {formatDate(marker.data.date_act)}
                </p>
                <p>
                  <strong>Ubicación:</strong> Lat:{" "}
                  {marker.position[0].toFixed(6)}, Lng:{" "}
                  {marker.position[1].toFixed(6)}
                </p>
                <Divider />
                {byData && !byData.error && (
                  <>
                    <p>
                      <strong>Reportado por:</strong>
                    </p>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>
                        <strong>Nombre:</strong> {byData.miembro}
                      </li>
                      <li>
                        <strong>Cargo:</strong> {byData.cargo}
                      </li>
                      <li>
                        <strong>CI:</strong> {byData.ci}
                      </li>
                      {byData.telf && (
                        <li>
                          <strong>Contacto:</strong> {byData.telf}
                        </li>
                      )}
                    </ul>
                  </>
                )}

                <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                  <strong>Descripción: </strong>
                  {marker.data.desc || "No disponible"}
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                  <strong>Presupuesto requerido: </strong>
                  {marker.data.cash || "No disponible"}
                </Typography>

                 <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                  <strong>Instituciones de apoyo: </strong>
                  {marker.data.inst || "No disponible"}
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                  <strong>Plazo de ejecución: </strong>
                  <li>
                  -  {marker.data.Jun ? "Junio" : null}
                  </li>
                  <li>
                  - {marker.data.Jul ? "Julio" : null}
                  </li>
                  <li>
                  - {marker.data.Ago ? "Agosto" : null}
                  </li>
                  <li>
                  - {marker.data.Sep ? "Septiembre" : null}
                  </li>
                  <li>
                  - {marker.data.Oct ? "Octubre" : null}
                  </li>
                  <li>
                  - {marker.data.Nov ? "Noviembre" : null}
                  </li>
                  <li>
                  - {marker.data.Dic ? "Diciembre" : null}
                  </li>
                </Typography>

                {openEdit ? (
                  <Button
                    fullWidth
                    sx={{ mb: 2 }}
                    variant="outlined"
                    color="warning"
                  >
                    Guardar Cambios
                  </Button>
                ) : null}
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  onClick={() => setOpenEdit(!openEdit)}
                >
                  Editar
                </Button>
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  color="error"
                  sx={{ color: "#e21111" }}
                  onClick={() => console.log("eliminar archivo")}
                >
                  Eliminar
                </Button>
              </Box>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

// ========== COMPONENTES DE DETALLE ==========

const AccionAF = ({ item, byData, mark }) => {
  return (
    <>
      <Divider />
      <p>
        <strong>Institución que atiende:</strong>
        {item.inst_atent}
      </p>
      <p>
        <strong>Sector que atiende (COE):</strong>
        {item.sector_COE}
      </p>
      <Divider />
      <p>
        <strong>Acciones de respuesta </strong> {item.acc_resp}
      </p>

      {item.obs && (
        <>
          <p>
            <strong>Observaciones: </strong>
            {item.obs}
          </p>
        </>
      )}
      {item.detail && (
        <>
          <p>
            <strong>Detalle: </strong>
            {item.detail}
          </p>
        </>
      )}
    </>
  );
};

const RecuMovil = ({ item }) => {
  return (
    <>
      <p>
        <strong>Fecha de movilización:</strong> {item.date_mov}
      </p>
      <p>
        <strong>Institución que atiende:</strong> {item.inst_atent}
      </p>
      <Divider />
      <p>
        <strong># Personal:</strong> {item.n_personal}
      </p>
      <p>
        <strong># Unidades de Emergencia:</strong> {item.n_emerg}
      </p>
      <p>
        <strong># Vehiculos livianos:</strong> {item.n_livianos}
      </p>
      <p>
        <strong># Vehivulos pesados:</strong> {item.n_pesados}
      </p>
      <p>
        <strong># Unidades aereas:</strong> {item.n_aereas}
      </p>
      <p>
        <strong># Otros:</strong> {item.otros}
      </p>
      <p>
        <strong>Observaciones:</strong> {item.obser}
      </p>
    </>
  );
};

const Needs = ({ item }) => {
  return (
    <>
      <Typography>
        Necesidades Identificadas - {item.to_mtt_gt} - {item.state_req}
      </Typography>
      <p>
        <strong>Codigo Requerimiento:</strong> {item.code_req}
      </p>
      <p>
        <strong>Fecha del requerimiento:</strong> {item.date_req}
      </p>
      <p>
        <strong>Codigo Requerimiento:</strong> {item.need}
      </p>

      <Divider />
      <Typography>Acciones de Respuesta - {item.state_requ}</Typography>
      <p>
        <strong>Acciones Implementadas :</strong> {item.acc_implementada}
      </p>

      <p>
        <strong>Observaciones:</strong>
        {item.obs_need}
      </p>
      <Divider />
    </>
  );
};
