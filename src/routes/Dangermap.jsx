import React, { useState } from "react";
import { Typography, Grid } from "@mui/material";
import MapViewer from "../components/maps/MapViewer";
import InfoPanel from "../components/maps/controlPanel";

export default function Dangermap() {
  return (
    <div style={{ margin: "20px" }}>
      <Typography variant="h4">Susceptibilidad</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <InfoPanel/>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <MapViewer />
        </Grid>
      </Grid>
    </div>
  );
}
