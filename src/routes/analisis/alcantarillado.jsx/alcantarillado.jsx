import React, { useEffect, useState, lazy, Suspense } from "react";
import PagesBody from "../../../components/pagesbody";
import { Box, Grid } from "@mui/material";
import Panel from "./panel";
import { useGetUmapal } from "./crud";
import MapView from "./mapVisor";

export default function SerBas() {
  const [afectData, setAfectData] = useState([]);


  const {dataU, loading, error, get,getAll}= useGetUmapal()

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Box sx={{}}>
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
              //fireData={eventInfo}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 12 }}>
              <MapView
              data={dataU?.data}
              
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Suspense>
  );
}
