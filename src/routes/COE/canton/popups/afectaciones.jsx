import { useCallback } from "react";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Divider } from "@mui/material";
import {  Marker, Popup  } from "react-leaflet";
import { renderToString } from "react-dom/server"; // Importa renderToString
import { divIcon } from "leaflet";

const fieldsMTT4 = [
  { key: "per_damn", label: "Personas damnificadas" },
  { key: "fam_damn", label: "Familias damnificadas" },
  { key: "perf_afect", label: "Personas afectadas directamente" },
  { key: "fam_afect", label: "Familias afectadas directamente" },
  { key: "per_ind", label: "Personas afectadas indirectamente" },
  { key: "fam_ind", label: "Familias afectadas indirectamente" },
  { key: "perd_desp", label: "Personas desplazadas" },
  { key: "fam_despl", label: "Familias desplazadas" },
  { key: "alb_afect", label: "Albergues afectados" },
  { key: "camp_afect", label: "Campamentos afectados" },
  { key: "per_fam", label: "Personas en familias de acogida" },
  { key: "fam_fam", label: "Familias en la modalidad familias de acogida" },
  { key: "per_cam", label: "Personas en campamentos" },
  { key: "fam_camp", label: "Familias en campamentos" },
  { key: "per_ref", label: "Personas en refugios" },
  { key: "fam_ref", label: "Familias en refugios" },
  {
    key: "per_emerg",
    label: "Personas en alquiler para familias en emergencia",
  },
  {
    key: "fami_emerg",
    label: "Familias en alquiler para familias en emergencia",
  },
];

const fieldsMTT1 = [
  {
    key: "porc_app",
    label: "Porcentaje de Servicio de Agua Potable Afectado (%)",
  },
  {
    key: "porc_alc",
    label: "Porcentaje de Servicio de Alcantarillado Afectado (%)",
  },
  { key: "ton_res", label: "Cantidad de residuos peligrosos (Toneladas)" },
  { key: "n_final", label: "N° Sitios de disposición final" },
  {
    key: "inc_for",
    label: "Superficie afectada por incendios forestales o estructurales (ha)",
  },
  { key: "vol_esc", label: "Volumen de escombros y desechos comunes (m³)" },
  { key: "ha_cont", label: "Superficie afectada por contaminantes (ha)" },
  {
    key: "n_planta",
    label: "Número de plantas de tratamiento de agua potable afectadas",
  },
  {
    key: "n_cap",
    label:
      "Número de captaciones de agua cruda para agua potable y abrevadero afectadas",
  },
  { key: "n_tanq", label: "Número de tanqueros para agua disponibles" },
];

const fieldsMTT2 = [];
const fieldsMTT3 = [];
const fieldsMTT5 = [];
const fieldsMTT6 = [];
const fieldsMTT7 = [];
const fieldsGT3 = [];

export const AfectacionesView = ({ afect, parseByField, formatDate, mtt }) => {
    console.log(afect)
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
      </div>
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
        return (
          <Marker key={marker.id} position={marker.position}
          icon={getEventIcon()}
          >
            <Popup>
              <div style={{ maxWidth: "300px" }}>
                <h3 style={{ marginTop: 0, color: "#e21111" }}>
                  {`Afectación - (${marker.data.row})`}
                </h3>
                <h4 style={{ marginTop: 0, color: "#e21111" }}>
                  {marker.data.event || "Evento"}
                </h4>
                <p>
                  <strong>Fecha del evento:</strong>{" "}
                  {formatDate(marker.data.date_event)}
                </p>
                <p>
                  <strong>Última actualización:</strong>{" "}
                  {formatDate(marker.data.date_act)}
                </p>
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
                    <strong>Sector:</strong> {marker.data.sector}
                  </li>
                  <li>
                    <strong>Radio:</strong> {marker.data.radio}
                  </li>
                </ul>

                <Divider />
                {marker.data.desc && (
                  <p>
                    <strong>Descripción:</strong>
                    <br />
                    {marker.data.desc}
                  </p>
                )}
                <Divider />

                {/* Mostrar datos de afectación si existen */}
                <div style={{ marginTop: "10px", fontSize: "0.9em" }}>
                  <p>
                    <strong>Estadísticas:</strong>
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
                                <li key={key} className="disaster-data-item">
                                  <strong>{label}:</strong> {marker.data[key]}
                                </li>
                              ),
                          )
                        : mtt === "MTT3"
                          ? fieldsMTT3.map(
                              ({ key, label }) =>
                                marker.data[key] && (
                                  <li key={key} className="disaster-data-item">
                                    <strong>{label}:</strong> {marker.data[key]}
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
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

