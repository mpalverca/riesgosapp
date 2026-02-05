import React, { useEffect, useState } from "react";
import Panels from "../../../components/panels/Panels";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { useAfectaciones } from "../script_afect";
import { CheckBox } from "@mui/icons-material";

function BodyCOE({ ...props }) {
  const { loadingAF, errorAF, dataAF, countAF, searchAF } = useAfectaciones();
  const [afectaciones, setAfectaciones] = useState(null);
  const [selectedCapa, setSelectedCapa] = useState({
    afectaciones: true,
    acciones: false,
    recursos: false,
    necesidades: false,
    requerimientos: false,
  });
  // Nuevo useEffect para buscar cuando cambia el CI
  useEffect(() => {
  if (selectedCapa.afectaciones && dataAF) {
    setAfectaciones(dataAF);
  }
}, [dataAF, selectedCapa.afectaciones]);

  //control varias capas
  const handleLayerToggle = (layer) => {
    setSelectedCapa((prev) => {
      const newState = {
        ...prev,
        [layer]: !prev[layer],
      };

      // Realizar acciones basadas en el NUEVO estado
      if (layer === "afectaciones" && !prev[layer]) {
        // Solo si se está ACTIVANDO afectaciones

        if (props?.mtt && props?.mtt.trim() !== "") {
          console.log("Buscando MTT:", props.mtt);
          if (!afectaciones) {
            // o afectaciones === null
            searchAF(props?.mtt);
          }
        }
      } else if (layer === "acciones" && !prev[layer]) {
        console.log("acciones activadas");
      } else if (layer === "recursos" && !prev[layer]) {
        console.log("recursos activadas");
      } else if (layer === "necesidades" && !prev[layer]) {
        console.log("necesidades activadas");
      } else if (layer === "requerimientos" && !prev[layer]) {
        console.log("requerimientos activadas");
      }
      // ... etc para otras capas

      return newState;
    });
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid item size={{ xs: 12, md: 3 }}>
        <Panels
          title={`Mesa Tecnica de trabajo/grupo de trabajo - ${props.mtt}`}
          body={
            <>
              <Typography variant="body1" align="justify">
                Capas visibles en el mapa:
              </Typography>
              <Box sx={{ pl: 2, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.afectaciones}
                      onChange={() => handleLayerToggle("afectaciones")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label="Afectaciones"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.acciones}
                      onChange={() => handleLayerToggle("acciones")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label="Acciones"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.recursos}
                      onChange={() => handleLayerToggle("recursos")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label="Recursos"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.necesidades}
                      onChange={() => handleLayerToggle("necesidades")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label="Necesidades"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.requerimientos}
                      onChange={() => handleLayerToggle("requerimientos")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label="Requerimientos"
                />
              </Box>
              <Divider />
              <Box></Box>
            </>
          }
        />
      </Grid>
      <Grid item size={{ xs: 12, md: 9 }}>
        <MapMark
          position={[-3.9965787520553717, -79.20168563157956]}
          zoom={10}
          dataAF={afectaciones}
        />
      </Grid>
    </Grid>
  );
}

function MapMark({ position, zoom, dataAF = [], ...props }) {
  console.log("DataAF recibida en MapMark:", dataAF);
  
  // Estado para almacenar los marcadores procesados
  const [markers, setMarkers] = useState([]);

  // Efecto para procesar dataAF y convertir ubi de string a array
  useEffect(() => {
    if (dataAF && Array.isArray(dataAF) && dataAF.length > 0) {
      const processedMarkers = dataAF
        .map((item, index) => {
          if (!item.ubi) return null;
          
          try {
            // Convertir la cadena "[lat, lng]" a array de números
            let coordinates;
            
            if (typeof item.ubi === 'string') {
              // Remover corchetes y espacios, luego dividir por coma
              const cleanStr = item.ubi.replace(/[\[\]\s]/g, '');
              const parts = cleanStr.split(',');
              
              if (parts.length >= 2) {
                coordinates = [
                  parseFloat(parts[0]),
                  parseFloat(parts[1])
                ];
                
                // Validar que sean números válidos
                if (!isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
                  return {
                    id: index,
                    position: coordinates,
                    data: item
                  };
                }
              }
            } else if (Array.isArray(item.ubi)) {
              // Si ya es un array, usarlo directamente
              coordinates = item.ubi;
              return {
                id: index,
                position: coordinates,
                data: item
              };
            }
          } catch (error) {
            console.error(`Error procesando ubi del item ${index}:`, error);
          }
          
          return null;
        })
        .filter(marker => marker !== null);
      
      console.log("Marcadores procesados:", processedMarkers);
      setMarkers(processedMarkers);
    } else {
      setMarkers([]);
    }
  }, [dataAF]);

  // Función para parsear el campo 'by' que también es string
  const parseByField = (byString) => {
    try {
      if (typeof byString === 'string') {
        // Reemplazar comillas simples por dobles y nombres sin comillas
        const fixedString = byString
          .replace(/(\w+):/g, '"$1":')  // Agregar comillas a las keys
          .replace(/:\s*(\w+)(,|})/g, ': "$1"$2')  // Agregar comillas a valores simples
          .replace(/:(\d+)(,|})/g, ': $1$2')  // No agregar comillas a números
          .replace(/'/g, '"');  // Reemplazar comillas simples
        
        return JSON.parse(fixedString);
      }
      return byString;
    } catch (error) {
      console.error("Error parseando campo 'by':", error);
      return { error: "No se pudo parsear la información" };
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "80vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Mostrar todos los marcadores procesados */}
      {markers.map((marker) => {
        const byData = parseByField(marker.data.by);
        
        return (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div style={{ maxWidth: "300px" }}>
                <h4 style={{ marginTop: 0, color: "#1976d2" }}>
                  {marker.data.event || "Evento"}
                </h4>
                
                <p><strong>Fecha del evento:</strong> {formatDate(marker.data.date_event)}</p>
                <p><strong>Última actualización:</strong> {formatDate(marker.data.date_act)}</p>
                
                <p><strong>Ubicación:</strong></p>
                <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                  <li><strong>Provincia:</strong> {marker.data.provincia}</li>
                  <li><strong>Cantón:</strong> {marker.data.canton}</li>
                  <li><strong>Parroquia:</strong> {marker.data.parroq}</li>
                  <li><strong>Sector:</strong> {marker.data.sector}</li>
                </ul>
                
                <p><strong>Coordenadas:</strong><br />
                  Lat: {marker.position[0].toFixed(6)}<br />
                  Lng: {marker.position[1].toFixed(6)}
                </p>
                
                {marker.data.Descripción && (
                  <p><strong>Descripción:</strong><br />
                    {marker.data.Descripción}
                  </p>
                )}
                
                {byData && !byData.error && (
                  <>
                    <p><strong>Reportado por:</strong></p>
                    <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                      <li><strong>Nombre:</strong> {byData.name}</li>
                      <li><strong>Cargo:</strong> {byData.cargo}</li>
                      <li><strong>CI:</strong> {byData.ci}</li>
                      {byData.contact && (
                        <li><strong>Contacto:</strong> {byData.contact}</li>
                      )}
                    </ul>
                  </>
                )}
                
                {/* Mostrar datos de afectación si existen */}
                <div style={{ marginTop: "10px", fontSize: "0.9em" }}>
                  <p><strong>Estadísticas:</strong></p>
                  <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                    {marker.data.fam_afect && <li>Familias afectadas: {marker.data.fam_afect}</li>}
                    {marker.data.per_fam && <li>Personas por familia: {marker.data.per_fam}</li>}
                    {marker.data.perf_afect && <li>Personas afectadas: {marker.data.perf_afect}</li>}
                  </ul>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Otras capas personalizadas */}
      {props.children}
    </MapContainer>
  );
}

export default BodyCOE;
