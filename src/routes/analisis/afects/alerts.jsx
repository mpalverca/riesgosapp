import React, { useEffect, useState, lazy, Suspense } from "react";
import MenuIcon from "@mui/icons-material/Menu";
// import MapAfects from "./analisis/afects/afects";
import { Grid, IconButton } from "@mui/material";
// import Panel from "./analisis/afects/panel";
import { cargarDatosafec, cargarDatosParroquia } from "./script";
import PagesBody from "../../../components/pagesbody";
const MapAfects = lazy(() => import("./afects"));
const Panel = lazy(() => import("./panel"));

export default function Alerts() {
  const [afectData, setAfectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState([]);
  const [parroquia, setParroquia] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    parroquia: "Todos",
    prioridad: "Todos",
    estado: "Todos",
    event: "Todos",
    afect: "Todos",
    selectedDate: null,
    parroq: "Todos",
    atiende:"Todos"
  });

  const handleAfect = async () => {
    const data = await cargarDatosafec(
      filters.prioridad,
      filters.estado,
      filters.afect,
      filters.parroq,
      filters.event,
      filters.atiende,
    );
    const filteredData = data.filter(
      (item) =>
        item?.geom?.coordinates &&
        Array.isArray(item.geom.coordinates) &&
        item.geom.coordinates.length > 0,
    );
    setAfectData(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await cargarDatosParroquia();
        // Filtramos solo elementos con geometría válida

        setParroquia(data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos de afectaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const addvar = (lat, long) => {
    setCoords([...coords, lat, long]);
  };

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

  
   /* const filteredPriority =
    filters.prioridad === "Todos"
      ? afectData
      : afectData?.filter((item) => item.prioridad === filters.prioridad);

  const filteredState =
    filters.estado === "Todos"
      ? afectData
      : afectData.filter((item) => item.estado === filters.estado);

  const fiterByAfect =
    filters.afect === "Todos"
      ? filteredState
      : filteredState.filter((item) => item.afectacion === filters.afect); 

  // Filtro por evento
  const filteredEvent =
    filters.event === "Todos"
      ? afectData
      : afectData.filter((item) => item.event === filters.event);*/

  // Filtro por fecha (si selectedDate existe)
  const filteredByDate = filters.selectedDate
    ? afectData.filter((item) => {
        const itemTime = new Date(item.date).setHours(0, 0, 0, 0);
        const selectedTime = new Date(filters.selectedDate).setHours(
          0,
          0,
          0,
          0,
        );
        return itemTime >= selectedTime;
      })
    : afectData;

  // Puedes colocar esta función donde la necesites
  function getRadio(afectData) {
    return afectData
      .filter(
        (item) =>
          item.prioridad === "Alta" &&
          item.radio > 0 &&
          item.estado === "Pendiente",
      )
      .map((item) => ({
        id: item.id,
        nombre: item.nombre,
        prioridad: item.prioridad,
        radio: item.radio,
        Estado: item.estado,
        coords: item.geom?.coordinates || null,
        // Agrega aquí otras propiedades que necesites
      }));
  }
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div style={{ margin: "10px" }}>
        <PagesBody
          title={<strong>Visor Territorial de Afectaciones</strong>}
          panel={
            <Panel
              addbar={addvar}
              cantAfects={filteredByDate.length}
              radioafect={getRadio(afectData)}
              filters={filters}
              setFilters={setFilters}
              handleAfect={handleAfect}
              setSidebarOpen={setSidebarOpen}
            />
          }
          body={
            <MapAfects
              afectData={filteredByDate}
              parroquia={parroquia}
              error={error}
              loading={loading}
              coords={coords}
              selectedDate={filters.selectedDate}
              extractCoordinates={extractCoordinates}
              setSelectedDate={setFilters}
              minFecha={minFecha}
              maxFecha={maxFecha}
            />
          }
        />
       
      </div>
    </Suspense>
  );
}
