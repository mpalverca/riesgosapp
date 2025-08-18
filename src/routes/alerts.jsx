import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import alertMap from "../components/alerts/alermaps";
import MapAfects from "../components/afects/afects";
import { Grid } from "@mui/material";
import Panel from "../components/afects/panel";
import { cargarDatosafec } from "../components/afects/script.js";
export default function Alerts() {
  const [afectData, setAfectData] = useState([]);
  const [coords, setCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priority, setPriority] = useState("Todos");
  const [estado, setEstado] = useState("Todos");  
  const [afect, setAfect] = useState("Todos");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await cargarDatosafec();
        // Filtramos solo elementos con geometría válida
        const filteredData = data.filter(
          (item) =>
            item?.geom?.coordinates &&
            Array.isArray(item.geom.coordinates) &&
            item.geom.coordinates.length > 0
        );
        setAfectData(filteredData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos de afectaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addvar = (lat, long) => {
    setCoords([...coords, lat, long]);
  };
  const select = (value) => {
    setPriority(value);
  };
  const state = (value) => {
    setEstado(value);
  };
  const afectview = (value) => {
    setAfect(value);
  };

  

  return (
    <div style={{ margin: "10px" }}>
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 3 }}
          style={{ height: "80vh", overflowY: "auto" }}
        >
          <Panel
            addbar={addvar}
            prioridad={select}
            selectPriority={priority}
            estado={estado}
            setestado={state}
            afect={afect}
            setAfect={afectview}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <MapAfects
            afectData={afectData}
            error={error}
            loading={loading}
            coords={coords}
            priority={priority}
            estado={estado}
            afect={afect}
          />
        </Grid>
      </Grid>
    </div>
  );
}
