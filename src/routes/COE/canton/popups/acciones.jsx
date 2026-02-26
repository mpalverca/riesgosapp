import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Button, Divider, Tab, Typography } from "@mui/material";
import { divIcon } from "leaflet";
import { useCallback, useState } from "react";
import { renderToString } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { generarPDFAccions } from "../pdf/script_pdf_accions";

export const AccionesView = ({
  acciones,
  parseByField,
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
  const getEventIcon = useCallback((color) => {
    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: color === "Vigente" ? "#602fbb" : "#949393",
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

  return (
    <>
      {acciones.map((marker) => {
        const byData = parseByField(marker.data.by);
        const event_index = Number(marker.data.event_row); // ej: 5
        const pol_row = polAfect?.find((item) => item.row === event_index);
        return (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={getEventIcon(marker.data.estado)}
          >
            <Popup options={{ maxWidth: 300, minWidth: 250 }} maxWidth={500}>
              <Box
                sx={{ height: "60vh", overflowY: "auto", maxWidth: "4700px" }}
              >
                <h3 style={{ marginTop: 0, color: "#e6101b" }}>
                  {`Acciones de respuesta` || "Evento"}
                </h3>
                <h4 style={{ color: "#3519d2" }}>
                  {` ${marker.data.event}-${marker.data.estado}` || "Evento"}
                </h4>
                <p>
                  <strong>Fecha del evento:</strong>{" "}
                  {formatDate(marker.data.date_event)}
                </p>
                <p>
                  <strong>Última actualización:</strong>{" "}
                  {formatDate(marker.data.date_act)}
                </p>

                <TabContext value={value}>
                  <Box
                    sx={{
                      borderBottom: 2,
                      borderColor: "divider",
                      color: "#228b22",
                    }}
                  >
                    <TabList onChange={handleChange} aria-label="COE tabs">
                      <Tab label="Acciones" value="1" />
                      <Tab label="Recursos" value="2" />
                      <Tab label="Necesidades" value="3" />
                    </TabList>
                  </Box>

                  <TabPanel value="1">
                    {openEdit ? (
                      <Typography>Abrio editor </Typography>
                    ) : (
                      <AccionAF
                        item={marker.data}
                        byData={byData}
                        formatDate={formatDate}
                        mark={marker.position}
                      />
                    )}
                  </TabPanel>
                  <TabPanel value="2">
                    {openEdit ? (
                      <Typography>Abrio editor </Typography>
                    ) : (
                      <RecuMovil item={marker.data} />
                    )}
                  </TabPanel>
                  <TabPanel value="3">
                    {openEdit ? (
                      <Typography>Abrio editor </Typography>
                    ) : (
                      <Needs item={marker.data} />
                    )}
                  </TabPanel>
                </TabContext>

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
                {/* Mostrar datos de afectación si existen */}
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
              {/*   <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => props.setOpenDialog(true)}
                >
                  Registro 
                </Button> */}
                {/* <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  onClick={() => {
                    setTypeInput("Acciones");
                    generarPDFAccions(
                      marker.data.event,
                      marker.position[0],
                      marker.position[1],
                      marker.data,
                      byData,
                      pol_row,
                      mtt,
                      files,
                    )
                  }}
                >
                  PDF
                </Button> */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setOpenEdit(!openEdit)}
                >
                  Editar
                </Button>
                <Button
                  fullWidth
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

const AccionAF = ({ item, byData, mark }) => {
  return (
    <>
      {byData && !byData.error && (
        <>
          <p>
            <strong>Reportado por:</strong>
          </p>
          <ul style={{ paddingLeft: "20px" }}>
            <li>
              <strong>Nombre:</strong> {byData.name}
            </li>
            <li>
              <strong>Cargo:</strong> {byData.cargo}
            </li>
            <li>
              <strong>CI:</strong> {byData.ci}
            </li>
            {byData.contact && (
              <li>
                <strong>Contacto:</strong> {byData.contact}
              </li>
            )}
          </ul>
        </>
      )}
      <Divider />
      <p>
        <strong>Ubicación:</strong> Lat: {mark[0].toFixed(6)}, Lng:{" "}
        {mark[1].toFixed(6)}
      </p>
      <ul style={{ paddingLeft: "20px" }}>
        <li>
          <strong>Provincia:</strong> {item.prov_atent}
        </li>
        <li>
          <strong>Cantón:</strong> {item.canton_aten}
        </li>
        <li>
          <strong>Parroquia:</strong> {item.parroq_aten}
        </li>
        <li>
          <strong>Sector:</strong> {item.sector}
        </li>
      </ul>
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
            <strong>Observacions: </strong>
            {item.obs}
          </p>
        </>
      )}
      {item.detail && (
        <>
          <p>
            <strong>Observacions: </strong>
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
      <Typography>Necesidades Identificadas - {item.to_mtt_gt} </Typography>
      <p>
        <strong>Codigo Requerimiento:</strong> {item.code_req}
      </p>
      <p>
        <strong>Fecha del requerimiento:</strong> {item.date_req}
      </p>
      <p>
        <strong>Codigo Requerimiento:</strong> {item.need}
      </p>
      <p>
        <strong>Estado nececidad:</strong> {item.state_req}
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
