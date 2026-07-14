import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
  Grow,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login,
  AppRegistration,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { client } from "../../utils/authkey";
import validator from "ecuador-validator";
import RegisterForm from "./singin";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

// ========== ESTILOS ==========
const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#dedce0",
    padding: "20px",
  },
  paper: {
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#ffffff",
  },
  avatar: {
    width: 72,
    height: 72,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    margin: "0 auto 16px",
  },
  submitButton: {
    height: "48px",
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "16px",
    fontWeight: 600,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "&:hover": {
      background: "linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)",
    },
    "&:disabled": { background: "#ccc" },
  },
};

// ========== VALIDACIÓN DE CÉDULA ==========
// ========== VALIDACIÓN DE CÉDULA ==========
const CedulaValidation = ({ value, onValid, onCheckCI }) => {
  const [isValid, setIsValid] = useState(null);
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const checkCIExists = useCallback(
    async (cedula) => {
      if (!cedula || cedula.length < 10) return false;
      setIsChecking(true);

      try {
        // Verificar si el usuario actual tiene esta cédula
        const {
          data: { user },
          error: userError,
        } = await client.auth.getUser();

        if (userError) {
          console.error("Error getting user:", userError);
          return false;
        }

        // Si el usuario actual tiene la misma cédula, significa que ya está registrada
        if (user && user.user_metadata?.ci === cedula) {
          onCheckCI(true);
          return true;
        }

        // No podemos verificar otras cédulas desde el cliente,
        // así que asumimos que no existe (esto se validará al enviar el formulario)
        onCheckCI(false);
        return false;
      } catch (error) {
        console.error("Error checking CI:", error);
        return false;
      } finally {
        setIsChecking(false);
      }
    },
    [onCheckCI],
  );

  const validateCedula = useCallback(
    async (cedula) => {
      if (!cedula || cedula.length < 10) {
        setIsValid(null);
        setMessage("Ingrese una cédula de 10 dígitos");
        onValid(false);
        onCheckCI(false);
        return;
      }

      if (cedula.length > 10) {
        setIsValid(false);
        setMessage("✗ La cédula debe tener 10 dígitos");
        onValid(false);
        return;
      }

      const isValidCI = validator.ci(cedula.toString());
      setIsValid(isValidCI);

      if (isValidCI) {
        // Solo verificamos si la cédula coincide con el usuario actual
        const exists = await checkCIExists(cedula);
        if (exists) {
          setMessage("✗ Esta cédula ya está registrada ");
          onValid(false);
          onCheckCI(false);
        } else {
          setMessage("✓ Cédula válida");
          onValid(true);
          onCheckCI(false);
        }
      } else {
        setMessage("✗ Cédula inválida");
        onValid(false);
        onCheckCI(false);
      }
    },
    [checkCIExists, onValid, onCheckCI],
  );

  useEffect(() => {
    const timer = setTimeout(() => validateCedula(value), 500);
    return () => clearTimeout(timer);
  }, [value, validateCedula]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
      {isChecking && <CircularProgress size={16} />}
      {!isChecking && isValid !== null && (
        <Typography
          variant="caption"
          sx={{
            color: isValid ? "success.main" : "error.main",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {isValid ? (
            <CheckCircleIcon fontSize="small" />
          ) : (
            <ErrorIcon fontSize="small" />
          )}
          {message}
        </Typography>
      )}
    </Box>
  );
};

// ========== FORMULARIO DE LOGIN ==========
const LoginForm = ({ switchToRegister }) => {
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Correo electrónico inválido";
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await client.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Credenciales incorrectas");
        }
        if (signInError.message.includes("Email not confirmed")) {
          throw new Error("Verifica tu correo electrónico primero");
        }
        throw signInError;
      }

      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();

      if (userError) throw userError;

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || "",
          phone: user.user_metadata?.phone || "",
          ci: user.user_metadata?.ci || "",
          rol: user.user_metadata?.role || "user",
        }),
      );

      window.location.href = "https://riesgosapp.vercel.app/";
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2.5}>
        {error && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Correo electrónico"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            fullWidth
            type="submit"
            disabled={loading}
            variant="contained"
            sx={styles.submitButton}
          >
            {loading ? <CircularProgress size={20} /> : "Iniciar sesión"}
          </Button>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Divider>
            <Typography variant="caption" color="text.secondary">
              ¿No tienes cuenta?
            </Typography>
          </Divider>
          <Button
            fullWidth
            onClick={switchToRegister}
            variant="text"
            sx={{ mt: 1, color: "#764ba2" }}
          >
            Regístrate aquí
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

// ========== FORMULARIO DE REGISTRO ==========

// ========== COMPONENTE PRINCIPAL ==========
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) window.location.href = "https://riesgosapp.vercel.app/";
  }, []);

  return (
    <Box sx={styles.root}>
      <Container maxWidth="sm">
        <Grow in={true} timeout={800}>
          <Paper elevation={12} sx={styles.paper}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar sx={styles.avatar}>
                {isLogin ? (
                  <Login fontSize="large" />
                ) : (
                  <AppRegistration fontSize="large" />
                )}
              </Avatar>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1a1a2e" }}
              >
                {isLogin ? "Bienvenido" : "Crear cuenta"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLogin
                  ? "Ingresa tus credenciales para continuar"
                  : "Completa el formulario para registrarte"}
              </Typography>
            </Box>
            {isLogin ? (
              <LoginForm switchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm
                switchToLogin={() => setIsLogin(true)}
                CedulaValidation={CedulaValidation}
                styles={styles}
              />
            )}
          </Paper>
        </Grow>
      </Container>
    </Box>
  );
};

export default AuthPage;
