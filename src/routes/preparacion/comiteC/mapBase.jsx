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
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Button } from "@mui/material";
import L from "leaflet";
import { DialogAdd } from "./DialogAdd";
import { useInforComite } from "./crud";

// Configuración de iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Constantes
const CENTER_POSITION = [-3.9939, -79.2042];
const COLORS = {
  BAJA: "#28a745",
  MEDIA: "#ffc107",
  ALTA: "#ff0000",
  SELECTED: "#3538dcff",
  DEFAULT: "#a9a9aaff",
};

// Hook personalizado para obtener usuario
const useUser = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);
  
  return user;
};

// Componente para manejar eventos del mapa
const MapEventHandlers = ({ onMapClick }) => {
  useMapEvents({
    dblclick: (e) => onMapClick(e.latlng),
    contextmenu: (e) => {
      e.originalEvent?.preventDefault();
      onMapClick(e.latlng);
    },
  });
  return null;
};

// Componente de localización
const LocationMarker = () => {
  const [userLocation, setUserLocation] = useState(null);
  const map = useMapEvents({
    locationfound: (e) => {
      setUserLocation(e.latlng);
      map.flyTo(e.latlng, 13);
    },
  });

  const handleLocate = () => map.locate({ setView: true, maxZoom: 15 });

  return (
    <>
      <Button
        onClick={handleLocate}
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
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Tu ubicación actual</Popup>
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
  const user = useUser();
  const { read, dataC } = useInforComite();

  // Cargar datos iniciales
  useEffect(() => {
  const comiteName = props.comiteInfo?.data?.[0]?.comite;
  if (comiteName) {
    read("read", "plan", comiteName);
  }
}, [props.comiteInfo?.data?.[0]?.comite]);

// Actualizar markData cuando dataC cambie
useEffect(() => {
  if (dataC?.data && Array.isArray(dataC.data)) {
    setMarkData(dataC.data);
    console.log("Datos actualizados:", dataC);
  }
}, [dataC]);
  // Handlers
  const handleOpenDialog = useCallback((latlng) => {
    if (!latlng) return;
    setDialogCoords({
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6),
    });
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setDialogCoords(null);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida";
    
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Función para obtener color según puntaje
  const getColorByTotal = useCallback((total) => {
    const value = total || 0;
    if (value <= 3.9) return COLORS.BAJA;
    if (value <= 6.9) return COLORS.MEDIA;
    return COLORS.ALTA;
  }, []);

  // Función para normalizar texto
  const normalizeText = useCallback((text) => {
    if (!text) return "";
    return text.trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
  }, []);

  // Verificar coincidencia de sectores
  const isSectorMatch = useCallback((sector1, sector2) => {
    if (!sector1 || !sector2) return false;
    const norm1 = normalizeText(sector1);
    const norm2 = normalizeText(sector2);
    return norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1);
  }, [normalizeText]);

  // Renderizar polígonos
  const renderPolygons = useMemo(() => {
    if (!props.data?.length) return null;

    // Mapa de sectores con puntajes
    const sectoresMap = new Map();
    props.seletedInfo?.resultados?.forEach((resultado) => {
      if (resultado.sector) {
        const sectorKey = normalizeText(resultado.sector);
        sectoresMap.set(sectorKey, {
          total: resultado.total || 0,
          sector: resultado.sector,
          estado: resultado.estado,
          comite: resultado.comite,
        });
      }
    });

    return props.data.flatMap((item, idx) => {
      try {
        if (!item?.geometry?.coordinates) return null;
        
        const sect = item.properties || {};
        const sectorName = sect.SECTOR || sect.sector || "";
        const sectorKey = normalizeText(sectorName);
        const matchedSector = sectoresMap.get(sectorKey);
        const isSelected = sect.BARRIO === props.selectedParroq;
        
        // Determinar color del polígono
        let color, fillOpacity, weight;
        if (matchedSector) {
          color = getColorByTotal(matchedSector.total);
          fillOpacity = 0.5;
          weight = 2;
        } else if (isSelected) {
          color = COLORS.SELECTED;
          fillOpacity = 0.5;
          weight = 3;
        } else {
          color = COLORS.DEFAULT;
          fillOpacity = 0.2;
          weight = 1.5;
        }

        const polygonStyle = {
          color,
          fillColor: color,
          fillOpacity,
          weight,
          opacity: 0.8,
        };

        // Procesar coordenadas
        const coordinates = item.geometry.coordinates;
        let polygons = [];
        
        if (item.geometry.type === "MultiPolygon") polygons = coordinates;
        else if (item.geometry.type === "Polygon") polygons = [coordinates];
        else if (Array.isArray(coordinates[0]?.[0]?.[0])) polygons = coordinates;
        else polygons = [coordinates];

        return polygons.map((polygon, polyIdx) => {
          const ring = polygon[0] || polygon;
          if (!ring?.length) return null;
          
          const leafletCoords = ring.map(coord => [coord[1], coord[0]]);
          
          return (
            <Polygon
              key={`${item.id || idx}-${polyIdx}`}
              positions={leafletCoords}
              pathOptions={polygonStyle}
              eventHandlers={{
                click: () => props.onGetParroqData?.(sect.BARRIO),
                mouseover: (e) => e.target.setStyle({ fillOpacity: 0.7, weight: 3 }),
                mouseout: (e) => e.target.setStyle(polygonStyle),
              }}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                    {sect.SECTOR || sect.sector || "Sector sin nombre"}
                  </h4>
                  <div style={{ fontSize: 14 }}>
                    <p><strong>Parroquia:</strong> {sect.PARROQUIA || "N/A"}</p>
                    <p><strong>Barrio:</strong> {sect.BARRIO || "N/A"}</p>
                    {matchedSector && (
                      <>
                        <p style={{ borderTop: "1px solid #eee", paddingTop: "5px" }}>
                          <strong>Priorización:</strong>
                        </p>
                        <p><strong>Puntaje:</strong> <span style={{ fontWeight: "bold", color }}>{matchedSector.total}</span></p>
                        <p><strong>Estado:</strong> {matchedSector.estado || "N/A"}</p>
                      </>
                    )}
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error en polígono:", error);
        return null;
      }
    }).filter(Boolean);
  }, [props.data, props.seletedInfo, props.selectedParroq, props.onGetParroqData, getColorByTotal, normalizeText]);

  // Convertir string de polígono a coordenadas
  const convertPolygonStringToLeaflet = useCallback((polygonString) => {
    if (!polygonString) return null;
    try {
      const parsed = JSON.parse(polygonString);
      const ring = parsed[0];
      if (!ring?.length) return null;
      return ring.map(coord => [coord[1], coord[0]]);
    } catch (error) {
      console.error("Error al convertir polígono:", error);
      return null;
    }
  }, []);

  // Renderizar polígono del comité
  const renderComite = useMemo(() => {
    if (!props.comiteInfo?.data?.[0]) return null;
    
    const comiteData = props.comiteInfo.data[0];
    const polygonCoords = convertPolygonStringToLeaflet(comiteData.poligono);
    if (!polygonCoords) return null;
    
    const polygonStyle = {
      color: "#1976d2",
      fillColor: "#1976d2",
      fillOpacity: 0.4,
      weight: 2.5,
    };
    
    return (
      <Polygon
        positions={polygonCoords}
        pathOptions={polygonStyle}
        eventHandlers={{
          click: () => props.onPolygonClick?.(comiteData),
          mouseover: (e) => e.target.setStyle({ fillOpacity: 0.7, weight: 3.5 }),
          mouseout: (e) => e.target.setStyle(polygonStyle),
        }}
      >
        <Popup>
          <div style={{ minWidth: 250 }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
              {comiteData.comite || "Comité Comunitario"}
            </h3>
            <div style={{ fontSize: 13 }}>
              <p><strong>Estado:</strong> {comiteData.Estado || "N/A"}</p>
              <p><strong>Fase:</strong> {comiteData.Fase || "N/A"}</p>
            </div>
          </div>
        </Popup>
      </Polygon>
    );
  }, [props.comiteInfo, convertPolygonStringToLeaflet, props.onPolygonClick]);

  // Renderizar marcadores
  const renderMarker = useMemo(() => {
    if (!markData?.length) return null;
    
    return markData.map((item, idx) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lng);
      if (isNaN(lat) || isNaN(lng)) return null;
      console.log("Marcador:", { lat, lng, item });
      return (
        <Marker key={item.id || idx} position={[lat, lng]}>
          <Popup>
            <div style={{ minWidth: 200 }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#d32f2f" }}>
                {formatDate(item.fecha)}
              </h3>
              <p><strong>Sector:</strong> {item.sector || "N/A"}</p>
              <p><strong>Descripción:</strong> {item.detail || "No disponible"}</p>
              <p><strong>Afectación:</strong> {item.afect || "No disponible"}</p>
            </div>
          </Popup>
        </Marker>
      );
    }).filter(Boolean);
  }, [markData, formatDate]);

  if (props.loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">Cargando mapa...</Box>;
  }

  return (
    <>
      <MapContainer
        center={CENTER_POSITION}
        zoom={10}
        style={{ height: "80vh", width: "100%" }}
        doubleClickZoom={false}
      >
        {user && <MapEventHandlers onMapClick={handleOpenDialog} />}
        <LocationMarker />
        <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
        
        <DialogAdd
          dialogOpen={dialogOpen}
          handleCloseDialog={handleCloseDialog}
          dialogCoords={dialogCoords}
          markData={markData}
          setMarkData={setMarkData}
          comite={props.comiteInfo?.data?.[0]?.comite}
        />
        
        <LayersControl position="topright">
          <LayersControl.Overlay name="Polígonos" checked>
            <LayerGroup>{renderPolygons}</LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Marcadores" checked>
            <LayerGroup>{renderMarker}</LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Comité" checked>
            <LayerGroup>{renderComite}</LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
};

export default MapBase;