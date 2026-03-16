import { Box, Grid, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { useState } from "react";

const PagesBody = ({ title, panel, body }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <Box sx={{ overflow: "hidden" }}>
      <Grid container spacing={0} sx={{ height: "100%", flexWrap: "nowrap" }}>
        {/* Barra lateral izquierda */}
        <Grid
          item
          sx={{
            width: sidebarOpen ? 300 : 0,
            transition: "width 0.3s ease",
            overflow: "auto",
            height: "85vh",
            bgcolor: "#ffffff",           
            borderRight: sidebarOpen ? "1px solid #d8d8d8" : "none",
          }}
        >
          <Box
            sx={{
               // pt:20,
              width: 270,
              height: "100%",
              overflow: "auto",
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" align="center" alignContent="center">
                {title}
              </Typography>
              <IconButton onClick={() => setSidebarOpen(false)} size="small">
                <ChevronLeftIcon />
              </IconButton>
            </Box>
            {panel}
          </Box>
        </Grid>

        {/* Área del mapa */}
        <Grid
          item
          sx={{
            flex: 1,
            //height: "100%",
            position: "relative",
          }}
        >
          {!sidebarOpen && (
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 1200,
                bgcolor: "white",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ p: 2 }}>{body}</Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PagesBody;
