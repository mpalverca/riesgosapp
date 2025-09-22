import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import alertMap from "../components/alerts/alermaps";
import MapAfects from "../components/afects/afects";
import { Grid } from "@mui/material";
import Panel from "../components/afects/panel";
import { cargarDatosafec,cargarDatosParroquia } from "../components/afects/script.js";
export default function Alerts() {
  const [afectData, setAfectData] = useState([]);
  const [parroquia,setParroquia]=useState([]);
  const [coords, setCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priority, setPriority] = useState("Todos");
  const [estado, setEstado] = useState("Todos");
  const [afect, setAfect] = useState("Todos");
  const [selectedDate, setSelectedDate] = useState(null);
  const [parroq, setParroq]=useState("Todos")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await cargarDatosafec();
        const data2=await cargarDatosParroquia();
        // Filtramos solo elementos con geometría válida
        const filteredData = data.filter(
          (item) =>
            item?.geom?.coordinates &&
            Array.isArray(item.geom.coordinates) &&
            item.geom.coordinates.length > 0
        );
        setAfectData(filteredData);
        setParroquia(data2)
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
  const selFecha = (value) => {
    setSelectedDate(value);
  };
  const selParroq=(value)=>{
    setParroq(value)
  }
  const extractCoordinates = (geom) => {
    if (!geom || !geom.coordinates) return null;
    try {
      // Para Point: [lng, lat]
      if (geom.type === "Point") {
        if (
          geom.coordinates.length >= 2 &&
          !isNaN(geom.coordinates[0]) &&
          !isNaN(geom.coordinates[1])
        ) {
          return { lat: geom.coordinates[1], lng: geom.coordinates[0] };
        }
      }
      // Para Polygon: coordinates[0][0] = primer punto del primer anillo
      if (
        geom.type === "Polygon" &&
        Array.isArray(geom.coordinates[0]) &&
        Array.isArray(geom.coordinates[0][0]) &&
        geom.coordinates[0][0].length >= 2
      ) {
        const [lng, lat] = geom.coordinates[0][0];
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
      // Para MultiPolygon: coordinates[0][0][0] = primer punto del primer anillo del primer polígono
      if (
        geom.type === "MultiPolygon" &&
        Array.isArray(geom.coordinates[0]) &&
        Array.isArray(geom.coordinates[0][0]) &&
        Array.isArray(geom.coordinates[0][0][0]) &&
        geom.coordinates[0][0][0].length >= 2
      ) {
        const [lng, lat] = geom.coordinates[0][0][0];
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
      return null;
    } catch (e) {
      console.error("Error al procesar geometría:", geom, e);
      return null;
    }
  };

  const fechas = afectData.map((item) => new Date(item.date));
  const minFecha = fechas.length
    ? Math.min(...fechas.map((f) => f.getTime()))
    : null;
  const maxFecha = fechas.length
    ? Math.max(...fechas.map((f) => f.getTime()))
    : null;

  // Filtra por prioridad
  const filteredPriority =
    priority === "Todos"
      ? afectData
      : afectData.filter((item) => item.prioridad === priority);

  // Filtra por estado
  const filteredState =
    estado === "Todos"
      ? filteredPriority
      : filteredPriority.filter((item) => item.estado === estado);

  //filter byafectacion
  const fiterByAfect =
    afect === "Todos"
      ? filteredState
      : filteredState.filter((item) => item.afectacion === afect);

  const filteredByDate = selectedDate
    ? fiterByAfect.filter((item) => {
        const itemTime = new Date(item.date).setHours(0, 0, 0, 0);
        const selectedTime = new Date(selectedDate).setHours(0, 0, 0, 0);
        return itemTime <= selectedTime;
      })
    : fiterByAfect;

  // Puedes colocar esta función donde la necesites
function getRadio(afectData) {
  return afectData
    .filter(
      (item) =>
        item.prioridad=== "Alta" &&
        item.radio > 0 &&
        item.estado === "Pendiente"
    )
    .map((item) => ({
      id: item.id,
      nombre: item.nombre,
      PRIORIDAD: item.prioridad,
      radio: item.radio,
      ESTADO: item.estado,
      coords: item.geom?.coordinates || null,
      // Agrega aquí otras propiedades que necesites
    }));
}
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
            cantAfects={filteredByDate.length}
          radioafect={getRadio(afectData)}
          parroq={parroq}
          setParroq={selParroq}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <MapAfects
            afectData={filteredByDate}
            parroquia={parroquia}
            error={error}
            loading={loading}
            coords={coords}
            selectedDate={selectedDate}
            extractCoordinates={extractCoordinates}
            setSelectedDate={selFecha}
            minFecha={minFecha}
            maxFecha={maxFecha}
            radioAfect={getRadio(afectData)}
          />
        </Grid>
      </Grid>
    </div>
  );
}
