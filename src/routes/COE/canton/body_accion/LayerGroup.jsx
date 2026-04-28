import React, { useState } from "react";
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  Typography,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

function LayerGroup({ title, children, onRefreshAll, showRefreshAll = false }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          cursor: "pointer",
          "&:hover": { opacity: 0.8 },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#3519d2" }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {showRefreshAll && onRefreshAll && (
            <Tooltip title="Recargar todas las capas">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefreshAll();
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Stack spacing={1}>{children}</Stack>
      </Collapse>

      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
}

export default LayerGroup;