import { Box, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Panel from "./comiteC/panel";
import MapBase from "./comiteC/mapBase";
import imageLoad from "../../assets/loading_map_3.gif";
//const SCRIPT_URL="https://script.google.com/macros/s/AKfycbyxm-B9P0mM_KSGboPz6E4hAVGd3xEt-PNpaW5UmsGA84hstMrlMX2ELh-lFQxg_Mg/exec"
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzj8eXN23mkkdZypf8yBayEMBA7Bt-MM0D_6Jp-34JxQCsg-8UkjZqM9nBoI6dw8nrK/exec";
export default function ComiteComunitario() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedvalue, setSelectedValue] = useState(null);
  const [barData, setBarData] = useState(null);
  const [loadingParroq, setLoadingParroq] = useState(false);
  const [eventInfo, setDataEvent] = useState();
  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // 1. Obtener datos
        const dataP = await dataSector();
        // 2. Guardar datos completos
        setData(dataP);
        // 3. Extraer barrios
        if (dataP) {
          const barrios = dataP
            .map((feature) => {
              // Acceder a las propiedades de CADA feature
              if (feature?.properties) {
                // Buscar barrio en diferentes posibles nombres de campo
                return feature.properties.BARRIO;
              }
              return null;
            })
            .filter((barrio) => barrio && typeof barrio === "string")
            .map((barrio) => barrio.trim())
            .filter((barrio, index, array) => array.indexOf(barrio) === index) // Únicos
            .sort();
          setBarData(barrios);
        } else {
          console.warn("⚠️ No hay features en los datos:", dataP);
          setBarData([]);
        }
      } catch (err) {
        console.error("❌ Error al cargar sectores:", err);
        setError(`Error al cargar datos: ${err.message}`);
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
      setSelectedValue(id);
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
          variant="h3"
          display="flex"
          align="center"
          alignContent="center"
        >
          Cargando Mapa de Sectores de Loja
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="40vh" // Ajusta según tu diseño
        >
          <img src={imageLoad} alt="Descripción de la imagen" />
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
            data={barData}
            selectedValue={selectedvalue}
            setSelectedValue={setSelectedValue}
            loading={loadingParroq}
            fireData={eventInfo}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 9 }}>
          <MapBase
            data={data}
            loading={loading}
            error={error}
           // onSelectParroq={setSelectedValue}
            onGetParroqData={getParroqData}
            selectedParroq={selectedvalue}
            setEvent={setDataEvent}
            dataEvent={eventInfo}
            mapConfig={{
              center: [-79.2, -3.99], // Coordenadas de Loja, Ecuador
              zoom: 10,
            }}
          />
          <div>Here date from firemaps events</div>
        </Grid>
      </Grid>
    </div>
  );
}

export const dataSector = async () => {
  try {
    // setLoading(true);
    let url = `${SCRIPT_URL}?action=getData`;
    const response = await fetch(url);
    const result = await response.json();
    if (result.status === "success") {
    } else {
      console.error("Error al obtener datos:", result.features);
    }
    return result.features;
  } catch (error) {
    console.error("Error:", error);
    alert(`error: `, error);
  } finally {
    // setLoading(false);
  }
};
