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
    setCoords([...coords,  lat, long ]);
  };

  return (
    <div style={{ margin: "10px" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Panel addbar={addvar} />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <MapAfects afectData={afectData} error={error} loading={loading} coords={coords} />
        </Grid>
      </Grid>
    </div>
  );
}
