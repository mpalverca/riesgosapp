// src/components/maps/components/AfectMarkers.jsx
import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { Box, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { extractCoordinates } from "../../../utils/utils";

const ExpandedImageModal = ({ src, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "20px",
    }}
    onClick={onClose}
    role="dialog"
    aria-label="Imagen expandida"
  >
    <div
      style={{
        maxWidth: "90%",
        maxHeight: "90%",
        position: "relative",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={src}
        alt="Imagen expandida"
        style={{
          maxWidth: "100%",
          maxHeight: "90vh",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "-15px",
          right: "-15px",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          fontSize: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Cerrar imagen"
      >
        ×
      </button>
    </div>
  </div>
);

const AfectMarkers = ({
  afectData = [],
  selectedItem,
  onItemClick,
  onGeneratePDF,

  getEventIcon,
  getEventIconPulso,
  COLOR_PRIORIDAD,
  user,
  printToPDF,
}) => {
  const [expandedImage, setExpandedImage] = React.useState(null);

  const renderMarkers = useMemo(() => {
    return afectData
      .map((item, index) => {
        try {
          if (!item?.geom) {
            console.warn("Item sin geometría:", item);
            return null;
          }

          const coords = extractCoordinates?.(item.geom);
          if (
            !coords ||
            typeof coords.lat !== "number" ||
            typeof coords.lng !== "number"
          ) {
            console.warn("Coordenadas inválidas para el item:", item);
            return null;
          }

          const eventType = item.event || "default";
          const priority = item.prioridad || "DEFAULT";

          return (
            <Marker
              key={`marker-${item.id || `index-${index}`}`}
              position={[coords.lat, coords.lng]}
              icon={
                item.radio > 0 &&
                priority === "Alta" &&
                item.estado === "Pendiente"
                  ? getEventIconPulso(eventType, priority, item.radio)
                  : getEventIcon(eventType, priority)
              }
              eventHandlers={{
                click: () => onItemClick(item.id),
              }}
            >
              {selectedItem?.id === item.id && (
                <Popup>
                  <Box
                    sx={{
                      height: "60vh",
                      overflowY: "auto",
                      maxWidth: "450px",
                    }}
                  >
                    <Typography align="justify" variant="subtitle1">
                      {`${item.id} - ${eventType} - ${selectedItem.date || "Fecha no disponible"}`}
                    </Typography>

                    {selectedItem.anex_foto && (
                      <div style={{ marginTop: "10px" }}>
                        <img
                          src={selectedItem.anex_foto}
                          alt={`Imagen de ${selectedItem.nombre || "afectación"}`}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "200px",
                            objectFit: "contain",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setExpandedImage(selectedItem.anex_foto)
                          }
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: "center",
                            color: "#666",
                          }}
                        >
                          Haz clic para ampliar
                        </Typography>
                      </div>
                    )}

                    <Typography align="justify" variant="body2">
                      <strong>Sector:</strong>{" "}
                      {selectedItem.sector || "No disponible"} - (
                      {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)})
                    </Typography>
                    <Typography align="justify" variant="body2">
                      <strong>Prioridad:</strong>
                      <span
                        style={{
                          color:
                            COLOR_PRIORIDAD[priority] ||
                            COLOR_PRIORIDAD.DEFAULT,
                        }}
                      >
                        {" "}
                        {priority}
                      </span>
                    </Typography>
                    {selectedItem.descripcio && (
                      <Typography align="justify" variant="body2">
                        <strong>Descripción:</strong>{" "}
                        {selectedItem.descripcio.substring(0, 150) + "..."}
                      </Typography>
                    )}
                    {user && (
                      <Button
                        onClick={() => {
                          onGeneratePDF(
                            selectedItem.event,
                            coords.lat,
                            coords.lng,
                            selectedItem,
                            user,
                            printToPDF,
                          );
                        }}
                        fullWidth
                        sx={{
                          background:
                            "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
                          marginTop: "16px",
                          fontWeight: "bold",
                        }}
                        variant="contained"
                      >
                        Generar Reporte PDF
                      </Button>
                    )}
                  </Box>
                </Popup>
              )}
            </Marker>
          );
        } catch (error) {
          console.error("Error al renderizar marcador:", item, error);
          return null;
        }
      })
      .filter(Boolean);
  }, [
    afectData,
    selectedItem,
    onItemClick,
    extractCoordinates,
    getEventIcon,
    getEventIconPulso,

    COLOR_PRIORIDAD,
    user,
    onGeneratePDF,
    printToPDF,
  ]);

  return (
    <>
      {renderMarkers}
      {expandedImage && (
        <ExpandedImageModal
          src={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      )}
    </>
  );
};

AfectMarkers.propTypes = {
  afectData: PropTypes.array,
  selectedItem: PropTypes.object,
  onItemClick: PropTypes.func.isRequired,
  onGeneratePDF: PropTypes.func.isRequired,
  
  getEventIcon: PropTypes.func.isRequired,
  getEventIconPulso: PropTypes.func.isRequired,
  COLOR_PRIORIDAD: PropTypes.object,
  user: PropTypes.object,
  printToPDF: PropTypes.func,
};

export default React.memo(AfectMarkers);
