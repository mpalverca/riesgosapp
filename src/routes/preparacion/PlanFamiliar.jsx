import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,

} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

const PlanFamiliar = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [familyData, setFamilyData] = useState({
    apellidos: "",
    direccion: "",
    telefonoCelular: "",
    telefonoConvencional: "",
    ubicacion: "",
    añoPermiso: "",
    codigoPermiso: "",
    sinPermiso: false,
  });
  const [selectedRisks, setSelectedRisks] = useState([]);
  const [otherRisks, setOtherRisks] = useState("");
  const [points, setPoints] = useState([]);
  const [openPointDialog, setOpenPointDialog] = useState(false);
  const [pointForm, setPointForm] = useState({
    tipo: "",
    nombre: "",
    telefono: "",
    direccion: "",
    coordenadas: "",
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [memberForm, setMemberForm] = useState({
    nombre: "",
    edad: "",
    sangre: "",
    parentesco: "Padre",
    discapacidad: "",
    responsabilidad: "",
    medicamentos: "",
  });
  const [pets, setPets] = useState([]);
  const [openPetDialog, setOpenPetDialog] = useState(false);
  const [petForm, setPetForm] = useState({
    nombre: "",
    especie: "Perro",
    edad: "",
    carnet: "",
    esterilizado: "No",
    notas: "",
  });
  const [emergencyKit, setEmergencyKit] = useState({
    varios: {},
    aseo: {},
    botiquin: {},
  });
  const [otherItems, setOtherItems] = useState("");
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [openVulnerabilityDialog, setOpenVulnerabilityDialog] = useState(false);
  const [vulnerabilityForm, setVulnerabilityForm] = useState({
    espacio: "Toda la vivienda",
    vulnerabilidades: "",
    acciones: "",
    prioridad: "Alta",
  });

  const steps = [
    "Información Básica",
    "Identificación de Riesgos",
    "Mapeo de Ubicaciones",
    "Integrantes Familiares",
    "Mascotas de la Familia",
    "Mochila de Emergencia",
    "Vulnerabilidad de la Vivienda",
    "Resumen del Plan",
  ];

  const toggleRisk = (risk) => {
    if (selectedRisks.includes(risk)) {
      setSelectedRisks(selectedRisks.filter((r) => r !== risk));
    } else {
      setSelectedRisks([...selectedRisks, risk]);
    }
  };

  const handleFamilyDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFamilyData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePointFormChange = (e) => {
    const { name, value } = e.target;
    setPointForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePoint = () => {
    setPoints([...points, pointForm]);
    setOpenPointDialog(false);
    setPointForm({
      tipo: "",
      nombre: "",
      telefono: "",
      direccion: "",
      coordenadas: "",
    });
  };

  const handleMemberFormChange = (e) => {
    const { name, value } = e.target;
    setMemberForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveMember = () => {
    setFamilyMembers([...familyMembers, memberForm]);
    setOpenMemberDialog(false);
    setMemberForm({
      nombre: "",
      edad: "",
      sangre: "",
      parentesco: "Padre",
      discapacidad: "",
      responsabilidad: "",
      medicamentos: "",
    });
  };

  const handlePetFormChange = (e) => {
    const { name, value } = e.target;
    setPetForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePet = () => {
    setPets([...pets, petForm]);
    setOpenPetDialog(false);
    setPetForm({
      nombre: "",
      especie: "Perro",
      edad: "",
      carnet: "",
      esterilizado: "No",
      notas: "",
    });
  };

  const toggleEmergencyItem = (category, item) => {
    setEmergencyKit((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item],
      },
    }));
  };

  const handleVulnerabilityFormChange = (e) => {
    const { name, value } = e.target;
    setVulnerabilityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveVulnerability = () => {
    setVulnerabilities([...vulnerabilities, vulnerabilityForm]);
    setOpenVulnerabilityDialog(false);
    setVulnerabilityForm({
      espacio: "Toda la vivienda",
      vulnerabilidades: "",
      acciones: "",
      prioridad: "Alta",
    });
  };

  const saveCompletePlan = () => {
    // Lógica para guardar el plan completo
    console.log("Plan guardado");
  };

  const riskOptions = [
    { value: "sismo", label: "Sismos/Terremotos", icon: "🌍" },
    { value: "inundacion", label: "Inundaciones", icon: "🌊" },
    { value: "volcan", label: "Actividad Volcánica", icon: "🌋" },
    { value: "deslizamiento", label: "Movimiento de Ladera", icon: "⛰️" },
    { value: "incendio", label: "Incendios Forestales", icon: "🔥" },
    { value: "sequia", label: "Sequía", icon: "🏜️" },
    { value: "tsunami", label: "Tsunami (zona costera)", icon: "🌊" },
  ];

  const emergencyItems = {
    varios: [
      { id: "linterna", label: "Linterna" },
      { id: "pilas", label: "Pilas extras" },
      { id: "radio", label: "Radio portátil" },
      { id: "silbato", label: "Silbato" },
      { id: "mascarillas", label: "Mascarillas" },
    ],
    aseo: [
      { id: "jabon", label: "Jabón" },
      { id: "cepillo", label: "Cepillo de dientes" },
      { id: "pasta", label: "Pasta dental" },
      { id: "toallas", label: "Toallas higiénicas" },
      { id: "papel", label: "Papel higiénico" },
    ],
    botiquin: [
      { id: "guantes", label: "Guantes de látex" },
      { id: "algodon", label: "Algodón" },
      { id: "alcohol", label: "Alcohol" },
      { id: "vendas", label: "Vendas" },
      { id: "analgesicos", label: "Analgésicos" },
    ],
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Paso 0: Información Básica de la Familia */}
      {activeStep === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Información Básica de la Familia
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            📌 Datos esenciales: Esta información será vital para contactar a tu
            familia en caso de emergencia.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Apellidos Familiares"
                name="apellidos"
                value={familyData.apellidos}
                onChange={handleFamilyDataChange}
                placeholder="Ej: Pérez González"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Dirección exacta"
                name="direccion"
                value={familyData.direccion}
                onChange={handleFamilyDataChange}
                placeholder="Ej: Av. Amazonas N12-34 y Av. Patria"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Teléfono celular principal"
                name="telefonoCelular"
                value={familyData.telefonoCelular}
                onChange={handleFamilyDataChange}
                placeholder="Ej: 0987654321"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono convencional"
                name="telefonoConvencional"
                value={familyData.telefonoConvencional}
                onChange={handleFamilyDataChange}
                placeholder="Ej: 022345678"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ubicación (barrio/sector)"
                name="ubicacion"
                value={familyData.ubicacion}
                onChange={handleFamilyDataChange}
                placeholder="Ej: Barrio La Floresta, sector norte"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Año de permiso de construcción"
                name="añoPermiso"
                type="date"
                value={familyData.añoPermiso}
                onChange={handleFamilyDataChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código de permiso de construcción"
                name="codigoPermiso"
                value={familyData.codigoPermiso}
                onChange={handleFamilyDataChange}
                placeholder="Ej: Abc123"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={familyData.sinPermiso}
                    onChange={handleFamilyDataChange}
                    name="sinPermiso"
                  />
                }
                label="No poseo permiso de construcción"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={handleNext} variant="contained">
              Continuar <ArrowForwardIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Paper>
      )}

      {/* Paso 1: Identificación de Riesgos */}
      {activeStep === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Identificación de Amenaza
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            📌 Recomendación: Identificar correctamente los riesgos específicos
            de tu zona reduce en un 70% los daños durante emergencias.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Selecciona los riesgos de tu zona:
              </Typography>
              <Grid container spacing={1}>
                {riskOptions.map((risk) => (
                  <Grid item xs={12} sm={6} key={risk.value}>
                    <Card
                      variant="outlined"
                      sx={{
                        cursor: "pointer",
                        borderColor: selectedRisks.includes(risk.value)
                          ? "primary.main"
                          : "divider",
                        backgroundColor: selectedRisks.includes(risk.value)
                          ? "primary.light"
                          : "background.paper",
                      }}
                      onClick={() => toggleRisk(risk.value)}
                    >
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Typography variant="h6">{risk.icon}</Typography>
                        <Typography variant="body2">{risk.label}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <TextField
                fullWidth
                label="Otros riesgos (especificar)"
                value={otherRisks}
                onChange={(e) => setOtherRisks(e.target.value)}
                placeholder="Ej: Accidentes químicos, fallas eléctricas"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Mapa de amenazas locales:
              </Typography>
              <Box
                sx={{
                  height: 300,
                  bgcolor: "grey.100",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Mapa interactivo aquí
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
              Regresar
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
            >
              Continuar
            </Button>
          </Box>
        </Paper>
      )}

      {/* Paso 2: Mapeo de Ubicaciones */}
      {activeStep === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Mapeo de Ubicaciones
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            ℹ️ Instrucciones: Haz clic en el mapa para marcar ubicaciones
            importantes, selecciona el tipo de punto y completa la información
            requerida.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  height: 400,
                  bgcolor: "grey.100",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Mapa interactivo aquí
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Puntos mapeados
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {points.map((point, index) => (
                      <TableRow key={index}>
                        <TableCell>{point.tipo}</TableCell>
                        <TableCell>{point.nombre}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenPointDialog(true)}
                sx={{ mt: 2 }}
                fullWidth
              >
                Agregar Punto
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
              Regresar
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
            >
              Continuar
            </Button>
          </Box>

          {/* Diálogo para agregar puntos */}
          <Dialog
            open={openPointDialog}
            onClose={() => setOpenPointDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Agregar Punto</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    select
                    label="Tipo de punto"
                    name="tipo"
                    value={pointForm.tipo}
                    onChange={handlePointFormChange}
                  >
                    <MenuItem value="">Seleccionar...</MenuItem>
                    <MenuItem value="vivienda">Vivienda</MenuItem>
                    <MenuItem value="hospital">Hospital/Centro Médico</MenuItem>
                    <MenuItem value="medico">Médico Familiar</MenuItem>
                    <MenuItem value="familiar">Familiar</MenuItem>
                    <MenuItem value="seguro">Punto Seguro</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Nombre"
                    name="nombre"
                    value={pointForm.nombre}
                    onChange={handlePointFormChange}
                    placeholder="Ej: Hospital Metropolitano"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={pointForm.telefono}
                    onChange={handlePointFormChange}
                    placeholder="Ej: 022345678"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección exacta"
                    name="direccion"
                    value={pointForm.direccion}
                    onChange={handlePointFormChange}
                    placeholder="Ej: Av. Mariana de Jesús Oe3-17"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPointDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={savePoint} variant="contained">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      )}

      {/* Paso 3: Integrantes Familiares */}
      {activeStep === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Integrantes Familiares
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            📌 Importante: Incluye a todos los miembros del hogar, especialmente
            niños, adultos mayores y personas con discapacidad.
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Edad</TableCell>
                  <TableCell>Tipo Sangre</TableCell>
                  <TableCell>Parentesco</TableCell>
                  <TableCell>Discapacidad</TableCell>
                  <TableCell>Responsabilidad</TableCell>
                  <TableCell>Medicamentos</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familyMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{member.nombre}</TableCell>
                    <TableCell>{member.edad}</TableCell>
                    <TableCell>{member.sangre}</TableCell>
                    <TableCell>{member.parentesco}</TableCell>
                    <TableCell>{member.discapacidad}</TableCell>
                    <TableCell>{member.responsabilidad}</TableCell>
                    <TableCell>{member.medicamentos}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenMemberDialog(true)}
            sx={{ mt: 2 }}
          >
            Agregar Familiar
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
              Regresar
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
            >
              Continuar
            </Button>
          </Box>

          {/* Diálogo para agregar familiares */}
          <Dialog
            open={openMemberDialog}
            onClose={() => setOpenMemberDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Agregar Integrante Familiar</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Nombre completo"
                    name="nombre"
                    value={memberForm.nombre}
                    onChange={handleMemberFormChange}
                    placeholder="Ej: María Guadalupe Pérez"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Edad"
                    name="edad"
                    type="number"
                    value={memberForm.edad}
                    onChange={handleMemberFormChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Tipo de sangre"
                    name="sangre"
                    value={memberForm.sangre}
                    onChange={handleMemberFormChange}
                  >
                    <MenuItem value="">Desconocido</MenuItem>
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    select
                    label="Parentesco"
                    name="parentesco"
                    value={memberForm.parentesco}
                    onChange={handleMemberFormChange}
                  >
                    <MenuItem value="Padre">Padre</MenuItem>
                    <MenuItem value="Madre">Madre</MenuItem>
                    <MenuItem value="Hijo/a">Hijo/a</MenuItem>
                    <MenuItem value="Abuelo/a">Abuelo/a</MenuItem>
                    <MenuItem value="Tío/a">Tío/a</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Discapacidad o condición especial"
                    name="discapacidad"
                    value={memberForm.discapacidad}
                    onChange={handleMemberFormChange}
                    placeholder="Ej: Movilidad reducida, diabetes"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Responsabilidad en emergencia"
                    name="responsabilidad"
                    value={memberForm.responsabilidad}
                    onChange={handleMemberFormChange}
                    placeholder="Ej: Llevar mochila de emergencia"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Medicamentos y dosis"
                    name="medicamentos"
                    value={memberForm.medicamentos}
                    onChange={handleMemberFormChange}
                    placeholder="Ej: Insulina - 20 unidades cada 8 horas"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenMemberDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={saveMember} variant="contained">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      )}

      {/* Pasos restantes (4-7) seguirían el mismo patrón */}

      {/* Navegación general */}
      {/* {activeStep > 0 && activeStep < steps.length - 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Regresar
          </Button>
          <Button onClick={handleNext} variant="contained" endIcon={<ArrowForwardIcon />}>
            Continuar
          </Button>
        </Box>
      )}

      {activeStep === steps.length - 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Regresar
          </Button>
          <Button onClick={saveCompletePlan} variant="contained" startIcon={<SaveIcon />}>
            Guardar Plan
          </Button>
        </Box>
      )} */}
    </Box>
  );
};

export default PlanFamiliar;