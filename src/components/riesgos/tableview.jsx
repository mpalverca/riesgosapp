import React, { useMemo } from "react";
import {

  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
export default function TableView({data}) {
      // Procesar los datos para la tabla
  const tableData = useMemo(() => {
    if (!data || !data.features) return [];

    const processedData = data.features.reduce((acc, feature) => {
      const properties = feature.properties || {};

      // Extraer valores (considerando diferentes nombres posibles de columnas)
      const aptitud =
        properties.aptitud ||
        properties.aptitud_original ||
        properties.APTITUD ||
        "No definido";
      const area = parseFloat(
        properties.area ||
          properties.area_ha ||
          properties.AREA ||
          properties.shape_area ||
          0
      );
      //const amenaza = properties.amenazas || properties.amenaza_original || properties.AMENAZA || properties.tipo_amenaza || 'No definido';
      const estudio =
        properties.estudios ||
        properties.estudio_original ||
        properties.ESTUDIO ||
        properties.tipo_estudio ||
        "No definido";
      const observaciones =
        properties.observac_1 ||
        properties.observac_2 ||
        properties.OBSERVACIONES ||
        properties.descripcion ||
        "Sin observaciones";

      // Buscar si ya existe esta combinación de aptitud y amenaza
      const existingIndex = acc.findIndex(
        (item) => item.aptitud === aptitud //&&         item.amenaza === amenaza
      );

      if (existingIndex >= 0) {
        // Actualizar existente
        acc[existingIndex].areaTotal += area;
        if (!acc[existingIndex].estudios.includes(estudio)) {
          acc[existingIndex].estudios.push(estudio);
        }
        if (
          observaciones !== "Sin observaciones" &&
          !acc[existingIndex].observaciones.includes(observaciones)
        ) {
          acc[existingIndex].observaciones.push(observaciones);
        }
        acc[existingIndex].cantidadPoligonos += 1;
      } else {
        // Crear nuevo
        acc.push({
          aptitud,
          //amenaza,
          areaTotal: area,
          estudios: estudio !== "No definido" ? [estudio] : [],
          observaciones:
            observaciones !== "Sin observaciones" ? [observaciones] : [],
          cantidadPoligonos: 1,
        });
      }

      return acc;
    }, []);

    return processedData.sort((a, b) => b.areaTotal - a.areaTotal);
  }, [data]);

  // Calcular totales
  const totals = useMemo(() => {
    return tableData.reduce(
      (acc, item) => {
        acc.totalArea += item.areaTotal;
        acc.totalPoligonos += item.cantidadPoligonos;
        return acc;
      },
      { totalArea: 0, totalPoligonos: 0 }
    );
  }, [tableData]);

   // Función para formatear área en hectáreas
  const formatArea = (area) => {
    return `${area.toFixed(2)} m2`;
  };
  
  return (
    <div>
       <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resumen de Aptitud Constructuva
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Polígonos: <strong>{totals.totalPoligonos}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Área Total: <strong>{formatArea(totals.totalArea)}</strong>
                </Typography>
              </Box>

              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Aptitud</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Área</strong>
                      </TableCell>
                      {/* // <TableCell><strong>Amenaza</strong></TableCell> */}
                      <TableCell>
                        <strong>Polígonos</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Estudios</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Observaciones</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor:
                            index % 2 === 0
                              ? "action.hover"
                              : "background.paper",
                        }}
                      >
                        <TableCell>
                          <Chip
                            label={row.aptitud}
                            size="small"
                            color={
                              row.aptitud.toLowerCase().includes("apto")
                                ? "success"
                                : row.aptitud.toLowerCase().includes("no apto")
                                ? "error"
                                : row.aptitud.toLowerCase().includes("moderado")
                                ? "warning"
                                : "default"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {formatArea(row.areaTotal)}
                          </Typography>
                        </TableCell>
                        {/* <TableCell>
                          <Chip 
                            label={row.amenaza} 
                            size="small"
                            variant="outlined"
                            color={
                              row.amenaza.toLowerCase().includes('alta') ? 'error' :
                              row.amenaza.toLowerCase().includes('media') ? 'warning' :
                              row.amenaza.toLowerCase().includes('baja') ? 'success' : 'default'
                            }
                          />
                        </TableCell> */}
                        <TableCell>
                          <Typography variant="body2" textAlign="center">
                            {row.cantidadPoligonos}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 150 }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            {row.estudios.slice(0, 2).map((estudio, i) => (
                              <Chip
                                key={i}
                                label={estudio}
                                size="small"
                                variant="filled"
                                sx={{ fontSize: "0.7rem", height: 20 }}
                              />
                            ))}
                            {row.estudios.length > 2 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                +{row.estudios.length - 2} más
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 150 }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            {row.observaciones.slice(0, 2).map((obs, i) => (
                              <Typography
                                key={i}
                                variant="caption"
                                title={obs}
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {obs}
                              </Typography>
                            ))}
                            {row.observaciones.length > 2 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                +{row.observaciones.length - 2} más
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
    </div>
  )
}
