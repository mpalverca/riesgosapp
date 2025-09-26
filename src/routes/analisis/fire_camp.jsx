import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import InfoPanel from "../../components/maps/controlPanel";
import MapBase from "../../components/maps/mapBase";
import { cargarDatosFire, cargarDatosFireID } from "../../components/maps/script/script";
import Panel from "../../components/maps/panel";

export default function FireCamp() {
  const [polygonData, setPolygonData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedParroq, setSelectedParroq] = useState(null);
  const [parroqData, setParroqData] = useState(null);
  const [loadingParroq, setLoadingParroq] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cargarDatosFire();
        setPolygonData(data);
      } catch (err) {
        console.error("Error al cargar polígonos:", err);
        setError("Error al cargar datos de polígonos");
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
      const data = await cargarDatosFireID(id);
      setParroqData(data);
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
      <div style={{ margin: "10px", textAlign: "center", padding: "20px" }}>
        Cargando mapa de incendios forestales...
      </div>
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
        <Grid item size={{ xs: 12, md: 3 }}
        style={{ height: "80vh", overflowY: "auto" }}
        >
          <Panel
            title="Susceptibilidad a Incendios Forestales"
            data={parroqData}
            selectedParroq={selectedParroq}
            loading={loadingParroq}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 9 }}>
          <MapBase
            data={polygonData}
            loading={loading}
            error={error}
            onSelectParroq={setSelectedParroq}
            onGetParroqData={getParroqData}
            selectedParroq={selectedParroq}
            mapConfig={{
              center: [-79.2, -3.99], // Coordenadas de Loja, Ecuador
              zoom: 10,
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
