import React from "react";
import { GeoJSON, Popup } from "react-leaflet";
import { Box, Button, Divider, Typography } from "@mui/material";
import { generarPDFEvent } from "../../pdf/script_pdf_event";

export const PolEventView = ({ polygon, formatDate, mtt, files, ...props }) => {
  // Función para determinar el estilo según la alerta
  const getStyle = (alerta) => {
    const colors = {
      roja: "#e6101b",
      naranja: "#ff8c00",
      amarilla: "#ffff00",
      verde: "#228b22",
    };

    return {
      fillColor: colors[alerta?.toLowerCase()] || "#3519d2",
      weight: 3,
      opacity: 2,
      color: "white",
      dashArray: "5",
      fillOpacity: 0.5,
    };
  };

  return (
    <>
      {polygon &&
        Array.isArray(polygon) &&
        polygon.map((item, index) => {
          let geoJsonData = null;
          const afectFilter = props.afect?.filter(
            (afect) => Number(afect?.data.row_event) === item.row,
          );
          const accFilter = props.acciones?.filter(
            (afect) => Number(afect?.data.event_row) === item.row,
          );
          let coords = null;
          if (typeof item.ubi === "string") {
            const cleanStr = item.ubi.replace(/[\[\]\s]/g, "");
            const parts = cleanStr.split(",");
            if (parts.length >= 2) {
              const lat = parseFloat(parts[0]);
              const lng = parseFloat(parts[1]);
              if (!isNaN(lat) && !isNaN(lng)) coords = [lat, lng];
            }
          } else if (Array.isArray(item.ubi)) {
            coords = item.ubi;
          }
          console.log(item.ubi);
          try {
            if (typeof item.Poligono === "string") {
              // El parseo maneja automáticamente los \r\n
              geoJsonData = JSON.parse(item.Poligono);
            } else {
              geoJsonData = item.Poligono;
            }
          } catch (error) {
            console.error("Error parseando GeoJSON:", error);
            return null;
          }

          if (!geoJsonData) return null;
          if (item.estado == "Finalizado") return null;
          return (
            <GeoJSON
              key={`poly-${item.id || index}`}
              data={geoJsonData}
              style={() => getStyle(item.alerta)}
            >
              <Popup options={{ maxWidth: 500, minWidth: 250 }} maxWidth={500}>
                <Box
                  style={{ minWidth: "200px" }}
                  sx={{ height: "60vh", overflowY: "auto", maxWidth: "450px" }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      color: "#e6101b",
                      textTransform: "uppercase",
                      fontSize: "1.1rem",
                    }}
                  >
                    {item.event || "Evento"} - {item.row}
                  </h3>
                  <Typography
                    variant="body2"
                    sx={{ color: "#3519d2", fontWeight: "bold" }}
                  >
                    Estado: {item.estado} | Alerta: {item.alerta}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography style={{ margin: "4px 0" }}>
                    <strong>Sector:</strong> {item.sector}
                  </Typography>
                  <Typography style={{ margin: "4px 0" }}>
                    <strong>Fecha de registro:</strong>{" "}
                    {formatDate(item.date_event)}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography
                    align="justify"
                    style={{
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                      margin: 0,
                    }}
                  >
                    <strong>Descripción:</strong> {item.desc_plan}
                  </Typography>
                </Box>

                <Box sx={{ pt: 2, display: "flex", gap: 2 }}>
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
                      generarPDFEvent(
                        "evento",
                        afectFilter,
                        accFilter,
                        coords,                      
                        item,
                        mtt,
                        files,
                      )
                    }
                  >
                    PDF
                  </Button>
                </Box>
              </Popup>
            </GeoJSON>
          );
        })}
    </>
  );
};
