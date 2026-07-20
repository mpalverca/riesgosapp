import { Button, Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { ESTADO_OPTIONS, MONTHS, VERIFICABLE_OPTIONS } from "./config";
import DriveManager from "./loadfile";
import { usePlanA } from "../script";
import { Save } from "@mui/icons-material";

const EditData = ({ dataI, close, row,member }) => {
  const INITIAL_DATA = {
    cash: dataI.cash,
    inst: dataI.inst,
    detail: dataI.detail,
    verifi: dataI.verifi,
    verificableUrl: dataI.verificableUrl,
    estado: dataI.estado,
    by:member
  };
  const [data, setData] = useState(INITIAL_DATA);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [instituciones, setInstituciones] = useState([]); // Array de strings
  const [inputInstValue, setInputInstValue] = useState("");
  const [verificableLink, setVerificableLink] = useState(
    INITIAL_DATA.verificableUrl,
  );
  // aqui biene edit

  // ========== HANDLERS ==========
  const handleClose = () => {
    setData(INITIAL_DATA);
    setInstituciones([]);
    setInputInstValue("");
    setVerificableLink("");
    setError(null);
    close();
  };
  const { edit, dataGet, loadingGet } = usePlanA();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError(null);

    if (name === "tipe") {
      // Resetear acción y descripción al cambiar el tipo
      setData((prev) => ({ ...prev, accion: "", desc: "" }));
    }
  };
  // ========== RENDER DE CAMPO ==========
  const renderField = (
    name,
    label,
    type = "text",
    options = [],
    extraProps = {},
  ) => (
    <TextField
      name={name}
      label={label}
      type={type}
      value={data[name] || ""}
      onChange={handleChange}
      select={type === "select"}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 5 : undefined}
      fullWidth
      disabled={name === "by" || name === "desc"}
      {...extraProps}
    >
      {type === "select" &&
        options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
    </TextField>
  );

  //============manejo de archivos===========

  const driveManagerRef = useRef(null); // Referencia al componente DriveManager
  const handleUploadComplete = (url) => {
    setVerificableLink(url);
  };
  const getActiveMonths = () =>
    MONTHS.filter((m) => data[m.key]).map((m) => m.label);

  const handleSubmit = async () => {
    // Validaciones
    // Validar verificable
    if (data.verifi === "si") {
      console.log("se imprime")
      if (driveManagerRef.current) {
        try {
          const link = await driveManagerRef.current.uploadFile();
          setVerificableLink(link);
        } catch (err) {
          setError(err.message || "Error al subir el archivo");
          return;
        }
      }
      if (!verificableLink) {
        setError("Debe proporcionar un enlace o subir un archivo");
        return;
      }
    }
console.log("search")
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        dateUpdate: new Date().toISOString(),
        fila: row,       
        verifi: data.verifi,
        inst: instituciones.join(", "), // Array de strings
        verificableUrl: data.verifi === "si" ? verificableLink : null,
      };
      console.log(payload.inst);

      await edit(data.tipe, payload);
      handleClose();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ px: 2, py: 1 }}>
      <Typography textAlign="center" variant="h6">
        Editar Contenido de acción
      </Typography>
      <Grid container spacing={2}>
        {/* Tipo */}

        <Grid item size={{ xs: 12 }}>
          {renderField("cash", "Presupuesto")}
        </Grid>

        <Grid item size={{ xs: 12 }}>
          {renderField("inst", "Instituciones de Apoyo")}
        </Grid>

        <Grid item size={{ xs: 12 }}>
          {renderField("detail", "Detalles", "textarea")}
        </Grid>
        <Grid item size={{ xs: 12 }}>
          {renderField("estado", "Estado", "select", ESTADO_OPTIONS)}
        </Grid>
        <Grid item size={{ xs: 12 }}>
          {renderField("verifi", "Verificable", "select", VERIFICABLE_OPTIONS)}
        </Grid>

        {data.verifi === "si" && (
          <Grid item size={{ xs: 12 }}>
            <DriveManager
              ref={driveManagerRef}
              onUploadComplete={handleUploadComplete}
              initialLink={verificableLink}
            />
          </Grid>
        )}
      </Grid>
      <Button
        fullWidth
         onClick={handleSubmit}
        size="small"
        variant="contained"
        color="warning"
        startIcon={<Save />}
        sx={{ mt: 1 }}
      >
        Guardar Cambios
      </Button>
    </Paper>
  );
};

export default EditData;
