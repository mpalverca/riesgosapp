import React, { useState } from "react";
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
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import L from "leaflet";
import { DialogAdd } from "./DialogAdd";

// Solucionar problema de iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const n_color = {
  ALTA: "#3538dcff",
  MEDIA: "#ffc107",
  BAJA: "#28a745",
  DEFAULT: "#a9a9aaff",
  SELECTED: "#ff0000",
};

const MapBase = (props) => {
  const centerPosition = [-3.9939, -79.2042];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCoords, setDialogCoords] = useState(null);
  
  const [userLocation, setUserLocation] = useState(null);

  const handleOpenDialog = (latlng) => {
    console.log("handleOpenDialog llamada:", latlng);
    if (!latlng) return;
    setDialogCoords({
      lat: latlng.lat?.toFixed(6),
      lng: latlng.lng?.toFixed(6),
    });
    
    
    setDialogOpen(true);
  };

  

  

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogCoords(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return "Fecha no disponible";
    }
  };

  // Componente para manejar eventos del mapa
  const MapEventHandlers = () => {
    useMapEvents({
      // Doble click
      dblclick: (e) => {
        console.log("Doble click detectado:", e.latlng);
        handleOpenDialog(e.latlng);
      },
      // Clic derecho
      contextmenu: (e) => {
        console.log("Clic derecho detectado:", e.latlng);
        e.originalEvent?.preventDefault();
        handleOpenDialog(e.latlng);
      },
      // Click simple (opcional)
      click: (e) => {
        console.log("Click en mapa:", e.latlng);
        // Puedes agregar acciones adicionales aquí si lo deseas
      },
    });
    return null;
  };

  // Componente para localización del usuario
  const LocationMarker = () => {
    const map = useMapEvents({
      locationfound: (e) => {
        console.log("Ubicación encontrada:", e.latlng);
        setUserLocation(e.latlng);
        map.flyTo(e.latlng, 13);
        // Opcional: abrir diálogo con la ubicación
        // handleOpenDialog(e.latlng);
      },
      locationerror: (e) => {
        console.error("Error al obtener ubicación:", e.message);
      },
    });

    const handleLocate = () => {
      map.locate({ setView: true, maxZoom: 15 });
    };

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
            backgroundColor: "white",
            color: "#1976d2",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
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

  const renderPolygons = () => {
    if (!props.data || !Array.isArray(props.data)) {
      console.warn("No hay datos de polígonos");
      return null;
    }

    return props.data
      .flatMap((item, itemIndex) => {
        try {
          if (!item?.geometry?.coordinates) {
            console.warn(`Item ${itemIndex} sin geometría`);
            return null;
          }

          const sect = item.properties || {};
          const isSelected = sect.BARRIO === props.selectedParroq;

          const coordinates = item.geometry.coordinates;
          let polygons = [];

          if (item.geometry.type === "MultiPolygon") {
            polygons = coordinates;
          } else if (item.geometry.type === "Polygon") {
            polygons = [coordinates];
          } else if (Array.isArray(coordinates[0][0][0])) {
            polygons = coordinates;
          } else {
            polygons = [coordinates];
          }

          return polygons
            .map((polygon, polyIndex) => {
              const ring = polygon[0] || polygon;

              if (!ring || !Array.isArray(ring)) {
                console.warn(`Polígono sin anillo válido en item ${itemIndex}`);
                return null;
              }

              const leafletCoords = ring.map((coord) => [coord[1], coord[0]]);

              return (
                <Polygon
                  key={`${item.id || itemIndex}-${polyIndex}`}
                  positions={leafletCoords}
                  pathOptions={{
                    color: isSelected ? n_color.SELECTED : n_color.DEFAULT,
                    fillColor: isSelected ? n_color.SELECTED : n_color.DEFAULT,
                    fillOpacity: isSelected ? 0.5 : 0.2,
                    weight: isSelected ? 3 : 1.5,
                    opacity: 0.8,
                  }}
                  eventHandlers={{
                    click: () => {
                      console.log("Polígono clickeado:", sect.BARRIO);
                      if (props.onGetParroqData && sect.BARRIO) {
                        props.onGetParroqData(sect.BARRIO);
                      }
                    },
                    mouseover: (e) => {
                      e.target.setStyle({
                        fillOpacity: 0.6,
                        weight: 2.5,
                      });
                    },
                    mouseout: (e) => {
                      e.target.setStyle({
                        fillOpacity: isSelected ? 0.5 : 0.2,
                        weight: isSelected ? 3 : 1.5,
                      });
                    },
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: 200 }}>
                      <h4 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                        {sect.Id && `${sect.Id} - `}
                        {sect.SECTOR || "Sector sin nombre"}
                      </h4>
                      <div style={{ fontSize: 14 }}>
                        <p style={{ margin: "5px 0" }}>
                          <strong>Parroquia:</strong> {sect.PARROQUIA || "N/A"}
                        </p>
                        <p style={{ margin: "5px 0" }}>
                          <strong>Barrio:</strong> {sect.BARRIO || "N/A"}
                        </p>
                        <p style={{ margin: "5px 0" }}>
                          <strong>Comité:</strong>{" "}
                          {sect.comite || "No registrado"}
                        </p>
                        {sect.prioridad && (
                          <p style={{ margin: "5px 0" }}>
                            <strong>Prioridad:</strong> {sect.prioridad}
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })
            .filter(Boolean);
        } catch (error) {
          console.error("Error al procesar polígono:", item, error);
          return null;
        }
      })
      .filter(Boolean);
  };

  const renderMarker = () => {
    if (
      !props.dataEvent ||
      !Array.isArray(props.dataEvent) ||
      props.dataEvent.length === 0
    ) {
      return null;
    }

    return props.dataEvent
      .map((item, index) => {
        try {
          const lat = item.lat != null ? parseFloat(item.lat) : NaN;
          const lng = item.lng != null ? parseFloat(item.lng) : NaN;

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Coordenadas inválidas en evento ${index}:`, item);
            return null;
          }

          return (
            <Marker
              key={item.id || `marker-${index}`}
              position={[lat, lng]}
              eventHandlers={{
                click: () => {
                  console.log("Marcador clickeado:", item.sector);
                },
              }}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#d32f2f" }}>
                    {formatDate(item.fecha)}
                  </h3>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Sector:</strong> {item.sector || "N/A"}
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Descripción:</strong>{" "}
                    {item.detail || "No disponible"}
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Afectación:</strong> {item.afect || "No disponible"}
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Observaciones:</strong>{" "}
                    {item.obs || "No disponible"}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        } catch (error) {
          console.error("Error al procesar marcador:", item, error);
          return null;
        }
      })
      .filter(Boolean);
  };

  if (props.loading) {
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
  }

  if (props.error) {
    return <div>Error: {props.error}</div>;
  }

  return (
    <>
      <MapContainer
        center={centerPosition}
        zoom={10}
        style={{ height: "80vh", width: "100%" }}
        doubleClickZoom={false}
      >
        {/* Manejador de eventos del mapa */}
        <MapEventHandlers />

        {/* Componente de localización */}
        <LocationMarker />

        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
        />
        <DialogAdd
          dialogOpen={dialogOpen}
          handleCloseDialog={handleCloseDialog}
          dialogCoords={dialogCoords}
         
          
        />
        <LayersControl position="topright">
          <LayersControl.Overlay name="Polígonos" checked>
            <LayerGroup>{renderPolygons()}</LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Marcadores" checked>
            <LayerGroup>
              {props.dataEvent && props.dataEvent.length > 0 && renderMarker()}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
};

export default MapBase;
