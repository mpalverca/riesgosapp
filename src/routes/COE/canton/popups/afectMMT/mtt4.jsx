import {
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";

const MTT4Afect = ({ setFormData, formData }) => {
  // Definición de campos organizados por categorías
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderField = (
    name,
    label,
    type = "text",
    options = [],
    props = {},
  ) => (
    <TextField
      name={name}
      label={label}
      type={type}
      value={formData[name] || ""}
      onChange={handleChange}
      select={type === "select"}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 3 : undefined}
      fullWidth
      disabled={name === "by" || name === "ubi"}
      {...props}
    >
      {type === "select" &&
        options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
    </TextField>
  );

  return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Registro de Evento
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12 }}>
              {renderField("perd_desp", "Personas Desplazadas", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("fam_despl", "Familias Desplazadas", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("alb_afect", "Albergues Afectados", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("camp_afect", "Campamentos Afectados", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField(
                "per_fam",
                "Personas en Familias de Acogida",
                "number",
              )}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("fam_fam", "Familias de Acogida", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("per_cam", "Personas en Campamentos", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("fam_camp", "Familias en Campamentos", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("per_ref", "Personas en Refugios", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("fam_ref", "Familias en Refugios", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("per_emerg", "Personas en Emergencia", "number")}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              {renderField("fami_emerg", "Familias en Emergencia", "number")}
            </Grid>
          </Grid>
        </Box>
      </Paper>
   
  );
};

export default MTT4Afect