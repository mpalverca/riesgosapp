import { createClient } from "@supabase/supabase-js";
// Configuración Supabase
const SUPABASE_URL = "https://zpllugprxjqohnmxhizq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbGx1Z3ByeGpxb2hubXhoaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjk0NTYsImV4cCI6MjA2NjkwNTQ1Nn0.wKZ1AgPUZMy178r75N2frJlJl6wbkrjCOk4m4MVqmEs";
const SUPABASE_O_URL = "https://strvklqwxyenoobrqtis.supabase.co";
const SUPABASE_O_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cnZrbHF3eHllbm9vYnJxdGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTU2MzQsImV4cCI6MjA2ODAzMTYzNH0.tBX7U1Bsq5de9man6iCDmq-AudmYr-NC86v62tz4IKg";

// Colores para marcadores según prioridad


const color_prioridad = {
  Alta: "#dc3545",
  Media: "#ffc107",
  Baja: "#28a745",
  DEFAULT: "#007bff",
};

const FireData = createClient(SUPABASE_O_URL, SUPABASE_O_KEY);

export const cargarDatosPol = async () => {
  try {
    const polygonResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/pol_afect?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!polygonResponse.ok) {
      throw new Error(`Error HTTP: ${polygonResponse.status}`);
    }

    const polygonData = await polygonResponse.json();
    return polygonData; // Retorna los datos directamente
  } catch (error) {
    console.error("Error en cargarDatosPol:", error);
    throw error; // Relanza el error para manejo externo
  }
};

export const cargarDatosFire = async () => {
   try {
    const { data, error } = await FireData
      .from("parroquial")
      .select("id,DPA_DESPAR,n_alert,date_init,date_end,geom")
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export const cargarDatosFireID = async (id) => {
   try {
    const { data, error } = await FireData
      .from("parroquial")
      .select("id,DPA_DESPAR,n_alert,date_init,date_end,event_reg")
      .eq("id",id)
      .single()

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}