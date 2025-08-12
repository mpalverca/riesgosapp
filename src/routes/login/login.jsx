import React, { useState } from "react";
import { client } from "../../utils/authkey";

function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await client.auth.signInWithOtp({
        email: email,
      });
      
      if (error) {
        throw error;
      }
      
      alert("¡Revisa tu correo para el enlace de acceso!");
    } catch (error) {
      setError(error.message);
      console.error("Error de autenticación:", error);
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
          type="email"
          name="email"
          placeholder="usuario@dominio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {loading ? "Enviando..." : "Enviar enlace mágico"}
        </button>
      </form>
    </div>
  );
}

export default Login;