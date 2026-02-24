import { useCallback, useState } from "react";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import {
  Box,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { Marker, Popup } from "react-leaflet";
import { renderToString } from "react-dom/server"; // Importa renderToString
import { divIcon } from "leaflet";
import { generarPDFAfect } from "../pdf/script_pdf_afect";
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


export const AfectacionesView = ({
  afect,
  parseByField,
  formatDate,
  mtt,
  polAfect,
  setTypeInput,
  files,
  ...props
}) => {
  const [openEdit, setOpenEdit] = useState(false);

  const getEventIcon = useCallback(() => {
    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#e21111",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    };

    const html = renderToString(
      <div style={circleStyle}>
        <CircleNotificationsIcon color="#141414" size={14} />
      </div>,
    );

    return divIcon({
      html,
      className: "custom-leaflet-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }, []);

  return (
    <>
      {afect.map((marker) => {
        const byData = parseByField(marker.data.by);
        const event_index = Number(marker.data.row_event); // ej: 5
        const pol_row = polAfect?.find((item) => item.row === event_index);

        return (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={getEventIcon()}
          >
            <Popup options={{ maxWidth: 500, minWidth: 250 }} maxWidth={500}>
              <Box
                sx={{ height: "60vh", overflowY: "auto", maxWidth: "450px" }}
              >
                <h3 style={{ color: "#e21111" }}>
                  {`Afectación - (${marker.data.row})`}
                </h3>
                <h4 style={{ color: "#e21111" }}>
                  {pol_row?.planC} -{" "}
                  {marker.data.event || pol_row?.event || "Evento"}
                </h4>
                {/*  <p>
                  <strong>Descripción General:</strong> {pol_row?.desc_plan}
                </p> */}
                <p>
                  <strong>Fecha del evento:</strong>{" "}
                  {formatDate(marker.data.date_event || pol_row?.date_event)}
                </p>
                <p>
                  <strong>Última actualización:</strong>{" "}
                  {formatDate(marker.data.date_act)}
                </p>
                <Divider />
                {byData && !byData.error && (
                  <>
                    <Divider />
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
                  <strong>Ubicación:</strong> Lat:{" "}
                  {marker.position[0].toFixed(6)}, Lng:{" "}
                  {marker.position[1].toFixed(6)}
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>
                    <strong>Provincia:</strong> {marker.data.provincia}
                  </li>
                  <li>
                    <strong>Cantón:</strong> {marker.data.canton}
                  </li>
                  <li>
                    <strong>Parroquia:</strong> {marker.data.parroq}
                  </li>
                  <li>
                    <strong>Sector:</strong>{" "}
                    {marker.data.sector || pol_row?.sector}
                  </li>
                  <li>
                    <strong>Radio:</strong> {marker.data.radio}
                  </li>
                </ul>
                <Divider />
                {openEdit ? (
                  <>
                    <EditAfect />
                    <Button
                      fullWidth
                      sx={{ mb: 2 }}
                      variant="outlined"
                      color="warning"
                    >
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <>
                    {marker.data.desc && (
                      <p>
                        <strong>Descripción de la afectación:</strong>
                        <br />
                        {marker.data.desc}
                      </p>
                    )}
                    <Divider />

                    {/* Mostrar datos de afectación si existen */}
                    <div style={{ fontSize: "0.9em" }}>
                      <p>
                        <strong>AFectaciones a nivel de {mtt}:</strong>
                      </p>
                      <ul className="disaster-data-list">
                        {mtt === "MTT1"
                          ? fieldsMTT1.map(
                              ({ key, label }) =>
                                marker.data[key] && (
                                  <li key={key} className="disaster-data-item">
                                    <strong>{label}:</strong> {marker.data[key]}
                                  </li>
                                ),
                            )
                          : mtt === "MTT2"
                            ? fieldsMTT2.map(
                                ({ key, label }) =>
                                  marker.data[key] && (
                                    <li
                                      key={key}
                                      className="disaster-data-item"
                                    >
                                      <strong>{label}:</strong>{" "}
                                      {marker.data[key]}
                                    </li>
                                  ),
                              )
                            : mtt === "MTT3"
                              ? fieldsMTT3.map(
                                  ({ key, label }) =>
                                    marker.data[key] && (
                                      <li
                                        key={key}
                                        className="disaster-data-item"
                                      >
                                        <strong>{label}:</strong>{" "}
                                        {marker.data[key]}
                                      </li>
                                    ),
                                )
                              : mtt === "MTT4"
                                ? fieldsMTT4.map(
                                    ({ key, label }) =>
                                      marker.data[key] && (
                                        <li
                                          key={key}
                                          className="disaster-data-item"
                                        >
                                          <strong>{label}:</strong>{" "}
                                          {marker.data[key]}
                                        </li>
                                      ),
                                  )
                                : mtt === "MTT6"
                                  ? fieldsMTT5.map(
                                      ({ key, label }) =>
                                        marker.data[key] && (
                                          <li
                                            key={key}
                                            className="disaster-data-item"
                                          >
                                            <strong>{label}:</strong>{" "}
                                            {marker.data[key]}
                                          </li>
                                        ),
                                    )
                                  : mtt === "MTT6"
                                    ? fieldsMTT6.map(
                                        ({ key, label }) =>
                                          marker.data[key] && (
                                            <li
                                              key={key}
                                              className="disaster-data-item"
                                            >
                                              <strong>{label}:</strong>{" "}
                                              {marker.data[key]}
                                            </li>
                                          ),
                                      )
                                    : mtt === "MTT7"
                                      ? fieldsMTT7.map(
                                          ({ key, label }) =>
                                            marker.data[key] && (
                                              <li
                                                key={key}
                                                className="disaster-data-item"
                                              >
                                                <strong>{label}:</strong>{" "}
                                                {marker.data[key]}
                                              </li>
                                            ),
                                        )
                                      : fieldsGT3.map(
                                          ({ key, label }) =>
                                            marker.data[key] && (
                                              <li
                                                key={key}
                                                className="disaster-data-item"
                                              >
                                                <strong>{label}:</strong>{" "}
                                                {marker.data[key]}
                                              </li>
                                            ),
                                        )}
                      </ul>
                    </div>
                  </>
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    props.setOpenDialog(true);
                  }}
                >
                  Registro
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  onClick={() =>
                    generarPDFAfect(
                      marker.data.event,
                      marker.position[0],
                      marker.position[1],
                      marker.data,
                      byData,
                      pol_row,
                      mtt,
                      files,
                    )
                  }
                >
                  PDF
                </Button>
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

const EditAfect = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Aqu iva la informacion que planteamos{" "}
      </Typography>
    </>
  );
};
