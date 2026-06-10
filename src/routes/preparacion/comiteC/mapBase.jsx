import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  LayersControl,
  LayerGroup,
  useMapEvents,
  FeatureGroup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { Box, Button, Typography } from "@mui/material";
import L from "leaflet";
import { DialogAdd } from "./DialogAdd";
import { useInforComite } from "./crud";

// Configuración de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Constantes
const CENTER = [-3.9939, -79.2042];
const COLORS = {
  BAJA: "#28a745",
  MEDIA: "#ffc107",
  ALTA: "#ff0000",
  SELECTED: "#3538dc",
  DEFAULT: "#a9a9a9",
};
const OPTIONS = {
  freq: {
    1: "🟢 Baja - 5-20 años",
    2: "🟡 Media - 3-5 años",
    3: "🔴 Alta - 1-3 años",
  },
  intensity: {
    1: "🟢 Baja - Sin fallecidos",
    2: "🟡 Media - Pocos fallecidos",
    3: "🔴 Alta - Numerosos fallecidos",
  },
  surface: { 1: "🟢 Baja - <50%", 2: "🟡 Media - 50-80%", 3: "🔴 Alta - >80%" },
};

const getLabel = (type, value) => OPTIONS[type]?.[value] || "No disponible";
const createEmojiMarker = (emoji, color) =>
  L.divIcon({
    html: `<div style="background:${color}20; border:3px solid ${color}; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 2px 4px rgba(0,0,0,0.3)">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: "custom-marker",
  });

const MARKER_ICONS = {
  Amenaza: createEmojiMarker("⚠️", "#d32f2f"),
  Vulnerabilidad: createEmojiMarker("🛡️", "#ff9800"),
  Recurso: createEmojiMarker("🔧", "#4caf50"),
};

// Hooks personalizados
const useUser = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) setUser(JSON.parse(data));
  }, []);
  return user;
};

// Componentes
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    dblclick: (e) => onMapClick(e.latlng),
    contextmenu: (e) => {
      e.originalEvent?.preventDefault();
      onMapClick(e.latlng);
    },
  });
  return null;
};

const LocationBtn = () => {
  const [pos, setPos] = useState(null);
  const map = useMapEvents({
    locationfound: (e) => {
      setPos(e.latlng);
      map.flyTo(e.latlng, 13);
    },
  });
  return (
    <>
      <Button
        onClick={() => map.locate({ setView: true, maxZoom: 15 })}
        variant="contained"
        size="small"
        sx={{
          position: "absolute",
          bottom: 20,
          right: 10,
          zIndex: 1000,
          bgcolor: "white",
          color: "#1976d2",
        }}
      >
        Mi Ubicación
      </Button>
      {pos && (
        <Marker position={pos}>
          <Popup>Tu ubicación</Popup>
        </Marker>
      )}
    </>
  );
};

// Componente principal
const MapBase = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCoords, setDialogCoords] = useState(null);
  const [markData, setMarkData] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const user = useUser();
  const { read, dataC } = useInforComite();

  // Cargar datos
  useEffect(() => {
    const comite = props.comiteInfo?.data?.[0]?.comite;
    if (comite) read("read", "plan", comite);
  }, [props.comiteInfo?.data?.[0]?.comite, read]);

  useEffect(() => {
    if (dataC?.data) setMarkData(dataC.data);
  }, [dataC]);

  // Handlers
  const handleOpenDialog = useCallback((latlng) => {
    if (!latlng) return;
    setDialogCoords({ lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) });
    setDialogOpen(true);
  }, []);

  const handleEditPolygon = useCallback(() => {
    setDialogOpen(false);
    setIsDrawing(true);
    setPolygon(null);
  }, []);

  const onPolygonCreate = useCallback((e) => {
    if (e.layerType === "polygon") {
      const coords = e.layer.getLatLngs()[0].map((p) => [p.lat, p.lng]);
      setPolygon([coords]);
      setIsDrawing(false);
      setDialogOpen(true);
    }
  }, []);

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

  // Renderizar polígonos de sectores
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

  // Renderizar polígono del comité
  const comitePolygon = useMemo(() => {
    const data = props.comiteInfo?.data?.[0];
    if (!data?.poligono) return null;
    try {
      const coords = JSON.parse(data.poligono)[0]?.map((c) => [c[1], c[0]]);
      if (!coords) return null;
      return (
        <Polygon
          positions={coords}
          pathOptions={{
            color: "#1976d2",
            fillColor: "#1976d2",
            fillOpacity: 0.4,
            weight: 2.5,
          }}
          eventHandlers={{
            click: () => props.onPolygonClick?.(data),
            mouseover: (e) => e.target.setStyle({ fillOpacity: 0.7 }),
            mouseout: (e) => e.target.setStyle({ fillOpacity: 0.4 }),
          }}
        >
          <Popup>
            <h3>{data.comite}</h3>
            <p>
              Estado: {data.Estado} | Fase: {data.Fase}
            </p>
          </Popup>
        </Polygon>
      );
    } catch {
      return null;
    }
  }, [props.comiteInfo, props.onPolygonClick]);

  // Renderizar marcadores
  const markers = useMemo(() => {
  if (!markData.length) return null;

  // Función para convertir string de polígono a coordenadas
  const convertToPolygonArray = (str) => {
    if (!str || typeof str !== 'string') return null;
    
    const parts = str.split(",").map(Number);
    const coords = [];
    
    for (let i = 0; i < parts.length - 1; i += 2) {
      if (!isNaN(parts[i]) && !isNaN(parts[i + 1])) {
        coords.push([parts[i], parts[i + 1]]);
      }
    }
    
    return coords.length ? [coords] : null;
  };

  return markData.map((item, i) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lng);
    
    if (isNaN(lat) || isNaN(lng)) return null;

    // Renderizar polígono si existe
    if (item.polygon) {
      const polygonCoords = convertToPolygonArray(item.polygon);
      if (polygonCoords) {
        return (
          <Polygon
            key={`poly-${item.id || i}`}
            positions={polygonCoords}
            pathOptions={{
              color: "#af4f4c",
              fillColor: "#af4f4c",
              fillOpacity: 0.3,
              weight: 2
            }}
          >
            <Popup>
          <Box sx={{ maxHeight: "60vh", overflow: "auto", maxWidth: 450 }}>
            <h3 style={{ color: "#d32f2f" }}>{item.type || "N/A"}</h3>
            <p><strong>Fecha:</strong> {new Date(item.created_at).toLocaleString("es-ES")}</p>
            <p><strong>Subtipo:</strong> {item.subtype || "N/A"}</p>
            <p><strong>Descripción:</strong> {item.desc || "N/A"}</p>
            {item.type === "Amenaza" && (
              <div style={{ background: "#f5f5f5", padding: 10, borderRadius: 4, marginTop: 10 }}>
                <strong>📊 Parámetros:</strong>
                <p>🔄 Frecuencia: {getLabel("freq", item.freq)}</p>
                <p>💥 Intensidad: {getLabel("intensity", item.intensity)}</p>
                <p>🗺️ Superficie: {getLabel("surface", item.surface)}</p>
              </div>
            )}
          </Box>
        </Popup>
          </Polygon>
        );
      }
    }

    // Renderizar marker
    return (
      <Marker
        key={`marker-${item.id || i}`}
        position={[lat, lng]}
        icon={MARKER_ICONS[item.type] || MARKER_ICONS.Recurso}
      >
        <Popup>
          <Box sx={{ maxHeight: "60vh", overflow: "auto", maxWidth: 450 }}>
            <h3 style={{ color: "#d32f2f" }}>{item.type || "N/A"}</h3>
            <p><strong>Fecha:</strong> {new Date(item.created_at).toLocaleString("es-ES")}</p>
            <p><strong>Subtipo:</strong> {item.subtype || "N/A"}</p>
            <p><strong>Descripción:</strong> {item.desc || "N/A"}</p>
            {item.type === "Amenaza" && (
              <div style={{ background: "#f5f5f5", padding: 10, borderRadius: 4, marginTop: 10 }}>
                <strong>📊 Parámetros:</strong>
                <p>🔄 Frecuencia: {getLabel("freq", item.freq)}</p>
                <p>💥 Intensidad: {getLabel("intensity", item.intensity)}</p>
                <p>🗺️ Superficie: {getLabel("surface", item.surface)}</p>
              </div>
            )}
          </Box>
        </Popup>
      </Marker>
    );
  }).filter(Boolean);
}, [markData]);

  // Polígono dibujado
  const drawnPolygon = useMemo(() => {
    if (!polygon?.[0]?.length) return null;
    return (
      <Polygon
        positions={polygon[0]}
        pathOptions={{
          color: "#4caf50",
          fillColor: "#4caf50",
          fillOpacity: 0.4,
          weight: 3,
        }}
      />
    );
  }, [polygon]);

  if (props.loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        Cargando mapa...
      </Box>
    );

  return (
    <MapContainer
      center={CENTER}
      zoom={10}
      style={{ height: "80vh", width: "100%" }}
      doubleClickZoom={!isDrawing}
    >
      {user && <MapEvents onMapClick={handleOpenDialog} />}
      <LocationBtn />
      <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />

      <DialogAdd
        dialogOpen={dialogOpen}
        handleCloseDialog={() => setDialogOpen(false)}
        handleEditPol={handleEditPolygon}
        dialogCoords={dialogCoords}
        markData={markData}
        setMarkData={setMarkData}
        comiteAdds={props.comiteInfo?.data?.[0]?.adders}
        comite={props.comiteInfo?.data?.[0]?.comite}
        polyData={polygon}
      />

      <LayersControl position="topright">
        <LayersControl.Overlay name="Sectores" checked>
          <LayerGroup>{sectorPolygons}</LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Marcadores" checked>
          <LayerGroup>{markers}</LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Comité" checked>
          <LayerGroup>{comitePolygon}</LayerGroup>
        </LayersControl.Overlay>
        {drawnPolygon && <LayerGroup>{drawnPolygon}</LayerGroup>}
      </LayersControl>

      {isDrawing && (
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={onPolygonCreate}
            draw={{
              rectangle: false,
              polygon: true,
              polyline: false,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      )}

      {/* <Button
        onClick={handleEditPolygon}
        variant="contained"
        size="small"
        sx={{
          position: "absolute",
          bottom: 20,
          left: 10,
          zIndex: 1000,
          bgcolor: isDrawing ? "#ff9800" : "#4caf50",
        }}
      >
        {isDrawing ? "✏️ Dibujando..." : "✏️ Editar Polígono"}
      </Button> */}
    </MapContainer>
  );
};

export default MapBase;
