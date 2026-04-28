import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

function Panels({ title, body, defaultExpanded = true }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper elevation={2} sx={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
          bgcolor: "primary.main",
          color: "white",
          cursor: "pointer",
          "&:hover": { bgcolor: "primary.dark" },
        }}
        onClick={toggleExpand}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton size="small" sx={{ color: "white" }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Body */}
      <Collapse in={expanded} sx={{ flex: 1, overflow: "auto" }}>
        <Box sx={{ p: 1.5 }}>{body}</Box>
      </Collapse>
    </Paper>
  );
}

export default Panels;