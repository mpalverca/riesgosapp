import {
  FaWater,
  FaMountain,
  FaBuilding,
  FaFire,
  FaExclamationTriangle,
  FaHome,
  FaRoad,
  FaTree,
  FaMapMarkerAlt,
  FaBook,
  FaBell,
} from "react-icons/fa";
import { FaHouseDamage } from "@react-icons/all-files/fa/FaHouseDamage";

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

const statusEvin = {
  Damnificada: "#dc3545",
  Afectada: "#ffc107",
  "Sin afectación": "#28a745",
  DEFAULT: "#007bff",
};



const cooper_icon = {
  1: { icon: <FaHome />, color: "#1e90ff" },
  2: { icon: <FaRoad />, color: "#8b4513" },
  3: { icon: <FaRoad />, color: "#ff4500" },
};

const AFECTACION_ICONS = {
  Vivienda: { icon: <FaHome />, color: "#4169e1" },
  Predio: { icon: <FaMapMarkerAlt />, color: "#a0522d" },
  "Área verde": { icon: <FaTree />, color: "#228b22" },
  Vialidad: { icon: <FaRoad />, color: "#696969" },
  Equipamiento: { icon: <FaBuilding />, color: "#4682b4" },
  DEFAULT: { icon: <FaMapMarkerAlt />, color: "#007bff" },
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