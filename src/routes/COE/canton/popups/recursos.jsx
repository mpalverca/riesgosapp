
import HandymanIcon from '@mui/icons-material/Handyman';
import { Button, Divider } from "@mui/material";
import { divIcon } from "leaflet";
import { useCallback } from "react";
import { renderToString } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";

export const RequireView = ({ recursos, parseByField, formatDate, mtt }) => {

  const getEventIcon = useCallback((color) => {
    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:  "#0fdf3c" ,
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    };
    const html = renderToString(
      <div style={circleStyle}>
        <HandymanIcon
          color={ "#000000"}
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
      {recursos.map((marker) => {
        const byData = parseByField(marker.data.by);
        return (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={getEventIcon(marker.data.estado)}
          >
            <Popup>
              <div style={{ maxWidth: "300px" }}>
                <h3 style={{ marginTop: 0, color: "#10e61b" }}>
                  {`${marker.data.row} - Requerimiento - ${marker.data.to_mtt_bamd}`}
                </h3>                
                <p>
                  <strong>Fecha Movilización:</strong>{" "}
                  {formatDate(marker.data.date_req_band)}
                </p>
                <p>
                  <strong>Estado del requerimiento:</strong>{" "}
                  {marker.data.est_req_band}
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
                <Divider />
                 <p>
                  <strong>necesidad:</strong> <br/>
                   {marker.data.need_band}
                </p>
                 <Divider />
                 <p>
                  <strong>Acciones a implementar :</strong> 
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>
                    <strong>Acción implementadas:</strong> {marker.data.acc_impl_atent}
                  </li>
                  <li>
                    <strong>Estado actual del requerimiento:</strong> {marker.data.state_req_atent}
                  </li>     
                  <li>
                    <strong>Observaciones</strong> {marker.data.obs_atent}
                  </li>
                               
                </ul>

                {marker.data.obs && (
                  <>
                    <Divider />
                    <p>
                      <strong>Observacions:</strong>
                      {marker.data.obs}
                    </p>
                  </>
                )}
                
                <Divider />
<Button
fullWidth
>Editar</Button>
                {/* Mostrar datos de afectación si existen */}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
