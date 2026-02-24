import {
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import {  fieldsMTT1 } from "./Fields_afect/fiels_mtt";

const MTT1Afect = ({ setFormData, formData }) => {
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
            {fieldsMTT1.map(({ key, label }) => (
              <Grid item size={{ xs: 12 }} key={key}>
                {renderField(key, label,"number")}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
   
  );
};

export default MTT1Afect