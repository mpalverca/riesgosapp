import { Grid } from "@mui/material";
import SectorMap from "../../components/riesgos/mapsview";
import CatastroMap from "../../components/riesgos/panel";


const RiesgosPage = () => {
  return (
    <div style={{ margin: "10px" }}>
      <Grid container spacing={2}>
       {/*  <Grid
          item
          size={{ xs: 12, md: 3 }}
          style={{ height: "80vh", overflowY: "auto" }}
        >
          <CatastroMap/>
        </Grid> */}
        <Grid item size={{ xs: 12, md: 12 }}>
         <SectorMap/>
        </Grid>
      </Grid>
    </div>
  );
};

export default RiesgosPage;
