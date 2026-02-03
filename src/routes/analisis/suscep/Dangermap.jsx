import React, { useState } from "react";
import { Grid } from "@mui/material";
import MapViewer from "./MapViewer";
import InfoPanel from "../../../components/maps/controlPanel";

export default function Dangermap() {
  const [coord,setCoord] = useState([-3.99576, -79.20190]);
  console.log(coord)

  return (
    <div style={{ margin: "10px" }}>
     
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <InfoPanel coords={coord} setCoords={setCoord}/>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <MapViewer coord={coord} />
        </Grid>
      </Grid>
    </div>
  );
}
