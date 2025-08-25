import {
  FaBuilding,
  FaHome,
  FaRoad,
  FaTree,
  FaMapMarkerAlt,
} from "react-icons/fa";
// Configuración Supabase
const SUPABASE_URL = "https://zpllugprxjqohnmxhizq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbGx1Z3ByeGpxb2hubXhoaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjk0NTYsImV4cCI6MjA2NjkwNTQ1Nn0.wKZ1AgPUZMy178r75N2frJlJl6wbkrjCOk4m4MVqmEs";
const SUPABASE_O_URL = "https://strvklqwxyenoobrqtis.supabase.co";
const SUPABASE_O_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cnZrbHF3eHllbm9vYnJxdGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTU2MzQsImV4cCI6MjA2ODAzMTYzNH0.tBX7U1Bsq5de9man6iCDmq-AudmYr-NC86v62tz4IKg";
// Colores para marcadores según prioridad
const PRIORITY_COLORS = {
  ALTA: "#dc3545",
  MEDIA: "#ffc107",
  BAJA: "#28a745",
  DEFAULT: "#007bff",
};
const DAMAGE_COOPER = {
  7: "#dc3545",
  6: "#dc3545",
  5: "#dc3545",
  4: "#ffc107",
  3: "#ffc107",
  2: "#28a745",
  1: "#28a745",
  DEFAULT: "#007bff",
};

const cooper_icon = {
  1: { icon: <FaHome />, color: "#1e90ff" },
  2: { icon: <FaRoad />, color: "#8b4513" },
  3: { icon: <FaRoad />, color: "#ff4500" },
};

export const cargarDatosafec = async () => {
  try {
    const afectResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/bd_loja_1?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!afectResponse.ok) {
      throw new Error(`Error HTTP: ${afectResponse.status}`);
    }

    const afectData = await afectResponse.json();
    return afectData; // Retorna los datos directamente
  } catch (error) {
    console.error("Error en cargarDatosPol:", error);
    throw error; // Relanza el error para manejo externo
  }
};
export const cargarDatosParroquia =async () => {
  try {
    const parrResponse = await fetch(
      `${SUPABASE_O_URL}/rest/v1/parroquial?select=*`,
      {
        headers: {
          apikey: SUPABASE_O_KEY,
          authorization: `Bearer ${SUPABASE_O_KEY}`
        }
      }
    )
     if (!parrResponse.ok) {
      throw new Error(`Error HTTP: ${parrResponse.status}`);
    }
    const parroqData = await parrResponse.json();
   
    return parroqData; // 
  }catch (error){
    console.log("erro cargar datos de parroquias",error)
    throw error
  }
}
