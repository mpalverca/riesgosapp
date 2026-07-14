import React, { useState, useCallback } from "react";
import {
  Alert,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,

  useMediaQuery,
  useTheme,
  Snackbar,
  Fade,
  Grow,
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  Phone,
  Badge,
  Visibility,
  VisibilityOff,
  Login,
 
 
  Error,
  Security,
} from "@mui/icons-material";
import { client } from "../../utils/authkey";


const RegisterForm = ({ switchToLogin, CedulaValidation, styles }) => {
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    ci: "",
    phone: "",
    password: "",
    cPassword: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cedulaValid, setCedulaValid] = useState(false);
  const [ciExists, setCiExists] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const steps = ["Datos personales", "Credenciales", "Confirmación"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const validateStep = useCallback(
    (step) => {
      const newErrors = {};
      if (step === 0) {
        if (!form.name?.trim() || form.name.trim().length < 2)
          newErrors.name = "Nombre debe tener al menos 2 caracteres";
        if (!form.ci || form.ci.length !== 10)
          newErrors.ci = "Ingrese una cédula de 10 dígitos";
        else if (!cedulaValid)
          newErrors.ci = ciExists
            ? "Esta cédula ya está registrada"
            : "Cédula inválida";
        if (!form.phone || form.phone.length < 10)
          newErrors.phone = "Teléfono inválido (mínimo 10 dígitos)";
      }
      if (step === 1) {
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
          newErrors.email = "Correo electrónico inválido";
        if (!form.password || form.password.length < 6)
          newErrors.password = "Contraseña debe tener al menos 6 caracteres";
        if (form.password && form.password !== form.cPassword)
          newErrors.cPassword = "Las contraseñas no coinciden";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [form, cedulaValid, ciExists],
  );

  const handleNext = () =>
    validateStep(activeStep) && setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(0) || !validateStep(1)) {
      setError("Complete todos los campos correctamente");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verificar si la cédula ya existe antes de registrar
      const { data: existingUser } = await client
        .from("users")
        .select("ci")
        .eq("ci", form.ci)
        .maybeSingle();

      if (existingUser) {
        throw new Error("Esta cédula ya está registrada en el sistema");
      }

      const { error: signUpError } = await client.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            phone: form.phone,
            ci: form.ci,
            role: "user",
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          throw new Error("Este correo electrónico ya está registrado");
        }
        throw signUpError;
      }

      // Obtener y verificar el usuario creado
      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();
      if (userError) throw userError;

      // Verificar que la cédula coincida con la registrada
      if (user.user_metadata?.ci !== form.ci) {
        throw new Error(
          "Error al registrar la cédula. Por favor intente nuevamente",
        );
      }

      const userData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || "",
        phone: user.user_metadata?.phone || "",
        ci: user.user_metadata?.ci || "",
        rol: user.user_metadata?.role || "user",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setSnackbarOpen(true);

      setTimeout(() => {
        switchToLogin();
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const fields = {
      0: [
        {
          name: "name",
          label: "Nombre completo",
          icon: <Person color="primary" />,
        },
        {
          name: "ci",
          label: "Cédula de Identidad",
          icon: <Badge color="primary" />,
          type: "number",
          extra: (
            <CedulaValidation
              value={form.ci}
              onValid={setCedulaValid}
              onCheckCI={setCiExists}
            />
          ),
        },
        {
          name: "phone",
          label: "Teléfono",
           type: "number",
          icon: <Phone color="primary" />,
          prefix: "+593",
        },
      ],
      1: [
        {
          name: "email",
          label: "Correo electrónico",
          icon: <Email color="primary" />,
          type: "email",
        },
        {
          name: "password",
          label: "Contraseña (mínimo 6 caracteres)",
          icon: <Lock color="primary" />,
          type: "password",
          show: showPassword,
          setShow: setShowPassword,
        },
        {
          name: "cPassword",
          label: "Confirmar contraseña",
          icon: <Security color="primary" />,
          type: "password",
          show: showConfirmPassword,
          setShow: setShowConfirmPassword,
        },
      ],
      2: null,
    };

    if (activeStep === 2) {
      return (
        <Grow in={true}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: "#f8f9fa" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de registro
              </Typography>
              <Divider sx={{ my: 1 }} />
              {Object.entries({
                Nombre: form.name,
                Cédula: form.ci,
                Teléfono: form.phone,
                Email: form.email,
              }).map(([key, value]) => (
                <Typography key={key} variant="body2">
                  <strong>{key}:</strong> {value}
                </Typography>
              ))}
              <Alert severity="info" sx={{ mt: 2 }}>
                Revisa que tus datos sean correctos antes de confirmar
              </Alert>
            </CardContent>
          </Card>
        </Grow>
      );
    }

    return (
      <Fade in={true}>
        <Box>
          <Grid container spacing={2.5}>
            {fields[activeStep].map((field) => (
              <Grid size={{ xs: 12 }} key={field.name}>
                <TextField
                  fullWidth
                  required
                  label={field.label}
                  name={field.name}
                  type={
                    field.type === "password"
                      ? field.show
                        ? "text"
                        : "password"
                      : field.type || "text"
                  }
                  prefix={field.prefix}
                  value={form[field.name]}
                  onChange={handleChange}
                  onBlur={() => handleBlur(field.name)}
                  error={!!errors[field.name] && touched[field.name]}
                  helperText={touched[field.name] && errors[field.name]}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {field.icon}
                      </InputAdornment>
                    ),
                    ...(field.type === "password" && {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => field.setShow(!field.show)}
                            edge="end"
                          >
                            {field.show ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }),
                  }}
                  size={isMobile ? "small" : "medium"}
                />
                {field.extra}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>
    );
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            {renderStep()}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{ color: "#764ba2", borderColor: "#764ba2" }}
              >
                Atrás
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={styles.submitButton}
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Confirmar registro"
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={styles.submitButton}
                >
                  Siguiente
                </Button>
              )}
            </Box>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              ¿Ya tienes cuenta?
            </Typography>
          </Divider>
          <Button
            fullWidth
            onClick={switchToLogin}
            variant="text"
            sx={{ color: "#764ba2" }}
            startIcon={<Login />}
          >
            Inicia sesión
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">
          ¡Registro exitoso! Redirigiendo al login...
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterForm;
