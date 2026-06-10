// components/AnalisisCards.jsx
import { useState } from "react";
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Fade,
  useTheme,
  alpha
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

// Componente reutilizable para las tarjetas de análisis
const AnalisisCards = ({
  items = [],
  title = "Sistema de Análisis de Riesgos",
  subtitle = "Monitoreo y análisis de riesgos naturales en el cantón Loja",
  footerText = "Selecciona un módulo para acceder al análisis detallado",
  redirectOutletRoutes = [],
  onItemClick,
  containerSx = {},
  cardSx = {},
  headerSx = {},
  footerSx = {},
  showHeader = true,
  showFooter = true,
  columns = { xs: 12, md: 6 },
  fadeTimeout = 800,
  cardElevation = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [hoveredId, setHoveredId] = useState(null);

  // Verificar si estamos en una ruta hija para mostrar Outlet
  const isChildRoute = redirectOutletRoutes.some((route) =>
    location.pathname.includes(route)
  );

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.route) {
      navigate(item.route);
    }
  };

  // Si estamos en una ruta hija, mostrar el Outlet
  if (isChildRoute && redirectOutletRoutes.length > 0) {
    return <Outlet />;
  }

  // Validar que items sea un array
  const validItems = Array.isArray(items) ? items : [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 4, md: 2 },
        px: { xs: 2, md: 4 },
        ...containerSx,
      }}
    >
      {/* Header */}
      {showHeader && (
        <Fade in timeout={fadeTimeout}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 }, ...headerSx }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Grid de tarjetas */}
      <Grid container spacing={3}>
        {validItems.map((item, index) => (
          <Grid item size={columns} key={item.id || index}>
            <Fade in timeout={fadeTimeout + (index * 100)}>
              <Card
                elevation={cardElevation}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                  position: "relative",
                  overflow: "visible",
                  ...cardSx,
                }}
                onClick={() => handleItemClick(item)}
              >
                {/* Badge */}
                {item.badge && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        bgcolor: alpha(item.color || theme.palette.primary.main, 0.9),
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 24,
                      }}
                    />
                  </Box>
                )}

                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(item.color || theme.palette.primary.main, 0.15),
                        color: item.color || theme.palette.primary.main,
                        width: 56,
                        height: 56,
                        mr: 2,
                        transition: "all 0.2s ease",
                        ...(hoveredId === item.id && {
                          bgcolor: item.color || theme.palette.primary.main,
                          color: "white",
                          transform: "scale(1.05)",
                        }),
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        flex: 1,
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Footer */}
      {showFooter && (
        <Fade in timeout={fadeTimeout + 200}>
          <Paper
            elevation={0}
            sx={{
              mt: 6,
              p: 2.5,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderRadius: 2,
              textAlign: "center",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              ...footerSx,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <span>✨</span>
              {footerText}
              <span>✨</span>
            </Typography>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default AnalisisCards;