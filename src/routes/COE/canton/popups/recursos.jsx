
import HandymanIcon from '@mui/icons-material/Handyman';
import { Divider } from "@mui/material";
import { divIcon } from "leaflet";
import { useCallback } from "react";
import { renderToString } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";

export const RecursosView = ({ recursos, parseByField, formatDate, mtt }) => {
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
                  {`Recursos Utilizados`}
                </h3>                
                <p>
                  <strong>Fecha Movilización:</strong>{" "}
                  {formatDate(marker.data.date_mov)}
                </p>
                <p>
                  <strong>Institución que atiende:</strong>{" "}
                  {marker.data.inst_atie}
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
                    <strong>Provincia:</strong> {marker.data.prov}
                  </li>
                  <li>
                    <strong>Cantón:</strong> {marker.data.canton}
                  </li>                 
                </ul>
                <Divider />
                 <p>
                  <strong>Recursos Utilizados:</strong> 
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>
                    <strong># Personal:</strong> {marker.data.n_ersonal}
                  </li>
                  <li>
                    <strong># Unidades de Emergencia:</strong> {marker.data.u_emerg}
                  </li>     
                  <li>
                    <strong># Vehículos livianos:</strong> {marker.data.n_livianos}
                  </li>
                  <li>
                    <strong># Vehículos Pesados:</strong> {marker.data.n_pesados}
                  </li>
                  <li>
                    <strong># Otros:</strong> {marker.data.otros}
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

                {/* Mostrar datos de afectación si existen */}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
