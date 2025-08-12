import React, { useState, useEffect } from "react";
import { client } from "../../utils/authkey";
import validator from "ecuador-validator";
import { useNavigate } from "react-router-dom";

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "16px"
};

const buttonStyle = {
  ...inputStyle,
  backgroundColor: "#FF5733",
  color: "white",
  border: "none",
  cursor: "pointer"
};

const LoginForm = ({ switchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await client.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) {
        // Manejo específico de errores
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Credenciales incorrectas. Verifica tu email y contraseña.");
        } else if (signInError.message.includes("Email not confirmed")) {
          throw new Error("Por favor verifica tu correo electrónico primero.");
        } else {
          throw signInError;
        }
      }
      // Verificar si el usuario está confirmado
      if (data?.user?.confirmation_sent_at && !data?.user?.email_confirmed_at) {
        throw new Error("Por favor verifica tu correo electrónico antes de iniciar sesión.");
      }

      // Obtener los datos completos del usuario
      const { data: { user }, error: userError } = await client.auth.getUser();
      
      if (userError) throw userError;

      // Guardar en localStorage
      const userData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || '',
        ci: user.user_metadata?.ci || ''
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      onLoginSuccess();
      
      // Redirigir a la URL externa
      window.location.href = "https://mpalverca.github.io/riesgosapp/";
    } catch (error) {
      setError(error.message);
      console.error("Error de autenticación:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? "#ccc" : "#FF5733"
          }}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          ¿No tienes cuenta?{" "}
          <button 
            onClick={switchToRegister}
            style={{
              background: "none",
              border: "none",
              color: "#FF5733",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0
            }}
          >
            Regístrate
          </button>
        </p>
      </form>
    </div>
  );
};

const RegisterForm = ({ switchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    ci: "",
    phone: "",
    password: "",
    cPassword: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!validator.ci(formData.ci.toString())) {
      throw new Error("Cédula ecuatoriana inválida");
    }
    if (formData.password !== formData.cPassword) {
      throw new Error("Las contraseñas no coinciden");
    }
    if (formData.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      validateForm();

      const { data, error: signUpError } = await client.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            ci: formData.ci,
            role: "user"
          }
        }
      });

      if (signUpError) throw signUpError;
      
      // Guardar en localStorage antes de redirigir
      const userData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        ci: formData.ci
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      alert("¡Usuario registrado correctamente! Por favor inicia sesión.");
      onRegisterSuccess();
      switchToLogin();
    } catch (error) {
      setError(error.message);
      console.error("Error de registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Registro de usuario</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="ci"
          placeholder="Cédula (ej: 1234567890)"
          value={formData.ci}
          onChange={handleChange}
          maxLength={10}
          required
          style={inputStyle}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono (ej: 0999999999)"
          value={formData.phone}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="cPassword"
          placeholder="Confirmar contraseña"
          value={formData.cPassword}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? "#ccc" : "#FF5733"
          }}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          ¿Ya tienes cuenta?{" "}
          <button 
            onClick={switchToLogin}
            style={{
              background: "none",
              border: "none",
              color: "#FF5733",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0
            }}
          >
            Inicia sesión
          </button>
        </p>
      </form>
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Verificar si ya está autenticado
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = "https://mpalverca.github.io/riesgosapp/";
    }
  }, []);

  return (
    <div>
      {isLogin ? (
        <LoginForm 
          switchToRegister={() => setIsLogin(false)} 
          onLoginSuccess={() => alert("¡Bienvenido de vuelta!")}
        />
      ) : (
        <RegisterForm 
          switchToLogin={() => setIsLogin(true)} 
          onRegisterSuccess={() => {
            // Esta función se llama después del registro exitoso
          }}
        />
      )}
    </div>
  );
};

export default AuthPage;