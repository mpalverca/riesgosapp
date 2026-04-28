import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Collapse,
  Stack,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

function LayerControl({
  label,
  icon,
  color,
  bgColor,
  count = 0,
  isLoading = false,
  isSelected = false,
  onToggle,
  onRefresh,
  showRefresh = true,
  showHideToggle = true,
  children, // Contenido adicional expandible (como estadísticas)
}) {
  const [expanded, setExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleHideToggle = () => {
    setIsHidden(!isHidden);
    if (onToggle && isHidden === false) {
      // Si se está ocultando, opcionalmente desactivar la capa
      if (onToggle) onToggle();
    }
  };

  if (isHidden) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 1,
          mb: 1,
          bgcolor: "#f5f5f5",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {icon}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {label} (oculto)
          </Typography>
        </Box>
        <Tooltip title="Mostrar capa">
          <IconButton size="small" onClick={handleHideToggle}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: isSelected ? bgColor : "transparent",
        transition: "all 0.2s",
        borderRadius: 1,
        mb: 1,
        overflow: "hidden",
      }}
    >
      {isLoading && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            borderRadius: 1,
            height: 2,
          }}
        />
      )}

      <Box sx={{ position: "relative", p: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <FormControlLabel
            sx={{
              ml: 1,
              flex: 1,
              borderRadius: 1,
              transition: "all 0.2s",
              "&:hover": { bgcolor: "action.hover" },
              opacity: isLoading ? 0.7 : 1,
            }}
            control={
              <Checkbox
                checked={isSelected}
                onChange={onToggle}
                icon={icon}
                checkedIcon={React.cloneElement(icon, { sx: { color: color } })}
                disabled={isLoading}
              />
            }
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: isSelected ? 500 : 400 }}>
                  {label}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {!isLoading ? (
                    <Chip
                      label={`${count}`}
                      size="small"
                      sx={{
                        bgcolor: color,
                        color: "white",
                        fontWeight: "bold",
                        minWidth: "32px",
                        height: "20px",
                        "& .MuiChip-label": { px: 1, fontSize: "0.7rem" },
                      }}
                    />
                  ) : (
                    <CircularProgress size={16} />
                  )}
                </Box>
              </Box>
            }
          />

          {/* Botones de acciones */}
          <Box sx={{ display: "flex", gap: 0.5, mr: 0.5 }}>
            {showRefresh && onRefresh && (
              <Tooltip title="Recargar datos">
                <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
                  <RefreshIcon fontSize="small" sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {showHideToggle && (
              <Tooltip title="Ocultar capa">
                <IconButton size="small" onClick={handleHideToggle}>
                  <VisibilityOffIcon fontSize="small" sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {children && (
              <Tooltip title="Ver detalles">
                <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Contenido expandible */}
        {children && (
          <Collapse in={expanded}>
            <Box sx={{ ml: 5, mt: 1, mb: 1, pl: 2, borderLeft: `2px solid ${color}` }}>
              {children}
            </Box>
          </Collapse>
        )}
      </Box>
    </Paper>
  );
}

export default LayerControl;