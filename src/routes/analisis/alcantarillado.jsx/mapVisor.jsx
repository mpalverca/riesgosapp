import React, { useCallback, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
  LinearProgress,
  Alert,
} from "@mui/material";
import L from "leaflet";

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// ============ FUNCIONES UTILITARIAS ============

// Parsear coordenadas desde string o array
const parseCoordinates = (geometry) => {
  if (!geometry) return null;

  // Si es string con formato "lat,lng,lat,lng"
  if (typeof geometry === "string") {
    const values = geometry.split(",").map(Number);
    const coords = [];
    for (let i = 0; i < values.length; i += 2) {
      if (i + 1 < values.length && !isNaN(values[i]) && !isNaN(values[i + 1])) {
        coords.push([values[i], values[i + 1]]);
      }
    }
    return coords.length ? coords : null;
  }

  // Si es array, retornar directamente
  if (Array.isArray(geometry)) return geometry;

  return null;
};

// Obtener color según porcentaje
const getColorByPercentage = (porcentaje) => {
  if (porcentaje === 0) return "#4caf50";
  if (porcentaje >= 70) return "#f44336";
  if (porcentaje >= 40) return "#ff9800";
  return "#ffeb3b";
};

// Obtener color de estado
const getStatusColor = (total) => {
  if (total === 0) return "success";
  if (total >= 70) return "error";
  if (total >= 40) return "warning";
  return "info";
};

// Obtener texto de estado
const getStatusText = (total) => {
  if (total === 0) return "Óptimo";
  if (total >= 70) return "Crítico";
  if (total >= 40) return "Atención media";
  if (total > 0) return "Monitoreo";
  return "Sin datos";
};

// Crear icono para marcador
const getMarkerIcon = (tipo, total) => {
  if (tipo === "pozo") {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background:#2196f3;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [18, 18],
      popupAnchor: [0, -9],
    });
  }

  if (tipo === "sumidero") {
    const color = getColorByPercentage(total || 0);
    const size = (total || 0) >= 70 ? 20 : 16;
    const pulse = (total || 0) >= 70 ? "animation:pulse 1.5s infinite;" : "";

    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);${pulse}cursor:pointer;transition:all 0.3s ease;"></div>`,
      iconSize: [size + 4, size + 4],
      popupAnchor: [0, -(size / 2)],
    });
  }

  return null;
};

// Parsear detalle (objeto con información)
const parseDetalle = (detalle) => {
  if (!detalle) return {};

  // Si ya es un objeto, retornarlo
  if (typeof detalle === "object") return detalle;

  // Si es string con formato "clave=valor,clave=valor"
  if (typeof detalle === "string") {
    try {
      // Intentar parsear como JSON primero
      return JSON.parse(detalle);
    } catch {
      // Si falla, parsear como clave=valor
      const result = {};
      const pairs = detalle.split(",");

      pairs.forEach((pair) => {
        const [key, ...valueParts] = pair.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim();
          // Intentar convertir a número si es posible
          const numValue = parseFloat(value);
          result[key.trim()] = !isNaN(numValue) ? numValue : value;
        }
      });

      return result;
    }
  }

  return {};
};
//========sectores====

// ============ COMPONENTE PRINCIPAL ============
const COLORS = {
  BAJA: "#28a745",
  MEDIA: "#ffc107",
  ALTA: "#ff0000",
  SELECTED: "#3538dc",
  DEFAULT: "#a9a9a9",
};
const MapView = ({  dataObj = [], ...props }) => {
  const safeData = useMemo(() => (Array.isArray(dataObj) ? dataObj : []), [dataObj]);
  const normalizeText = useCallback(
      (text) =>
        text
          ?.trim()
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, " ") || "",
      [],
    );
    const getColor = useCallback((total) => {
      const t = total || 0;
      return t <= 3.9 ? COLORS.BAJA : t <= 6.9 ? COLORS.MEDIA : COLORS.ALTA;
    }, []);

  const sectorPolygons = useMemo(() => {
    if (!props.data?.length) return null;
    const sectorMap = new Map();
    props.seletedInfo?.resultados?.forEach((r) => {
      if (r.sector) sectorMap.set(normalizeText(r.sector), r);
    });

    return props.data
      .flatMap((item, idx) => {
        if (!item?.geometry?.coordinates) return null;
        const props_ = item.properties || {};
        const name = props_.SECTOR || props_.sector || "";
        const matched = sectorMap.get(normalizeText(name));
        const isSelected = props_.BARRIO === props.selectedParroq;

        const color = matched
          ? getColor(matched.total)
          : isSelected
            ? COLORS.SELECTED
            : COLORS.DEFAULT;
        const style = {
          color,
          fillColor: color,
          fillOpacity: matched ? 0.6 : isSelected ? 0.5 : 0.2,
          weight: matched || isSelected ? 3 : 1.5,
          opacity: 0.9,
        };

        const coords = item.geometry.coordinates;
        let polygons = [];
        if (item.geometry.type === "MultiPolygon") polygons = coords;
        else if (item.geometry.type === "Polygon") polygons = [coords];
        else polygons = [coords];

        return polygons.map((poly, i) => {
          const ring = poly[0] || poly;
          if (!ring?.length) return null;
          const leafletCoords = ring.map((c) => [c[1], c[0]]);

          return (
            <Polygon
              key={`${idx}-${i}`}
              positions={leafletCoords}
              pathOptions={style}
              eventHandlers={{
                click: () => props.onGetParroqData?.(props_.BARRIO),
                mouseover: (e) =>
                  e.target.setStyle({ fillOpacity: 0.8, weight: 4 }),
                mouseout: (e) => e.target.setStyle(style),
              }}
            >
              <Popup>
                <div style={{ minWidth: 250 }}>
                  <h4 style={{ color: "#1976d2" }}>{name || "Sector"}</h4>
                  <p>
                    <strong>Parroquia:</strong> {props_.PARROQUIA || "N/A"}
                  </p>
                  <p>
                    <strong>Barrio:</strong> {props_.BARRIO || "N/A"}
                  </p>
                  {matched && (
                    <>
                      <hr />
                      <p>
                        <strong>Puntaje:</strong>{" "}
                        <span style={{ color, fontWeight: "bold" }}>
                          {matched.total}
                        </span>
                      </p>
                      <p>
                        <strong>Estado:</strong> {matched.estado || "N/A"}
                      </p>
                    </>
                  )}
                </div>
              </Popup>
            </Polygon>
          );
        });
      })
      .filter(Boolean);
  }, [
    props.data,
    props.seletedInfo,
    props.selectedParroq,
    props.onGetParroqData,
    normalizeText,
    getColor,
  ]);
  // Procesar elementos con geometría
  const processedData = useMemo(() => {
    return safeData
      .map((item) => {
        const coords = parseCoordinates(item.geometry);
        if (!coords || coords.length === 0) return null;

        const detalle = parseDetalle(item.detail);

        return {
          ...item,
          coords,
          detalle,
          // Extraer valores del detalle
          //total: detalle.total !== undefined ? Number(detalle.total) : 0,
          //tipo_mat: detalle.tipo_mat || item.tipo_material || '',
          //capacidad: detalle.cap || item.capacidad || '',
          //dimenciones: detalle.dimx && detalle.dimy ? `${detalle.dimx}x${detalle.dimy}` : '',
          // prof: detalle.prof || item.altitude_i || '',
        };
      })
      .filter(Boolean);
  }, [safeData]);

  // Filtrar por tipo
  const markers = useMemo(
    () =>
      processedData.filter(
        (item) => item.tipo === "pozo" || item.tipo === "sumidero",
      ),
    [processedData],
  );

  const tuberias = useMemo(
    () => processedData.filter((item) => item.tipo === "tuberia"),
    [processedData],
  );

  // Estadísticas de obstrucción
  const obstructionStats = useMemo(() => {
    const sumideros = markers.filter((m) => m.tipo === "sumidero");
    if (sumideros.length === 0) return null;

    const critical = sumideros.filter((m) => m.detalle.obs*10 >= 70).length;
    const medium = sumideros.filter(
      (m) => m.detalle.obs*10 >= 40 && m.detalle.obs*10 < 70,
    ).length;
    const low = sumideros.filter((m) => m.detalle.obs*10 < 40 && m.detalle.obs*10 > 0).length;
    const optimal = sumideros.filter((m) => m.detalle.obs*10=== 0).length;

    return { critical, medium, low, optimal, total: sumideros.length };
  }, [markers]);

  // Centro del mapa
  const center = useMemo(() => {
    const valid = markers.filter((m) => m.coords && m.coords.length === 1);
    if (valid.length === 0) return [-3.995999, -79.201798];

    const latSum = valid.reduce((acc, m) => acc + m.coords[0][0], 0);
    const lngSum = valid.reduce((acc, m) => acc + m.coords[0][1], 0);
    return [latSum / valid.length, lngSum / valid.length];
  }, [markers]);

  // ============ RENDER ============

  return (
    <Box //display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}
    >
      {/* Panel lateral - Solo resumen de sumideros */}
      <Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📋 Resumen de Sumideros
            </Typography>

            {obstructionStats ? (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <Chip
                  icon={<span>🟢</span>}
                  label={`Óptimo: ${obstructionStats.optimal}`}
                  size="small"
                  sx={{
                    bgcolor: "#4caf50",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />

                <Chip
                  icon={<span>🟡</span>}
                  label={`Baja: ${obstructionStats.low}`}
                  size="small"
                  sx={{ bgcolor: "#ffeb3b", fontWeight: "bold" }}
                />

                <Chip
                  icon={<span>🟠</span>}
                  label={`Media: ${obstructionStats.medium}`}
                  size="small"
                  sx={{
                    bgcolor: "#ff9800",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />

                <Chip
                  icon={<span>🔴</span>}
                  label={`Crítico: ${obstructionStats.critical}`}
                  size="small"
                  sx={{
                    bgcolor: "#f44336",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />

                <Chip
                  label={`Total: ${obstructionStats.total}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ p: 2, textAlign: "center" }}
              >
                No hay datos de sumideros disponibles
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
      <Box flex={1} minHeight={500}>
        {obstructionStats?.critical > 0 && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1000,
            }}
          >
            ⚠️ {obstructionStats.critical} sumidero(s) con obstrucción crítica
            (&gt;70%)
          </Alert>
        )}

        <MapContainer
          center={center}
          zoom={14}
          style={{ width: "100%", height: "100%", minHeight: "500px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Tuberías y polígonos */}
          {tuberias.map((item, idx) => {
            if (!item.coords || item.coords.length < 2) return null;
            // Si son más de 2 puntos, es un polígono
            if (item.coords.length > 2) {
              return (
                <Polygon
                  key={`tuberia-${idx}`}
                  positions={item.coords}
                  color="#2196f3"
                  fillColor="#2196f3"
                  fillOpacity={0.1}
                  weight={2}
                >
                  <Popup>
                    <Typography variant="subtitle2" fontWeight="bold">
                      📏 Tubería
                    </Typography>
                    <Typography variant="body2">
                      <strong>Material:</strong> {item.tipo_mat || "N/E"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Capacidad:</strong> {item.capacidad || "N/E"} L
                    </Typography>
                    <Typography variant="body2">
                      <strong>Dimensiones:</strong> {item.dimenciones || "N/E"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total:</strong> {item.total || 0}%
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1, color: "text.secondary" }}
                    >
                      📅 {item.date || "Fecha no registrada"}
                    </Typography>
                  </Popup>
                </Polygon>
              );
            }

            // Si son 2 puntos, es una línea
            return (
              <Polyline
                key={`tuberia-${idx}`}
                positions={item.coords}
                color="#2196f3"
                weight={3}
                opacity={0.7}
              >
                <Popup>
                  <Typography variant="subtitle2" fontWeight="bold">
                    📏 Tubería
                  </Typography>
                  <Typography variant="body2">
                    <strong>Material:</strong> {item.tipo_mat || "N/E"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Capacidad:</strong> {item.capacidad || "N/E"} L
                  </Typography>
                  <Typography variant="body2">
                    <strong>Dimensiones:</strong> {item.dimenciones || "N/E"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total:</strong> {item.total || 0}%
                  </Typography>
                </Popup>
              </Polyline>
            );
          })}

          {/* Marcadores */}
          {markers.map((item, idx) => {
            if (!item.coords || item.coords.length === 0) return null;

            const position = item.coords[0];
            const icon = getMarkerIcon(item.tipo, item.detalle.obs*10);
            if (!icon) return null;

            const isSumidero = item.tipo === "sumidero";
            //console.log(position)
 console.log(item)
            return (
              <Marker
                key={`${item.tipo}-${idx}`}
                position={position}
                icon={icon}
               
              >
                <Popup>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {item.rowId} - {item.tipo === "pozo" ? "💧 Pozo" : "🚰 Sumidero"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nombre:</strong>{" "}
                    {item.nombre || item.label || "Sin nombre"}
                  </Typography>

                  {isSumidero && (
                    <>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Obstrucción:</strong> {item.detalle.obs*10}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.total}
                        sx={{
                          mt: 1,
                          height: 10,
                          borderRadius: 5,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: getColorByPercentage(item.total),
                            borderRadius: 5,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {item.total === 0
                          ? "✓ Óptimo"
                          : item.total >= 70
                            ? "⚠ Crítico"
                            : item.total >= 40
                              ? "◔ Atención media"
                              : "◔ Atención baja"}
                      </Typography>
                    </>
                  )}

                  {item.tipo === "pozo" && (
                    <>
                      <Typography variant="body2">
                        <strong>Profundidad:</strong> {item.prof || "N/E"} m
                      </Typography>
                      <Typography variant="body2">
                        <strong>Material:</strong> {item.tipo_mat || "N/E"}
                      </Typography>
                    </>
                  )}

                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    📅 {item.date || "Fecha no registrada"}
                  </Typography>
                </Popup>
              </Marker>
            );
          })}

          <LayersControl position="topright">
            <LayersControl.Overlay name="Sectores" checked>
              <LayerGroup>{sectorPolygons}</LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </Box>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
            box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
          }
        }
        .custom-div-icon {
          background: transparent;
          border: none;
        }
        .custom-div-icon div {
          transition: transform 0.2s ease;
        }
        .custom-div-icon div:hover {
          transform: scale(1.3);
          z-index: 1000;
        }
      `}</style>
    </Box>
  );
};

export default MapView;
