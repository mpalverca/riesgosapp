import { Box, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Panel from "./comiteC/panel";
const SCRIPT_URL=("https://script.google.com/macros/s/AKfycbyw2K__Ix-R6r7ZPbr6RrIc4JcXCW26_bP4MRjFttHSzKwmuNTm5X0UKjrOCdn9Q8V_/exec");
export default function ComiteComunitario() {
  const [polygonData, setPolygonData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedParroq, setSelectedParroq] = useState(null);
  const [parroqData, setParroqData] = useState(null);
  const [loadingParroq, setLoadingParroq] = useState(false);
  const [eventInfo, setDataEvent] = useState();

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchData();
        setPolygonData(data);
      } catch (err) {
        console.error("Error al cargar polígonos:", err);
        setError("Error al cargar datos de polígonos",err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Cargar datos de parroquia específica
  const getParroqData = async (id) => {
    if (!id) return;

    try {
      setLoadingParroq(true);
      setError(null);
      //const data = await cargarDatosFireID(id);
      //setParroqData(data);
      setSelectedParroq(id);
    } catch (err) {
      console.error("Error al cargar datos de parroquia:", err);
      setError("Error al cargar datos de la parroquia seleccionada");
    } finally {
      setLoadingParroq(false);
    }
  };

  if (loading) {
    return (
      <>
        <Typography
          variant="h2"
          display="flex"
          align="center"
          alignContent="center"
        >
          Cargando Mapa de Susceptibilidad a incendios
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh" // Ajusta según tu diseño
        >
        
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <div
        style={{
          margin: "10px",
          textAlign: "center",
          padding: "20px",
          color: "red",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ margin: "10px" }}>
      <Grid container spacing={2}>
        <Grid
          item
          size={{ xs: 12, md: 3 }}
          style={{ height: "80vh", overflowY: "auto" }}
        >
          <Panel
            title="Comites Comunitarios"
            data={parroqData}
            selectedParroq={selectedParroq}
            loading={loadingParroq}
            fireData={eventInfo}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 9 }}>
         {/*  <MapBase
            data={polygonData}
            loading={loading}
            error={error}
            onSelectParroq={setSelectedParroq}
            onGetParroqData={getParroqData}
            selectedParroq={selectedParroq}
            setEvent={setDataEvent}
            dataEvent={eventInfo}
            mapConfig={{
              center: [-79.2, -3.99], // Coordenadas de Loja, Ecuador
              zoom: 10,
            }}
          /> */}
          <div>Here date from firemaps events</div>
        </Grid>
      </Grid>
    </div>
  );
}


export const fetchData = async () => {
  try {
    // setLoading(true);
    let url = `${SCRIPT_URL}?action=getData`;
    console.log(url)
    const response = await fetch(url);
 
    const result = await response.json();
   
    if (result.status === "success") {
    
    } else {
      console.error("Error al obtener datos:", result.data);

    }

    return result.data
  } catch (error) {
    console.error("Error:", error);
    alert(`error: `,error);
  } finally {
    // setLoading(false);
  }
};