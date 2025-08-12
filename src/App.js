import React, { useEffect } from "react";
import { Box, Typography, Link, Container } from "@mui/material";
import Routes from "./routes";

function App() {
  //useEffect
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1 }}>
        <Routes />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 1,
          px: 2,
          mt: "auto",
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          color: "white",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body1"
            align="center"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
            }}
          >
            © 2025 Municipio de Loja - Coordinación de Gestión de Riesgos | Ing.
            Millán Paul Alverca Gaona | Ecuador - Loja |
            <Link
              href="https://www.loja.gob.ec/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                ml: 1,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Visita nuestro sitio web
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
