import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  Popup,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

// Configuración de Leaflet Draw
L.drawLocal.draw.toolbar.buttons.polygon = "Dibujar polígono";
L.drawLocal.draw.handlers.polygon.tooltip.start = "Haz clic para comenzar el polígono";
L.drawLocal.draw.handlers.polygon.tooltip.cont = "Haz clic para continuar el polígono";
L.drawLocal.draw.handlers.polygon.tooltip.end = "Haz clic en el primer punto para cerrar";

const PolygonEditor = ({ 
  open, 
  onClose, 
  onSave, 
  initialPolygon = null,
  comiteName 
}) => {
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [polygonName, setPolygonName] = useState("");
  const [polygonDescription, setPolygonDescription] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [drawnItems, setDrawnItems] = useState(null);

  // Cargar polígono existente si hay
  useEffect(() => {
    if (initialPolygon && initialPolygon.length > 0) {
      setPolygonCoords(initialPolygon);
      setIsEditing(true);
    } else {
      setPolygonCoords([]);
      setIsDrawing(true);
    }
  }, [initialPolygon]);

  const handleCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const latlngs = layer.getLatLngs()[0];
      const coords = latlngs.map((latlng) => [latlng.lat, latlng.lng]);
      setPolygonCoords(coords);
      setIsDrawing(false);
      setIsEditing(true);
      setError("");
      
      // Limpiar el layer temporal
      if (drawnItems) {
        drawnItems.clearLayers();
      }
    }
  };

  const handleEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const latlngs = layer.getLatLngs()[0];
      const coords = latlngs.map((latlng) => [latlng.lat, latlng.lng]);
      setPolygonCoords(coords);
    });
  };

  const handleDelete = () => {
    setPolygonCoords([]);
    setIsDrawing(true);
    setIsEditing(false);
    if (drawnItems) {
      drawnItems.clearLayers();
    }
  };

  const handleSave = async () => {
    if (polygonCoords.length === 0) {
      setError("Debes dibujar un polígono primero");
      return;
    }

    if (!polygonName.trim()) {
      setError("Debes ingresar un nombre para el polígono");
      return;
    }

    setSaving(true);
    try {
      const polygonData = {
        coordinates: polygonCoords,
        name: polygonName,
        description: polygonDescription,
        comite: comiteName,
        created_at: new Date().toISOString(),
      };
      
      await onSave(polygonData);
      onClose();
    } catch (err) {
      setError("Error al guardar el polígono: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const MapEvents = () => {
    const map = useMap();
    
    useEffect(() => {
      if (map && drawnItems) {
        // Agregar capa de dibujo
        const drawControl = new L.Control.Draw({
          edit: {
            featureGroup: drawnItems,
            edit: true,
            remove: true,
          },
          draw: {
            polygon: {
              shapeOptions: {
                color: "#1976d2",
                fillColor: "#1976d2",
                fillOpacity: 0.3,
                weight: 3,
              },
              showArea: true,
              allowIntersection: false,
            },
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
          },
        });
        
        map.addControl(drawControl);
        
        // Si hay polígono existente, mostrarlo
        if (initialPolygon && initialPolygon.length > 0) {
          const polygon = L.polygon(initialPolygon, {
            color: "#1976d2",
            fillColor: "#1976d2",
            fillOpacity: 0.3,
            weight: 3,
          }).addTo(drawnItems);
          
          drawnItems.addLayer(polygon);
          map.fitBounds(polygon.getBounds());
        }
        
        return () => {
          map.removeControl(drawControl);
        };
      }
    }, [map, drawnItems, initialPolygon]);
    
    return null;
  };

  // Convertir coordenadas a string JSON para guardar
  const convertToGeoJSON = (coords) => {
    return JSON.stringify([coords.map(([lat, lng]) => [lng, lat])]);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{ sx: { height: "80vh" } }}
    >
      <DialogTitle>
        <Typography variant="h6">
          {initialPolygon ? "Editar Polígono" : "Nuevo Polígono"}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: "flex", gap: 2, height: "100%" }}>
          {/* Panel de información */}
          <Box sx={{ width: "30%", overflowY: "auto" }}>
            <Typography variant="subtitle1" gutterBottom>
              Información del Polígono
            </Typography>
            
            <TextField
              fullWidth
              label="Nombre del polígono"
              value={polygonName}
              onChange={(e) => setPolygonName(e.target.value)}
              margin="normal"
              required
              placeholder="Ej: Sector Los Geraneos"
            />
            
            <TextField
              fullWidth
              label="Descripción"
              value={polygonDescription}
              onChange={(e) => setPolygonDescription(e.target.value)}
              margin="normal"
              multiline
              rows={4}
              placeholder="Describe el área del polígono..."
            />
            
            {polygonCoords.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Coordenadas:</strong> {polygonCoords.length} puntos
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: "auto", mt: 1 }}>
                  {polygonCoords.map((coord, idx) => (
                    <Typography key={idx} variant="caption" display="block">
                      {idx + 1}. ({coord[0].toFixed(6)}, {coord[1].toFixed(6)})
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDelete}
                disabled={!isEditing}
              >
                Eliminar Polígono
              </Button>
            </Box>
          </Box>
          
          {/* Mapa para dibujo */}
          <Box sx={{ width: "70%", height: "100%" }}>
            <MapContainer
              center={[-3.9939, -79.2042]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
              <FeatureGroup ref={(ref) => setDrawnItems(ref)}>
                <MapEvents />
              </FeatureGroup>
            </MapContainer>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={saving || polygonCoords.length === 0}
        >
          {saving ? <CircularProgress size={24} /> : "Guardar Polígono"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PolygonEditor;