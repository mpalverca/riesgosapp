import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
//import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
//import { useCoeData } from "./script";

const Coe = ({ role, ...props }) => {
  /* const {
    coeData,
    coeLoading,
    coeError,
    coeSheets,
    getSheets,
    getSheetData,
    searchInAllSheets,
    filterSheetsByType,
    clearData,
  } = useCoeData(); */

  const [selectedSheet, setSelectedSheet] = useState(null);
  //const [searchTerm, setSearchTerm] = useState("");
  //const [activeTab, setActiveTab] = useState(0);
  //const [filteredSheets, setFilteredSheets] = useState([]);

  // Filtrar hojas cuando cambia la pestaña
  useEffect(
    () => {
      //let filtered = [];
      // loadSheets();
      /* switch (activeTab) {
      case 0: // Todas
        filtered = coeSheets;
        break;
      case 1: // MTT
        filtered = coeSheets.filter((s) =>
          s.name.toLowerCase().includes("mtt")
        );
        break;
      case 2: // GT
        filtered = coeSheets.filter((s) => s.name.toLowerCase().includes("gt"));
        break;
      case 3: // Afectaciones
        filtered = coeSheets.filter((s) =>
          s.name.toLowerCase().includes("afectaciones")
        );
        break;
      case 4: // Acciones
        filtered = coeSheets.filter((s) =>
          s.name.toLowerCase().includes("acciones")
        );
        break;
      default:
        filtered = coeSheets; 
    }*/
      //setFilteredSheets(filtered);
    } /* [activeTab, coeSheets] */
  );

  /*  const loadSheets = async () => {
    await getSheets();
  }; */
  /* if (role !== "mmtt_lider") {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        <Typography>
        "Acceso denegado: No tienes permiso para ver esta página."
      </Typography>
      </Alert>
    ); 
  }*/
  /* const handleSheetSelect = async (sheetName) => {
    setSelectedSheet(sheetName);
    await getSheetData(sheetName);
  };
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await getSheetData(selectedSheet);
      return;
    } */
  // Si hay una hoja seleccionada, buscar en esa hoja
  /*  if (selectedSheet) {
      await getSheetData(selectedSheet, {
        search: searchTerm,
        column: "Descripcion", // Columna por defecto para buscar
      });
    } else {
      // Buscar en todas las hojas
      await searchInAllSheets(searchTerm);
    }
  }; */
  /*  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  }; */
  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom color="primary" align="center">
        🚨 Comite Operativo de Emergencias (COE) - MTT/GT
      </Typography>
      {/* Panel de busqueda */}
      {/* <SearchTerm
        setSelectedSheet={setSelectedSheet()}
        selectedSheet={selectedSheet}
      /> */}
    </Box>
  );
};

export default Coe;

const SearchTerm = ({ setSelectedSheet, selectedSheet }) => {
  const sheetOptions = [
    { value: "MMT1", label: "MMT1", category: "MMT" },
    { value: "MMT2", label: "MMT2", category: "MMT" },
    { value: "MMT3", label: "MMT3", category: "MMT" },
    { value: "MMT4", label: "MMT4", category: "MMT" },
    { value: "MMT5", label: "MMT5", category: "MMT" },
    { value: "MMT6", label: "MMT6", category: "MMT" },
    { value: "MMT7", label: "MMT7", category: "MMT" },
    { value: "GT1", label: "GT1 - Logística", category: "GT" },
    { value: "GT2", label: "GT2 - Operaciones", category: "GT" },
    { value: "GT3", label: "GT3 - Planeación", category: "GT" },
    { value: "Plenaria", label: "Plenaria", category: "General" },
    { value: "Secretario", label: "Secretaría Técnica", category: "General" },
  ];
  return (
    <Paper elevation={3} sx={{ p: 1, mb: 1, borderRadius: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item size={{ xs: 12, md: 4 }}>
          {/*  <TextField
            fullWidth
            label="🔍 Buscar término"
            placeholder="Ej: inundación, sismo, evacuación..."
            variant="outlined"
            size="small"
          /> */}
        </Grid>
        {/* <Grid item size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>📋 Tipo</InputLabel>
            <Select
              value={selectedSheet}
              label="📋 MMT y GT"
              onChange={(e) => setSelectedSheet(e.target.value)}
              sx={{ height: '40px' }}
            >
              <MenuItem value="">Todos</MenuItem>
              {sheetOptions.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  sx={{ 
                    pl: option.category === 'GT' ? 3 : 
                        option.category === 'General' ? 3 : 2
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
              
        </Grid> */}
        <Grid item size={{ xs: 12, md: 2 }}>
          <Button fullWidth variant="contained">
            Ingresar COE
          </Button>
        </Grid>
        <Grid item size={{ xs: 12, md: 2 }}></Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            registros cargados
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
