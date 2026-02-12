import HandymanIcon from "@mui/icons-material/Handyman";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { mt } from "date-fns/locale";
import { divIcon } from "leaflet";
import { useCallback, useState } from "react";
import { renderToString } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";

export const RequireView = ({
  recursos: requere,
  parseByField,
  formatDate,
  mtt,
}) => {
  const memberData = localStorage.getItem("memberD");
  const [formData, setFormData] = useState({
    code_req_atent: "",
    acc_impl_atent: "",
    state_req_atent: "",
    obs_atent: "",
  });
  const [editS, setEditS] = useState(false);
  const accionIcon = ({ color }) => {
    return color === "Atendido"
      ? "#2fbb36"
      : color === "pendiente"
        ? "#312fbb"
        : color === "En proceso"
          ? "#b9bb2f"
          : color === "No atendido"
            ? "#ec0e19"
            : color === "Insubsistente"
              ? "#949393"
              : "#ec790e";
  };

  // editar recurso
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getEventIcon = useCallback((color) => {
    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: accionIcon(color),
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    };
    const html = renderToString(
      <div style={circleStyle}>
        <HandymanIcon color={"#000000"} size={14} />
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
      {requere.map((marker) => {
        const byData = parseByField(marker.data.by);
        return (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={getEventIcon(marker.data.est_req_band)}
          >
            
              <Popup>
                <Box sx={{ height: "60vh", overflowY: "auto" }}>
                <div style={{ maxWidth: "300px" }}>
                  <h3 style={{ marginTop: 0, color: "#10e61b" }}>
                    {`${marker.data.row} - Requerimiento - ${marker.data.code_req_band}`}
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
                    <strong>necesidad:</strong> <br />
                    {marker.data.need_band}
                  </p>
                  <Divider />
                  {editS ? (
                    <EditRecursos
                      marker={marker}
                      formData={formData}
                      handleChange={handleChange}
                    />
                  ) : (
                    <>
                      <p>
                        <strong>Acciones a implementar :</strong>
                      </p>
                      <ul style={{ paddingLeft: "20px" }}>
                        <li>
                          <strong>Acción implementadas:</strong>{" "}
                          {marker.data.acc_impl_atent}
                        </li>
                        <li>
                          <strong>Estado actual del requerimiento:</strong>{" "}
                          {marker.data.state_req_atent}
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
                    </>
                  )}

                  <Divider />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="warning"
                      onClick={() => console.log("eliminar archivo")}
                    >
                      PDF
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setEditS(!editS)}
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
                  {/* Mostrar datos de afectación si existen */}
                </div>
              </Box></Popup>
            
          </Marker>
        );
      })}
    </>
  );
};

const EditRecursos = ({ marker, formData = {}, handleChange }) => {
  const campos = [
    { name: "acc_impl_atent", label: "Acciones a Implementar", type: "text" },
    {
      name: "state_req_atent",
      label: "Estado actual del requerimiento",
      type: "select",
      options: [
        "Atendido",
        "pendiente",
        "En proceso",
        "No atendido",
        "Traslado de requerimiento a GT1",        
        "Traslado de requerimiento a GT2",        
        "Traslado de requerimiento a MTT1",       
        "Traslado de requerimiento a MTT2",       
        "Traslado de requerimiento a MTT3",       
        "Traslado de requerimiento a MTT4",       
        "Traslado de requerimiento a MTT5",       
        "Traslado de requerimiento a MTT6",       
        "Traslado de requerimiento a MTT7",
      ],
    },
    { name: "obs_atent", label: "Observaciones", type: "text" },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Responder Requerimiento
      </Typography>

      {campos.map(({ name, label, type, options }) => (
        <TextField
          key={name}
          fullWidth
          type={type}
          sx={{ mb: 1 }}
          name={name}
          value={formData[name] || marker?.data?.[name] || ""}
          onChange={handleChange}
          label={label}
          multiline={name === "obs_atent" || name === "acc_impl_atent"}
          rows={name === "obs_atent" || name === "acc_impl_atent" ? 3 : 1}
          variant="outlined"
        >
          {type === "select" &&
            options.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
        </TextField>
      ))}
      <Button fullWidth sx={{ mb: 2 }} variant="outlined" color="warning">
        Guardar Cambios
      </Button>
    </Box>
  );
};
