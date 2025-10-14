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
} from "@mui/material";
import * as turf from "@turf/turf";

export default function TableView({ data }) {
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
      <Paper elevation={3} sx={{ p: 1, mt: 1 }}>
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
                {/* <TableCell>
                  <strong>Polígonos</strong>
                </TableCell> */}
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
                      index % 2 === 0 ? "action.hover" : "background.paper",
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
                          : row.aptitud.toLowerCase().includes("medianas")
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
                {/*   <TableCell>
                    <Typography variant="body2" textAlign="center">
                      {row.cantidadPoligonos}
                    </Typography>
                  </TableCell> */}
                  <TableCell sx={{ maxWidth: 250 }}>
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
                        <Typography variant="caption" color="text.secondary">
                          +{row.estudios.length - 2} más
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
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
                        <Typography variant="caption" color="text.secondary">
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
  );
}

export function ViewPredio({ data, predio }) {
  // Procesar los datos para la tabla con intersecciones

  // Validar que las coordenadas sean válidas

  const tableData = useMemo(() => {
  

    if (
      !data ||
      !data.features ||
      !predio ||
      !predio[0] ||
      !predio[0].geometry
    ) {

      return [];
    }

    try {
      // 1. Crear polígono del predio - CORREGIDO para la estructura anidada
      const predioCoords = predio[0].geometry.coordinates;
      //console.log("Coordenadas del predio crudas:", predioCoords);

      // Aplanar la estructura de coordenadas
      let coordenadasAplanadas = predioCoords;

      if (
        Array.isArray(predioCoords) &&
        predioCoords.length === 1 &&
        Array.isArray(predioCoords[0]) &&
        predioCoords[0].length === 1 &&
        Array.isArray(predioCoords[0][0])
      ) {
        coordenadasAplanadas = [predioCoords[0][0]];
        //console.log("Coordenadas aplanadas:", coordenadasAplanadas);
      }

      // Validar que tengamos coordenadas válidas
      if (
        !Array.isArray(coordenadasAplanadas) ||
        coordenadasAplanadas.length === 0 ||
        !Array.isArray(coordenadasAplanadas[0]) ||
        coordenadasAplanadas[0].length < 4
      ) {
       // console.error("Coordenadas del predio no válidas después de aplanar");
        return [];
      }

      const predioPolygon = turf.polygon(coordenadasAplanadas);
      //console.log("Polígono del predio creado exitosamente");

      // 2. Procesar cada feature
      const processedData = [];
      let featuresConInterseccion =0
      let featuresConAreaValida = 0

      data.features.forEach((feature, index) => {
        try {
          //console.log(`Procesando feature ${index}:`, feature);

          // Validar feature básica
          if (!feature.geometry || !feature.geometry.coordinates) {
            //console.log(`Feature ${index} sin geometría válida`);
            return;
          }

          // Procesar coordenadas de la feature de la misma manera
          let featureCoords = feature.geometry.coordinates;
          //console.log(`Coordenadas feature ${index} crudas:`, featureCoords);

          // Aplanar estructura de la feature si es necesario
          if (
            Array.isArray(featureCoords) &&
            featureCoords.length === 1 &&
            Array.isArray(featureCoords[0]) &&
            featureCoords[0].length === 1 &&
            Array.isArray(featureCoords[0][0])
          ) {
            featureCoords = [featureCoords[0][0]];
            // console.log(`Coordenadas feature ${index} aplanadas:`, featureCoords);
          }

          // Validar coordenadas de la feature
          if (
            !Array.isArray(featureCoords) ||
            featureCoords.length === 0 ||
            !Array.isArray(featureCoords[0]) ||
            featureCoords[0].length < 4
          ) {
            //console.log(`Feature ${index} con coordenadas insuficientes después de aplanar`);
            return;
          }

          // Crear polígono de la feature
          const featurePolygon = turf.polygon(featureCoords);

          // Verificar si intersecta con el predio
          const intersects = turf.booleanIntersects(
            featurePolygon,
            predioPolygon
          );

          if (intersects === true) {
           
          }
          featuresConInterseccion++;

          // Calcular intersección exacta
             const intersection = turf.intersect(turf.featureCollection([featurePolygon, predioPolygon]));
   
          // Calcular área de la intersección
          const area = turf.area(intersection);
       
          if (area < 0.01) {
            return;
          }

          featuresConAreaValida++;

          const properties = feature.properties || {};
         
          // Extraer valores con más alternativas
          const aptitud =
            properties.aptitud ||
            properties.aptitud_original ||
            properties.APTITUD ||
            properties.Aptitud ||
            properties.tipo_aptitud ||
            "No definido";

          const estudio =
            properties.estudios ||
            properties.estudio_original ||
            properties.ESTUDIO ||
            properties.Estudio ||
            properties.tipo_estudio ||
            "No definido";

          const observaciones =
            properties.observac_1 ||
            properties.observac_2 ||
            properties.OBSERVACIONES ||
            properties.Observaciones ||
            properties.observacion ||
            properties.descripcion ||
            "Sin observaciones";

       

          // Buscar si ya existe esta aptitud en processedData
          const existingIndex = processedData.findIndex(
            (item) => item.aptitud === aptitud
          );

          if (existingIndex >= 0) {
            // Actualizar existente
            processedData[existingIndex].areaTotal += area;
            processedData[existingIndex].cantidadPoligonos += 1;

            if (
              estudio !== "No definido" &&
              !processedData[existingIndex].estudios.includes(estudio)
            ) {
              processedData[existingIndex].estudios.push(estudio);
            }

            if (
              observaciones !== "Sin observaciones" &&
              !processedData[existingIndex].observaciones.includes(
                observaciones
              )
            ) {
              processedData[existingIndex].observaciones.push(observaciones);
            }

           
          } else {
            // Crear nuevo
            processedData.push({
              aptitud,
              areaTotal: area,
              cantidadPoligonos: 1,
              estudios: estudio !== "No definido" ? [estudio] : [],
              observaciones:
                observaciones !== "Sin observaciones" ? [observaciones] : [],
            });
           
          }
        } catch (featureError) {
          // console.warn(`Error procesando feature ${index}:`, featureError);
        }
      });

    
      // Ordenar por área total
      const resultadoOrdenado = processedData.sort(
        (a, b) => b.areaTotal - a.areaTotal
      );
     

      return resultadoOrdenado;
    } catch (error) {
      console.error("Error general en tableData:", error);
      return [];
    }
  }, [data, predio]);

  // Calcular totales
  const totals = useMemo(() => {
    const result = tableData.reduce(
      (acc, item) => {
        acc.totalArea += item.areaTotal;
        acc.totalPoligonos += item.cantidadPoligonos;
        return acc;
      },
      { totalArea: 0, totalPoligonos: 0 }
    );

    return result;
  }, [tableData]);

  // Función para formatear área
  const formatArea = (area) => {
    if (area >= 10000) {
      return `${(area / 10000).toFixed(2)} ha`;
    }
    return `${area.toFixed(2)} m²`;
  };
  const formatporc = (area) => {
    return `${area.toFixed(2)} %`;
  };
;

  return (
    <div>
      <Paper elevation={3} sx={{ p: 1, mt: 1 }}>
        <Typography variant="h6" gutterBottom>
          Resumen de Aptitud Constructiva - Áreas Dentro del Predio
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Polígonos que intersectan: <strong>{totals.totalPoligonos}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Área Total Dentro del Predio:{" "}
            <strong>{formatArea(totals.totalArea)}</strong>
          </Typography>
        </Box>

        {tableData.length > 0 ? (
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Aptitud</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Área dentro del Predio</strong>
                  </TableCell>
                  <TableCell>
                    <strong>% área</strong>
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
                        index % 2 === 0 ? "action.hover" : "background.paper",
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
                            : row.aptitud.toLowerCase().includes("medianas")
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
                    <TableCell>
                      <Typography variant="body2" textAlign="center">
                        {formatporc(row.areaTotal/totals.totalArea*100)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>
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
                          <Typography variant="caption" color="text.secondary">
                            +{row.estudios.length - 2} más
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>
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
                          <Typography variant="caption" color="text.secondary">
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
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No se encontraron áreas que intersecten con el predio seleccionado
            </Typography>
          </Box>
        )}
      </Paper>
    </div>
  );
}