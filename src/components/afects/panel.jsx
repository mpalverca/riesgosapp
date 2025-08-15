import { useState } from "react";

import { Typography, TextField, Button } from "@mui/material";
export default function Panel({ addbar }) {
  const [form, setForm] = useState({ latitud: "", longitud: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };console.log(form)

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes usar los datos ingresados
    addbar(form.latitud, form.longitud);
  };
  return (
    <div>
      <Typography variant="h6">Visor Territorial de Afectaciones</Typography>
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fff3cd",
          borderLeft: "5px solid #020202ff",
          borderRadius: "4px",
          color: "#856404",

          margin: "2px 0",
        }}
      >
        ⚠️ <strong>Advertencia:</strong> La información presentada es de manera
        referencial y deberá asumirse con el mayor cuidado y responsabilidad ya
        que la divulgación inadecuada de la misma está sujeta a acciones y
        sanciones contempladas en la LOGIRD.
      </div>
      <Typography variant="subtitle1">Ubicación</Typography>
      <form>
        <TextField
          fullWidth
          padding={2}
          marginTop={2}
          type="number"
          id="latitude"
          label="Latitud"
          value={form.latitud}
          onChange={handleChange}
          placeholder="Ej: -3.99313"
          variant="outlined"
        />
        <TextField
          padding={2}
          marginTop={2}
          type="number"
          fullWidth
          id="longitud"
          label="Longitud"
          value={form.longitud}
          onChange={handleChange}
          placeholder="Ej: -3.99313"
          variant="outlined"
        />
        <Button
          id="search-btn"
          variant="contained"
          onClick={handleSubmit}
          marginTop={2}
          padding={2}
          style={{
            background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          }}
          fullWidth
          size="large"
        >
          Buscar en Mapa
        </Button>
      </form>
      <div
        style={{
          padding: "10px",
          borderRadius: "4px",
          margin: "2px 0",
          alignContent: "normal",
        }}
      >
        <strong>Evento Adverso:</strong> Es una situación, suceso o hecho que
        produce alteración en la Vida de las personas, de la economía, los
        sistemas sociales y el ambiente, causado por fenómenos de origen natural
        o provocado por los seres humanos (Lit. 8, art. 5 de la LOGIRD)
      </div>
    </div>
  );
}
