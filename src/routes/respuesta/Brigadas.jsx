import React, { useEffect, useState } from "react";
import MapMark from "../../components/maps/mapaView";
import Panels from "../../components/panels/Panels";
import { Grid, CircularProgress, Box, Typography, Alert, Divider } from "@mui/material";
import { Polygon, Popup } from "react-leaflet";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzj8eXN23mkkdZypf8yBayEMBA7Bt-MM0D_6Jp-34JxQCsg-8UkjZqM9nBoI6dw8nrK/exec";

const n_color = {
  ALTA: "#3538dcff",
  MEDIA: "#ffc107",
  BAJA: "#28a745",
  DEFAULT: "#a9a9aaff",
};

export default function Brigadas() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBarrio, setSelectedBarrio] = useState(null);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const dataP = await dataSector();

        if (!dataP || !Array.isArray(dataP)) {
          throw new Error("Datos inválidos recibidos del servidor");
        }

        setData(dataP);

        // Extraer barrios únicos
        const barriosSet = new Set();
        dataP.forEach((feature) => {
          if (feature?.properties) {
            const barrio = feature.properties.BARRIO ||
                          feature.properties.barrio ||
                          feature.properties.Barrio;
            if (barrio && typeof barrio === "string") {
              barriosSet.add(barrio.trim());
            }
          }
        });

        const barriosArray = Array.from(barriosSet).sort();
        setBarData(barriosArray);
        
      } catch (err) {
        console.error("❌ Error al cargar sectores:", err);
        setError(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // CORRECCIÓN: Función que retorna un array plano de polígonos
  const renderPolygons = () => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const polygons = [];

    data.forEach((item, itemIndex) => {
      try {
        const coordinates = item.geometry?.coordinates;
        const properties = item.properties || {};

        if (!coordinates || !Array.isArray(coordinates)) {
          console.warn("Coordenadas inválidas para el item:", item);
          return;
        }

        // Para MultiPolygon, cada polígono tiene múltiples anillos
        coordinates.forEach((polygon, polygonIndex) => {
          if (!polygon || !Array.isArray(polygon) || polygon.length === 0) {
            return;
          }

          // Tomar el anillo exterior (primer array)
          const exteriorRing = polygon[0];

          if (!exteriorRing || !Array.isArray(exteriorRing)) {
            return;
          }

          const polyCoords = exteriorRing.map((coord) => {
            if (Array.isArray(coord) && coord.length >= 2) {
              return [coord[1], coord[0]]; // [lat, lng]
            }
            return [0, 0];
          });

          const isSelected = selectedBarrio === properties.BARRIO;

          polygons.push(
            <Polygon
              key={`${itemIndex}-${polygonIndex}`}
              positions={polyCoords}
              pathOptions={{
                color: isSelected ? n_color.ALTA : n_color.DEFAULT,
                fillColor: isSelected ? n_color.ALTA : n_color.DEFAULT,
                fillOpacity: isSelected ? 0.4 : 0.2,
                weight: isSelected ? 3 : 2,
              }}
             /*  eventHandlers={{
                click: () => {
                 // console.log("Polígono clickeado:", properties);
                 // setSelectedBarrio(properties.BARRIO);
                },
              }} */
            >
              <Popup>
                <div style={{ padding: "2px", minWidth: "200px" }}>
                  <h3 style={{ marginTop: 0, marginBottom: "2px" }}>
                    {properties.ID || "Sin ID"} - {" "}
                    {properties.SECTOR || "Sin sector"}
                  </h3>
                  <p>
                    <strong>Parroquia:</strong>{" "}
                    {properties.PARROQUIA || "No especificado"}
                  </p>
                  <p>
                    <strong>Barrio:</strong>{" "}
                    {properties.BARRIO || "No especificado"}
                  </p>
                </div>
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
      }
    });

    return polygons;
  };

  // Estados de carga
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h3" sx={{ ml: 2 }}>Cargando datos de Brigadas...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No se encontraron datos de brigadas comunitarias.
      </Alert>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item size={{xs:12, md:3}}> {/* CORRECCIÓN: xs y md, no size */}
        <Panels
          title="Brigadas Comunitarias"
          data={barData}
          selectedValue={selectedBarrio}
          setSelectedValue={setSelectedBarrio}
          body={
           <div>
             <Typography align="justify" variant="body1" sx={{mx:2}}>
              Las Brigadas Comunitarias son grupos de personas organizadas para
              recibir entrenamiento y capacitación para que puedan actuar antes,
              durante y después de un evento peligroso en la comunidad. Una vez que
              las brigadas se encuentren formadas, deberán elegir un Líder por cada
              brigada, los cuáles serán integrantes del Comité Comunitario de
              Gestión de Riesgos.
            </Typography>
            <Divider sx={{my:2}}/>
           </div>
          }
        />
      </Grid>
      <Grid item size={{xs:12, md:9}} sx={{ mt: 2, p: 2 }}> {/* CORRECCIÓN: xs y md */}
        {/* CORRECCIÓN: Pasar renderPolygons como prop y LLAMARLA en MapMark */}
        <MapMark
          position={[-3.99661, -79.201782]}
          zoom={12}
          renderPolygons={renderPolygons()} // ¡Llama la función aquí!
        />
      </Grid>
    </Grid>
  );
}

export const dataSector = async () => {
  try {
    const url = `${SCRIPT_URL}?action=getData`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    if (result.status !== "success") {
      console.warn("Estado no exitoso:", result);
    }

    return result.features || [];
  } catch (error) {
    console.error("Error en dataSector:", error);
    throw error;
  }
};