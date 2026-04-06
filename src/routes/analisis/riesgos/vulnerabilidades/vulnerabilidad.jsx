import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { varAmbientales, varEconomicas, varFisicas, varSociales } from "./vFisicas";

const Vulnerabilidad = ({
  valores,
  handleChange,
  calcularSuma,
  reiniciarValores,
}) => {
  const HeadTableVul = ({ title }) => {
    return (
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
            Variable
          </TableCell>
          <TableCell
            sx={{
              fontWeight: "bold",
              textAlign: "center",
            }}
            colSpan={3}
          >
            {title}
          </TableCell>
        </TableRow>
        <TableRow sx={{ backgroundColor: "#fafafa" }}>
          <TableCell></TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              color: "#4caf50",
              fontWeight: "bold",
            }}
          >
            Baja (1)
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              color: "#ff9800",
              fontWeight: "bold",
            }}
          >
            Media (2)
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              color: "#f44336",
              fontWeight: "bold",
            }}
          >
            Alta (3)
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };
  return (
    <div>
      <Typography variant="h6">General</Typography>
      <Typography variant="body1">
        determinar el nivel de riesgos es accionar parte{" "}
      </Typography>
      <Accordion>
        <AccordionSummary
          /* expandIcon={<ExpandMoreIcon/>} */
          aria-controls="panel1a-content"
        >
          <Typography variant="h6">Vulnerabilidad </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            la susceptibilidad del predio indica los niveles de riesgo asociados
            a factores como la topografía, el tipo de suelo, la proximidad a
            cuerpos de agua, entre otros. Un predio con alta susceptibilidad
            puede ser más vulnerable a deslizamientos, inundaciones u otros
            eventos naturales, lo que implica que se deben tomar medidas
            preventivas adicionales para mitigar estos riesgos.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ mb: 2, fontWeight: "bold" }}>
            Vulnerailidad Fisica
          </Typography>
          <Typography variant="body2" align="justify">
            {" "}
            Está relacionada con la calidad o tipo de material utilizado y el
            tipo de construcción de las viviendas, establecimientos económicos
            (comerciales e industriales) y de servicios (salud, educación,
            instituciones públicas), e infra estructura socioeconómica
            (centrales hidroeléctricas, vías, puentes y sistemas de riesgo),
            para asimilar los efectos de los fenómenos que constituyen una
            amenaza. Otro aspecto importante es la calidad del suelo y el lugar
            donde se encuentran los centros poblados, cerca de fallas
            geológicas, laderas de cerros, riberas de ríos, áreas costeras;
            situación que incrementa significativamente su nivel de
            vulnerabilidad. En el plan cantonal de gestión del riesgo será de
            terminado el nivel de vulnerabilidad física únicamente para la
            infraestructura vital (vías, puentes, hospitales, servicios básicos,
            estaciones de bomberos, estaciones de policía, equipamientos, entre
            otros)
          </Typography>
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Matriz de Vulnerabilidad Física
            </Typography>

            <TableContainer component={Paper} elevation={3}>
              <Table sx={{ minWidth: 650 }}>
                <HeadTableVul title="Matriz de Vulnerabilidad Física" />
                <TableBody>
                  {varFisicas.map((variable) => (
                    <TableRow key={variable.id} hover>
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {variable.nombre}
                      </TableCell>
                      {variable.opciones.map((opcion, index) => (
                        <TableCell key={index} sx={{ textAlign: "center" }}>
                          <RadioGroup
                            value={valores[variable.id]}
                            onChange={(e) =>
                              handleChange(variable.id, e.target.value)
                            }
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <FormControlLabel
                              value={opcion.valor.toString()}
                              control={<Radio />}
                              label={opcion.descripcion}
                              sx={{
                                m: 0,
                                "& .MuiFormControlLabel-label": {
                                  fontSize: "0.875rem",
                                  textAlign: "left",
                                  maxWidth: "250px",
                                },
                              }}
                            />
                          </RadioGroup>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Tarjeta con el total */}
            <Card sx={{ mt: 3, backgroundColor: "#e3f2fd" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Total Vulnerabilidad Física:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      {calcularSuma()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      / 15
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={reiniciarValores}
                      sx={{ ml: 2 }}
                    >
                      Reiniciar
                    </Button>
                  </Box>
                </Box>

                {/* Indicador de nivel de vulnerabilidad */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Nivel de Vulnerabilidad:
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: "10px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(calcularSuma() / 15) * 100}%`,
                        height: "100%",
                        backgroundColor:
                          calcularSuma() <= 8
                            ? "#4caf50"
                            : calcularSuma() <= 12
                              ? "#ff9800"
                              : "#f44336",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      color: "text.secondary",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span>Baja (5-8)</span>
                    <span>Media (9-12)</span>
                    <span>Alta (13-15)</span>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Matriz de Vulnerabilidad Economica
          </Typography>
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }}>
              <HeadTableVul title="Matriz de Vulnerabilidad Economica" />
            </Table>
            <TableBody>
              {varEconomicas.map((variable) => (
                <TableRow key={variable.id} hover>
                  <TableCell sx={{ fontWeight: "medium" }}>
                    {variable.nombre}
                  </TableCell>
                  {variable.opciones.map((opcion, index) => (
                    <TableCell key={index} sx={{ textAlign: "center" }}>
                      <RadioGroup
                        value={valores[variable.id]}
                        onChange={(e) =>
                          handleChange(variable.id, e.target.value)
                        }
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControlLabel
                          value={opcion.valor.toString()}
                          control={<Radio />}
                          label={opcion.descripcion}
                          sx={{
                            m: 0,
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.875rem",
                              textAlign: "left",
                              maxWidth: "250px",
                            },
                          }}
                        />
                      </RadioGroup>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Matriz de Vulnerabilidad Ambientales
          </Typography>
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }}>
              <HeadTableVul title="Matriz de Vulnerabilidad Economica" />
            </Table>
            <TableBody>
              {varAmbientales.map((variable) => (
                <TableRow key={variable.id} hover>
                  <TableCell sx={{ fontWeight: "medium" }}>
                    {variable.nombre}
                  </TableCell>
                  {variable.opciones.map((opcion, index) => (
                    <TableCell key={index} sx={{ textAlign: "center" }}>
                      <RadioGroup
                        value={valores[variable.id]}
                        onChange={(e) =>
                          handleChange(variable.id, e.target.value)
                        }
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControlLabel
                          value={opcion.valor.toString()}
                          control={<Radio />}
                          label={opcion.descripcion}
                          sx={{
                            m: 0,
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.875rem",
                              textAlign: "left",
                              maxWidth: "250px",
                            },
                          }}
                        />
                      </RadioGroup>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Matriz de Vulnerabilidad Sociales
            </Typography>

            <TableContainer component={Paper} elevation={3}>
              <Table sx={{ minWidth: 650 }}>
                <HeadTableVul title="Matriz de Vulnerabilidad Sociales" />
                <TableBody>
                  {varSociales.map((variable) => (
                    <TableRow key={variable.id} hover>
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {variable.nombre}
                      </TableCell>
                      {variable.opciones.map((opcion, index) => (
                        <TableCell key={index} sx={{ textAlign: "center" }}>
                          <RadioGroup
                            value={valores[variable.id]}
                            onChange={(e) =>
                              handleChange(variable.id, e.target.value)
                            }
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <FormControlLabel
                              value={opcion.valor.toString()}
                              control={<Radio />}
                              label={opcion.descripcion}
                              sx={{
                                m: 0,
                                "& .MuiFormControlLabel-label": {
                                  fontSize: "0.875rem",
                                  textAlign: "left",
                                  maxWidth: "250px",
                                },
                              }}
                            />
                          </RadioGroup>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Vulnerabilidad;
