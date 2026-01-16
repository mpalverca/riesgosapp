import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useCoeData } from "./script";

const Coe = ({ role, ...props }) => {
  const {
    coeData,
    coeLoading,
    coeError,
    coeSheets,
    getSheets,
    getSheetData,
    searchInAllSheets,
    filterSheetsByType,
    clearData,
  } = useCoeData();

  const [selectedSheet, setSelectedSheet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [filteredSheets, setFilteredSheets] = useState([]);

  // Cargar hojas al iniciar
  /*  useEffect(() => {
   loadSheets();
  }, []); */

  // Filtrar hojas cuando cambia la pestaña
  useEffect(() => {
    let filtered = [];
    loadSheets();
    switch (activeTab) {
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
    }

    setFilteredSheets(filtered);
  }, [activeTab, coeSheets]);

  const loadSheets = async () => {
    await getSheets();
  };

  /* if (role !== "mmtt_lider") {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        <Typography>
        "Acceso denegado: No tienes permiso para ver esta página."
      </Typography>
      </Alert>
    ); 
  }*/



  const handleSheetSelect = async (sheetName) => {
    setSelectedSheet(sheetName);
    await getSheetData(sheetName);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await getSheetData(selectedSheet);
      return;
    }

    // Si hay una hoja seleccionada, buscar en esa hoja
    if (selectedSheet) {
      await getSheetData(selectedSheet, {
        search: searchTerm,
        column: "Descripcion", // Columna por defecto para buscar
      });
    } else {
      // Buscar en todas las hojas
      await searchInAllSheets(searchTerm);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom color="primary">
        🗂️ Navegador de Datos COE MTT/GT
      </Typography>

      {/* Panel de control */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item size={{xs:12, md:4}}>
            <TextField
              fullWidth
              label="🔍 Buscar término"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ej: inundación, sismo, evacuación..."
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item size={{xs:12, md:2}}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={coeLoading || (!searchTerm && !selectedSheet)}
              startIcon={
                coeLoading ? <CircularProgress size={20} /> : <SearchIcon />
              }
            >
              {coeLoading ? "Buscando..." : "Buscar"}
            </Button>
          </Grid>

          <Grid item size={{xs:12, md:2}}>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearData}
              startIcon={<RefreshIcon />}
            >
              Limpiar
            </Button>
          </Grid>

          <Grid item size={{xs:12, md:4}}>
            <Typography variant="body2" color="text.secondary">
              {coeSheets.length} hojas disponibles •{coeData?.rows?.length || 0}{" "}
              registros cargados
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Mensajes de error */}
      {coeError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => clearData()}>
          Error: {coeError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Panel izquierdo: Lista de hojas */}
        <Grid item size={{xs:12, md:4}}>
          <Paper
            elevation={2}
            sx={{ p: 2, borderRadius: 2, height: "70vh", overflow: "hidden" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">📄 Hojas Disponibles</Typography>
              <Chip
                label={`${coeSheets.length} hojas`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            {/* Tabs para filtrar */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              <Tab label="Todas" />
              <Tab label="MTT" />
              <Tab label="GT" />
              <Tab label="Afectaciones" />
              <Tab label="Acciones" />
            </Tabs>

            {/* Lista de hojas */}
            <Box sx={{ height: "calc(70vh - 120px)", overflowY: "auto" }}>
              {coeLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : filteredSheets.length === 0 ? (
                <Typography
                  color="text.secondary"
                  sx={{ p: 2, textAlign: "center" }}
                >
                  No hay hojas disponibles
                </Typography>
              ) : (
                filteredSheets.map((sheet) => (
                  <Card
                    key={sheet.name}
                    sx={{
                      mb: 1,
                      cursor: "pointer",
                      backgroundColor:
                        selectedSheet === sheet.name
                          ? "action.selected"
                          : "background.paper",
                      border:
                        selectedSheet === sheet.name
                          ? "2px solid #1976d2"
                          : "1px solid #e0e0e0",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        transform: "translateY(-2px)",
                        transition: "all 0.2s",
                      },
                    }}
                    onClick={() => handleSheetSelect(sheet.name)}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" noWrap>
                        {sheet.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {sheet.totalRows} filas
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {sheet.totalColumns} cols
                        </Typography>
                      </Box>
                      {sheet.headers && sheet.headers.length > 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {sheet.headers.slice(0, 2).join(", ")}...
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Panel derecho: Datos de la hoja seleccionada */}
        <Grid item size={{xs:12, md:8}}>
          <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: 2, height: "70vh", overflow: "hidden" }}
          >
            {selectedSheet ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    📊 Datos de: {selectedSheet}
                  </Typography>
                  {coeData && (
                    <Chip
                      label={`${coeData.rows?.length || 0} registros`}
                      color="primary"
                      size="small"
                    />
                  )}
                </Box>

                {coeLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                    }}
                  >
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Cargando datos...</Typography>
                  </Box>
                ) : coeData ? (
                  <Box sx={{ height: "calc(70vh - 100px)", overflow: "auto" }}>
                    {coeData.rows && coeData.rows.length > 0 ? (
                      <>
                        {/* Tabla de datos */}
                        <TableContainer>
                          <Table size="small" stickyHeader>
                            <TableHead>
                              <TableRow>
                                {coeData.headers?.map((header, index) => (
                                  <TableCell
                                    key={index}
                                    sx={{
                                      fontWeight: "bold",
                                      bgcolor: "grey.100",
                                    }}
                                  >
                                    {header}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {coeData.rows
                                .slice(0, 50)
                                .map((row, rowIndex) => (
                                  <TableRow
                                    key={rowIndex}
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "action.hover",
                                      },
                                      backgroundColor:
                                        rowIndex % 2 === 0
                                          ? "white"
                                          : "grey.50",
                                    }}
                                  >
                                    {coeData.headers?.map(
                                      (header, colIndex) => (
                                        <TableCell key={colIndex}>
                                          {typeof row[header] === "object"
                                            ? JSON.stringify(row[header])
                                            : String(row[header] || "")}
                                        </TableCell>
                                      )
                                    )}
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {coeData.rows.length > 50 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              mt: 2,
                              textAlign: "center",
                            }}
                          >
                            Mostrando 50 de {coeData.rows.length} registros
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "50vh",
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          gutterBottom
                        >
                          📭 Hoja vacía
                        </Typography>
                        <Typography color="text.secondary">
                          No hay datos en esta hoja
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "50vh",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      📋 Selecciona una hoja
                    </Typography>
                    <Typography color="text.secondary" align="center">
                      Haz clic en una hoja de la lista para ver sus datos
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "70vh",
                }}
              >
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  🗂️ Navegador COE MTT/GT
                </Typography>
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 3 }}
                >
                  Selecciona una hoja del panel izquierdo para explorar los
                  datos
                </Typography>

                <Grid container spacing={2} sx={{ maxWidth: 600 }}>
                  <Grid item xs={6}>
                    <Card sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="h6" color="primary">
                        MTT
                      </Typography>
                      <Typography variant="body2">
                        Mesas Técnicas Territoriales
                      </Typography>
                      <Chip
                        label={`${
                          coeSheets.filter((s) => s.name.includes("MTT")).length
                        } hojas`}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="h6" color="primary">
                        GT
                      </Typography>
                      <Typography variant="body2">Grupos de Trabajo</Typography>
                      <Chip
                        label={`${
                          coeSheets.filter((s) => s.name.includes("GT")).length
                        } hojas`}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Coe;
