import { useMemo } from "react";

const RenderAfect = ({ afectData }) => {
    
     const renderAfectMarkers = useMemo(() => {
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
                click: () => handleIconClick(item.id),
              }}
            >
              {selectedItem?.id === item.id && (
                <Popup ref={popupElRef}>
                  <Box
                    sx={{
                      height: "60vh",
                      overflowY: "auto",
                      maxWidth: "450px",
                    }}
                  >
                    <Typography align="justify" variant="subtitle1" sx={{}}>
                      {`${item.id} - ${eventType}-       ${selectedItem.date || "Fecha no disponible"}`}
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
                        <p
                          style={{
                            fontSize: "0.8em",
                            color: "#666",
                            textAlign: "center",
                          }}
                        >
                          Haz clic para ampliar
                        </p>
                      </div>
                    )}

                    <Typography align="justify" variant="body2">
                      <strong>Sector:</strong>{" "}
                      {selectedItem.sector || "No disponible"} - (
                      {formatCoords(coords.lat)}, {formatCoords(coords.lng)})
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
                          hidePopup();
                          generarPDF(
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
    user,
    formatCoords,
    getEventIcon,
    handleIconClick,
    extractCoordinates,
    getEventIconPulso,
  ]);
}
