import {
  FaBuilding,
  FaHome,
  FaRoad,
  FaTree,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
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
export const cargarDatosParroquia = async () => {
  try {
    const parrResponse = await fetch(
      `${SUPABASE_O_URL}/rest/v1/parroquial?select=*`,
      {
        headers: {
          apikey: SUPABASE_O_KEY,
          authorization: `Bearer ${SUPABASE_O_KEY}`,
        },
      }
    );
    if (!parrResponse.ok) {
      throw new Error(`Error HTTP: ${parrResponse.status}`);
    }
    const parroqData = await parrResponse.json();

    return parroqData; //
  } catch (error) {
    console.log("erro cargar datos de parroquias", error);
    throw error;
  }
};

// Función generarPDF actualizada:
export async function generarPDF(titulo, lat, lng, itemStr, require) {
  try {
    const item = itemStr;
    const doc = new jsPDF();

    // Configuración de márgenes
    const leftMargin = 15;
    const rightMargin = 15;
    const topMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - leftMargin - rightMargin;

    // Fecha actual de descarga
    const fechaDescarga = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Configuración inicial del documento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Reporte: ${titulo}`, pageWidth / 2, topMargin, {
      align: "center",
    });

    // Fecha de descarga (más pequeña y en esquina superior derecha)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado: ${fechaDescarga}`, pageWidth - rightMargin, topMargin+5, {
      align: "right",
    });
    let yPosition = topMargin + 7;
    // Línea divisoria
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
    yPosition += 5;
    //Solicitante
    doc.setFont("helvetica", "bold");
    doc.text("Solicita:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(require.name || ""), leftMargin + 30, yPosition);
    yPosition += 5;
    // Línea divisoria
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
    yPosition += 10;
    console.log(require);
    // Agregar imagen (si existe)
    function getImageBase64(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("No se pudo descargar la imagen");
      return response.blob();
    })
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    )
    .catch((err) => {
      console.error("Error al convertir imagen a base64:", err);
      return null;
    });
}
    let imgData = `${item.ANEX_FOT}`;
    if (imgData && !imgData.startsWith("data:image")) {
      imgData = await getImageBase64(imgData);
    }
    if (imgData) {
      const imgWidth = pageWidth - leftMargin - rightMargin;
      const imgHeight = 100;
      doc.addImage(imgData, "JPEG", leftMargin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
      doc.line(
        leftMargin,
        yPosition - 5,
        pageWidth - rightMargin,
        yPosition - 5
      );
      yPosition += 5;
    }

    // Coordenadas
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Ubicación:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      leftMargin + 30,
      yPosition
    );
    yPosition += 10;

    // Campos principales
    console.log(item);
    const camposPrincipales = [
      "FECHA",
      "PARROQUIA",
      "sector_barrio",
      "afectación",
      "PRIORIDAD",
      "descripcion",
    ];
    camposPrincipales.forEach((campo) => {
      console.log(campo)
      console.log(item[campo])
      if (item[campo]) {
        let valor = item[campo];
        if (campo === "FECHA") {
          valor = new Date(valor).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }
        console.log(campo);
        doc.setFont("helvetica", "bold");
        doc.text(`${campo}:`, leftMargin, yPosition);
        doc.setFont("helvetica", "normal");

        // Dividir texto largo en múltiples líneas
        const lines = doc.splitTextToSize(String(valor || ""), maxWidth - 40);
        if (lines.length > 0) {
          doc.text(lines, leftMargin + 30, yPosition);
          yPosition += Math.max(10, lines.length * 7);
        }
      }
    });
    doc.setFont("helvetica", "bold");
    doc.text("atiende:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.depen || ""), leftMargin + 30, yPosition);
    yPosition += 7;

    // Acciones a desarrollar con manejo de texto largo
    if (item.accions) {
      doc.setFont("helvetica", "bold");
      doc.text("Acciones a desarrollar:", leftMargin, yPosition);
      yPosition += 7;

      doc.setFont("helvetica", "normal");
      const accionesLines = doc.splitTextToSize(item.accions, maxWidth);
      doc.text(accionesLines, leftMargin, yPosition);
      yPosition += accionesLines.length * 7 + 10;
    }

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Reporte generado automáticamente",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    // Guardar el PDF
    doc.save(
      `reporte_${titulo.replace(/[^a-z0-9]/gi, "_")}_${fechaDescarga.replace(
        /[/,: ]/g,
        "-"
      )}.pdf`
    );
  } catch (e) {
    console.error("Error al generar PDF:", e);
    alert("Ocurrió un error al generar el reporte");
  }
}
