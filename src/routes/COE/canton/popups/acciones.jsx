import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { Divider } from "@mui/material";
import { divIcon } from "leaflet";
import { useCallback } from "react";
import { renderToString } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";

export const AccionesView = ({ acciones, parseByField, formatDate, mtt }) => {
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

  return (
    <>
      {acciones.map((marker) => {
        const byData = parseByField(marker.data.by);
        return (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={getEventIcon(marker.data.estado)}
          >
            <Popup>
              <div style={{ maxWidth: "300px" }}>
                <h3 style={{ marginTop: 0, color: "#e6101b" }}>
                  {`Acciones de respuesta` || "Evento"}
                </h3>
                <h4 style={{ marginTop: 0, color: "#3519d2" }}>
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
                    <strong>Provincia:</strong> {marker.data.prov_atent}
                  </li>
                  <li>
                    <strong>Cantón:</strong> {marker.data.canton_aten}
                  </li>
                  <li>
                    <strong>Parroquia:</strong> {marker.data.parroq_aten}
                  </li>
                  <li>
                    <strong>Sector:</strong> {marker.data.sector}
                  </li>
                </ul>
                <Divider />
                <p>
                  <strong>Sector que atiende (COE):</strong>
                  <br />
                  {marker.data.sector_COE}
                </p>

                {marker.data.obs && (
                  <>
                    <Divider />
                    <p>
                      <strong>Observacions:</strong>
                      {marker.data.obs}
                    </p>
                  </>
                )}
                 {marker.data.detail && (
                  <>
                    <Divider />
                    <p>
                      <strong>Observacions:</strong>
                      {marker.data.detail}
                    </p>
                  </>
                )}
                <Divider />

                {/* Mostrar datos de afectación si existen */}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
