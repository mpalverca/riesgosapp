import {
  Box,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Chip,
} from "@mui/material";

export const TableRH = ({ resourceCodes, dataRE, resourceNames,...props }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: "auto" }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "primary.main",
                color: "white",
                minWidth: 250,
              }}
            >
              INSTITUCIÓN / DEPENDENCIA
            </TableCell>
            {resourceCodes.map((code) => (
              <TableCell
                key={code}
                align="center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "primary.main",
                  color: "white",
                  minWidth: 100,
                }}
              >
                <Box>
                  {/* <Typography
                    variant="caption"
                    display="block"
                    fontWeight="bold"
                  >
                    {code}
                  </Typography> */}
                  <Typography
                    variant="caption"
                    display="block"
                    fontSize="0.7rem"
                  >
                    {resourceNames[code] || code}
                  </Typography>
                </Box>
              </TableCell>
            ))}
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                backgroundColor: "primary.main",
                color: "white",
              }}
            >
              TOTAL
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dataRE.map((item, index) => {
            // Calcular total por fila
            let rowTotal = 0;
            resourceCodes.forEach((code) => {
              if (item[code] && typeof item[code] === "number") {
                rowTotal += item[code];
              }
            });

            return (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                {/* Columna de institución */}
                <TableCell sx={{ fontWeight: "medium" }}>
                  {item._columna?.fila5 || `Institución ${index + 1}`}
                  {/* {item._columna?.columna && (
                    <Typography
                      variant="caption"
                      display="block"
                      color="textSecondary"
                    >
                      Columna: {item._columna.columna}
                    </Typography>
                  )} */}
                </TableCell>

                {/* Columnas de recursos */}
                {resourceCodes.map((code) => {
                  const value = item[code];
                  const hasValue = value !== undefined && value !== null;

                  return (
                    <TableCell key={code} align="center">
                      {hasValue ? (
                        <Chip
                          label={value}
                          size="small"
                          color={value > 0 ? "primary" : "default"}
                          variant="outlined"
                          sx={{
                            minWidth: 40,
                            fontWeight: "bold",
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}

                {/* Columna de total */}
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  <Chip
                    label={rowTotal}
                    color="secondary"
                    size="medium"
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
              </TableRow>
            );
          })}

          {/* Fila de totales por columna */}
          <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
            <TableCell sx={{ fontWeight: "bold" }}>TOTALES</TableCell>

            {resourceCodes.map((code) => {
              // Calcular total por columna
              const columnTotal = dataRE.reduce((sum, item) => {
                return sum + (item[code] || 0);
              }, 0);

              return (
                <TableCell
                  key={code}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  {columnTotal > 0 ? (
                    <Chip
                      label={columnTotal}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      0
                    </Typography>
                  )}
                </TableCell>
              );
            })}

            {/* Total general */}
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              <Chip
                label={dataRE.reduce((total, item) => {
                  return (
                    total +
                    resourceCodes.reduce(
                      (sum, code) => sum + (item[code] || 0),
                      0,
                    )
                  );
                }, 0)}
                color="secondary"
                size="medium"
                sx={{ fontWeight: "bold" }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
