import React, { useEffect, useState, lazy, Suspense } from "react";
import PagesBody from "../../../components/pagesbody";
import { Alert, Box, Grid, Typography } from "@mui/material";
import Panel from "./panel";
import { dataSector, useGetUmapal } from "./crud";
import MapView from "./mapVisor";
import WarningIcon from "@mui/icons-material/Warning";

export default function SerBas() {
  const [data, setData] = useState(null);
  const [errorS, setError] = useState(null);
  const [loadingS, setLoading] = useState(true);
  const [barData, setBarData] = useState(null);
  const [selectInfo, setSelectInfo] = useState(null);

  const [selectedvalue, setSelectedValue] = useState(null);
  const { dataU, loading, error, get, getAll } = useGetUmapal();
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
            .map((sector) => {
              // Acceder a las propiedades de CADA feature
              if (sector?.properties) {
                // Buscar barrio en diferentes posibles nombres de campo
                return sector.properties.BARRIO;
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
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Box sx={{}}>
        {/* Advertencia */}
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{
            m: 1,
            borderRadius: 2,
            "& .MuiAlert-message": { width: "100%" },
          }}
        >
          <Typography variant="body2">
            <strong>Importante:</strong> La información presentada es de manera
            referencial y deberá asumirse con el mayor cuidado y responsabilidad
            ya que la divulgación inadecuada de la misma está sujeta a acciones
            y sanciones contempladas en la Ley Organica de Gestión Integral de
            Riesgos de Desastres (LOGIRD).
          </Typography>
        </Alert>
        <Box>
          <Grid container spacing={2}>
            <Grid
              item
              size={{ xs: 12, md: 12 }}
              style={{ maxheight: "80vh", overflowY: "auto" }}
            >
              <Panel
                getData={get}
                getAllData={getAll}
                barData={barData}
                data={data}
                setSelectSect={setSelectInfo}
                selectedValue={selectedvalue}
                setSelectedValue={setSelectedValue}
                //fireData={eventInfo}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 12 }}>
              <MapView
                dataObj={dataU?.data}
                data={data}
                loading={loadingS}
                error={errorS}
                seletedInfo={selectInfo}
                selectedParroq={selectedvalue}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Suspense>
  );
}
