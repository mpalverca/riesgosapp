import React, { useEffect, useState } from "react";
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
  Alert,
  Snackbar,
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
  SELECTED: "#3538dcff",
  MEDIA: "#ffc107",
  BAJA: "#28a745",
  DEFAULT: "#a9a9aaff",
  ALTA: "#ff0000",
};
const MapBase = (props) => {
  const centerPosition = [-3.9939, -79.2042];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCoords, setDialogCoords] = useState(null);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      //    console.log(JSON.parse(userData));
    }
    //    console.log(JSON.parse(userData));
  }, []);
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
    const userData = localStorage.getItem("user");
    if (userData == null) {
      console.log("Usuario logueado:", JSON.parse(userData));
      // return <Alert severity="warning">Inicia sesión para agregar eventos al mapa</Alert>;
    }
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

  /* const renderPolygons = () => {
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
  }; */
  const renderPolygons = () => {
    if (!props.data || !Array.isArray(props.data)) {
      console.warn("No hay datos de polígonos");
      return null;
    }

    // Crear un mapa de sectores con sus puntajes totales desde seletedInfo
    const sectoresMap = new Map();

    if (
      props.seletedInfo?.resultados &&
      Array.isArray(props.seletedInfo.resultados)
    ) {
      props.seletedInfo.resultados.forEach((resultado) => {
        if (resultado.sector) {
          // Limpiar y normalizar el nombre del sector para comparación
          const sectorNombre = resultado.sector.trim().toLowerCase();
          sectoresMap.set(sectorNombre, {
            total: resultado.total || 0,
            sector: resultado.sector,
            estado: resultado.estado,
            comite: resultado.comite,
          });
        }
      });
    }

    // Función para obtener el color según el puntaje
    const getColorByTotal = (total) => {
      const value = total || 0;
      if (value <= 3.9)
        return {
          color: "#28a745", // BAJA - Verde
          fillOpacity: 0.4,
          weight: 2,
        };
      if (value <= 6.9)
        return {
          color: "#ffc107", // MEDIA - Amarillo
          fillOpacity: 0.5,
          weight: 2,
        };
      return {
        color: "#ff0000", // ALTA - Rojo
        fillOpacity: 0.6,
        weight: 2.5,
      };
    };

    // Función para normalizar texto y comparar similitud
    const isSectorMatch = (sectorFromGeoJSON, targetSector) => {
      if (!sectorFromGeoJSON || !targetSector) return false;

      const normalizedGeo = sectorFromGeoJSON.trim().toLowerCase();
      const normalizedTarget = targetSector.trim().toLowerCase();

      // Comparación exacta
      if (normalizedGeo === normalizedTarget) return true;

      // Comparación aproximada (eliminando caracteres especiales y espacios extras)
      const cleanGeo = normalizedGeo
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
      const cleanTarget = normalizedTarget
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");

      if (cleanGeo === cleanTarget) return true;

      // Contiene o es contenido
      if (cleanGeo.includes(cleanTarget) || cleanTarget.includes(cleanGeo))
        return true;

      return false;
    };

    return props.data
      .flatMap((item, itemIndex) => {
        try {
          if (!item?.geometry?.coordinates) {
            console.warn(`Item ${itemIndex} sin geometría`);
            return null;
          }

          const sect = item.properties || {};
          const sectorName = sect.SECTOR || sect.sector || "";

          // Buscar si este sector está en la lista de seletedInfo
          let matchedSector = null;
          let matchedTotal = null;

          for (const [key, value] of sectoresMap.entries()) {
            if (isSectorMatch(sectorName, key)) {
              matchedSector = value;
              matchedTotal = value.total;

              break;
            }
          }
          // Determinar si está seleccionado (para mantener funcionalidad original)
          const isSelected = sect.BARRIO === props.selectedParroq;

          // Obtener estilo según si tiene match con seletedInfo o no
          let polygonStyle;

          if (matchedTotal !== null) {
            // Tiene información de priorización - usar color según total
            const styleByTotal = getColorByTotal(matchedTotal);
            polygonStyle = {
              color: styleByTotal.color,
              fillColor: styleByTotal.color,
              fillOpacity: styleByTotal.fillOpacity,
              weight: styleByTotal.weight,
              opacity: 0.8,
            };
          } else if (isSelected) {
            // Está seleccionado pero no tiene información de priorización
            polygonStyle = {
              color: n_color.SELECTED,
              fillColor: n_color.SELECTED,
              fillOpacity: 0.5,
              weight: 3,
              opacity: 0.8,
            };
          } else {
            // Default - sin información y no seleccionado
            polygonStyle = {
              color: n_color.DEFAULT,
              fillColor: n_color.DEFAULT,
              fillOpacity: 0.2,
              weight: 1.5,
              opacity: 0.8,
            };
          }

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
                  pathOptions={polygonStyle}
                  eventHandlers={{
                    click: () => {
                      console.log(
                        "Polígono clickeado:",
                        sect.SECTOR || sect.sector,
                      );
                      if (props.onGetParroqData && sect.BARRIO) {
                        props.onGetParroqData(sect.BARRIO);
                      }
                      // También podrías pasar la información del sector si está disponible
                      if (matchedSector && props.onSelectSector) {
                        props.onSelectSector(matchedSector);
                      }
                    },
                    mouseover: (e) => {
                      e.target.setStyle({
                        fillOpacity: matchedTotal !== null ? 0.8 : 0.6,
                        weight: matchedTotal !== null ? 3 : 2.5,
                      });
                    },
                    mouseout: (e) => {
                      e.target.setStyle(polygonStyle);
                    },
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: 200 }}>
                      <h4 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                        {sect.Id && `${sect.Id} - `}
                        {sect.SECTOR || sect.sector || "Sector sin nombre"}
                      </h4>
                      <div style={{ fontSize: 14 }}>
                        <p style={{ margin: "5px 0" }}>
                          <strong>Parroquia:</strong> {sect.PARROQUIA || "N/A"}
                        </p>
                        <p style={{ margin: "5px 0" }}>
                          <strong>Barrio:</strong> {sect.BARRIO || "N/A"}
                        </p>

                        {/* Mostrar información de priorización si existe */}
                        {matchedSector && (
                          <>
                            <p
                              style={{
                                margin: "5px 0",
                                borderTop: "1px solid #eee",
                                paddingTop: "5px",
                              }}
                            >
                              <strong>Priorización:</strong>
                            </p>
                            <p style={{ margin: "5px 0" }}>
                              <strong>Puntaje Total:</strong>{" "}
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: getColorByTotal(matchedTotal).color,
                                }}
                              >
                                {matchedTotal}
                              </span>
                            </p>
                            <p style={{ margin: "5px 0" }}>
                              <strong>Nivel:</strong>{" "}
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: getColorByTotal(matchedTotal).color,
                                }}
                              >
                                {matchedTotal <= 3.9
                                  ? "BAJA"
                                  : matchedTotal <= 6.9
                                    ? "MEDIA"
                                    : "ALTA"}
                              </span>
                            </p>
                            <p style={{ margin: "5px 0" }}>
                              <strong>Estado:</strong>{" "}
                              {matchedSector.estado || "N/A"}
                            </p>
                            <p style={{ margin: "5px 0" }}>
                              <strong>Comite:</strong>{" "}
                              {matchedSector.comite || "N/A"}
                            </p>
                          </>
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

  // Función auxiliar para convertir el string del polígono a coordenadas de Leaflet
  const convertPolygonStringToLeaflet = (polygonString) => {
    if (!polygonString) return null;

    try {
      // Parsear el string JSON
      const parsed = JSON.parse(polygonString);

      // La estructura es un array de anillos, tomar el primer anillo
      const ring = parsed[0];

      if (!ring || !Array.isArray(ring)) return null;

      // Convertir de [lng, lat] a [lat, lng] para Leaflet
      const leafletCoords = ring.map((coord) => [coord[1], coord[0]]);

      return leafletCoords;
    } catch (error) {
      console.error("Error al convertir polígono:", error);
      return null;
    }
  };

  // Componente simplificado para renderizar el polígono
  const renderComite = () => {
    // Verificar si existe la información del comité
    if (
      !props.comiteInfo ||
      !props.comiteInfo.data ||
      props.comiteInfo.data.length === 0
    ) {
      console.warn("No hay información del comité");
      return null;
    }

    // Obtener el primer comité (o el que corresponda)
    const comiteData = props.comiteInfo.data[0];
    const {
      poligono,
      comite,
      Estado,
      Fase,
      responsable,
      secretario,
      lider_brigada,
    } = comiteData;

    // Convertir el polígono
    const polygonCoords = convertPolygonStringToLeaflet(poligono);
    if (!polygonCoords) {
      console.warn("No se pudo convertir el polígono");
      return null;
    }

    // Estilo del polígono
    const polygonStyle = {
      color: "#1976d2",
      fillColor: "#1976d2",
      fillOpacity: 0.4,
      weight: 2.5,
      opacity: 0.8,
    };

    return (
      <Polygon
        positions={polygonCoords}
        pathOptions={polygonStyle}
        eventHandlers={{
          click: () => {
            console.log("Polígono del comité clickeado:", comite);
            if (props.onPolygonClick) {
              props.onPolygonClick(comiteData);
            }
          },
          mouseover: (e) => {
            e.target.setStyle({
              fillOpacity: 0.7,
              weight: 3.5,
            });
          },
          mouseout: (e) => {
            e.target.setStyle(polygonStyle);
          },
        }}
      >
        <Popup>
          <div style={{ minWidth: 250, maxWidth: 300 }}>
            <h3
              style={{
                margin: "0 0 10px 0",
                color: "#1976d2",
                borderBottom: "2px solid #1976d2",
                paddingBottom: "5px",
              }}
            >
              {comite || "Comité Comunitario"}
            </h3>

            <div style={{ fontSize: 13 }}>
              <p style={{ margin: "8px 0" }}>
                <strong>Estado:</strong> {Estado || "N/A"}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Fase:</strong> {Fase || "N/A"}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Responsable:</strong> {responsable || "N/A"}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Secretario/a:</strong> {secretario || "N/A"}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Líder de Brigada:</strong> {lider_brigada || "N/A"}
              </p>
            </div>
          </div>
        </Popup>
      </Polygon>
    );
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
        {user ? (
          <MapEventHandlers />
        ) : (
          <Snackbar open={true} autoHideDuration={5000}>
            <Alert>crea un usuario Primero</Alert>
          </Snackbar>
        )}

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
          <LayersControl.Overlay name="Comité" checked>
            <LayerGroup>{props.comiteInfo && renderComite()}</LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
};

export default MapBase;
