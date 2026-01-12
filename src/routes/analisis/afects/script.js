import { FaHome, FaRoad } from "react-icons/fa";
import Fondo1 from "../../../assets/fondo1.png";
import { jsPDF } from "jspdf";
import { captureMap } from "./maptoimage";
// Configuración Supabase
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://zpllugprxjqohnmxhizq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbGx1Z3ByeGpxb2hubXhoaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjk0NTYsImV4cCI6MjA2NjkwNTQ1Nn0.wKZ1AgPUZMy178r75N2frJlJl6wbkrjCOk4m4MVqmEs";
const SUPABASE_O_URL = "https://strvklqwxyenoobrqtis.supabase.co";
const SUPABASE_O_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cnZrbHF3eHllbm9vYnJxdGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTU2MzQsImV4cCI6MjA2ODAzMTYzNH0.tBX7U1Bsq5de9man6iCDmq-AudmYr-NC86v62tz4IKg";
// Colores para marcadores según prioridad
/* const PRIORITY_COLORS = {
  ALTA: "#dc3545",
  MEDIA: "#ffc107",
  BAJA: "#28a745",
  DEFAULT: "#007bff",
}; */
/* const DAMAGE_COOPER = {
  7: "#dc3545",
  6: "#dc3545",
  5: "#dc3545",
  4: "#ffc107",
  3: "#ffc107",
  2: "#28a745",
  1: "#28a745",
  DEFAULT: "#007bff",
}; */

/* const cooper_icon = {
  1: { icon: <FaHome />, color: "#1e90ff" },
  2: { icon: <FaRoad />, color: "#8b4513" },
  3: { icon: <FaRoad />, color: "#ff4500" },
}; */
const supabaseAfect = createClient(SUPABASE_URL, SUPABASE_KEY);
const parroq =createClient(SUPABASE_O_URL,SUPABASE_O_KEY)
  
export const cargarDatosafec = async () => {
  try {
    const { data, error } = await supabaseAfect
      .from("bd_loja_1")
      .select("id,geom,date,prioridad,event,estado,parroq,afectacion");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error en cargarDatosPol:", error);
    throw error;
  }
};
export const cargardatoformId = async (id) => {
  try {
    const { data, error } = await supabaseAfect
      .from("bd_loja_1")
      .select("*")
      .eq("id", id)
      .single(); 

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
/* try {
    const afectResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/bd_loja_1?select=id,ST_AsGeoJSON(geom) as geometry,FECHA,prioridad,EVENTO,ESTADO,Parroquia,afectacion`,
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

    return await afectResponse.json();
     // Retorna los datos directamente
  } catch (error) {
    console.error("Error en cargar datos de afectaciones:", error);
    throw error; // Relanza el error para manejo externo
  } */

export const cargarDatosParroquia = async () => {
   try {
    const { data, error } = await parroq
      .from("parroquial")
      .select("*")
      

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
  /* try {
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
  } */
};
// Función generarPDF actualizada:
export async function generarPDF(titulo, lat, lng, itemStr, require) {
  try {
    const item = itemStr;
    const doc = new jsPDF();

    // Configuración de márgenes
    const leftMargin = 15;
    const rightMargin = 15;
    const topMargin = 35;
    //const bottomMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - leftMargin - rightMargin;
    const marginBottom = 20;
    let yPosition = topMargin + 7;

    // Función para verificar y agregar nueva página si es necesario
    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - marginBottom) {
        addNewPage();
        return true;
      }
      return false;
    };

    // Función para agregar nueva página con fondo
    const addNewPage = () => {
      doc.addPage();
      yPosition = topMargin;
      // Agregar fondo en la nueva página
      if (fondoBase64) {
        doc.addImage(fondoBase64, "PNG", 0, 0, pageWidth, pageHeight);
      }
    };

    // Función para línea divisoria
    const divisoriaLine = () => {
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
      yPosition += 5;
    };

    // Cargar imagen de fondo desde public
    async function getImageFondo(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("No se pudo descargar la imagen");
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Error al convertir imagen a base64:", err);
        return null;
      }
    }

    // Función para formatear texto con guiones como lista
    const formatListText = (text) => {
      if (!text) return [];
      // Dividir por guiones y limpiar cada elemento
      return text
        .split("-")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) => `• ${item}`);
    };

    // Agrega fondo antes de todo el contenido
    const fondoBase64 = await getImageFondo(Fondo1);
    if (fondoBase64) {
      doc.addImage(fondoBase64, "PNG", 0, 0, pageWidth, pageHeight);
    }

    // Fecha actual de descarga
    const fechaDescarga = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Fecha de descarga (más pequeña y en esquina superior derecha)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado: ${fechaDescarga}`, pageWidth - rightMargin, 20, {
      align: "right",
    });

    // Configuración inicial del documento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      `FICHA TÉCNICA DE RIESGOS Nro. CGR-${item.id}`,
      pageWidth / 2,
      topMargin,
      { align: "center" }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      `FORMATO PARA EVALUACIÓN INICIAL DE AFECTACION`,
      pageWidth / 2,
      topMargin + 5,
      { align: "center" }
    );

    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Información Solicitante`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 5;

    // Datos personales
    doc.setFont("helvetica", "bold");
    doc.text("Nombre:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(require.name || ""), leftMargin + 25, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text("Cédula:", leftMargin + 90, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(require.ci || ""), leftMargin + 110, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "bold");
    doc.text("Teléfono:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(require.phone || ""), leftMargin + 25, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text("Correo:", leftMargin + 90, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(require.email || ""), leftMargin + 110, yPosition);
    yPosition += 5;

    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Información General`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 5;

    doc.setFont("helvetica", "bold");
    doc.text("Parroquia:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.parroq || ""), leftMargin + 25, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text("Latitud:", leftMargin + 90, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(lat.toFixed(6) || ""), leftMargin + 110, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "bold");
    doc.text("Sector:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.sector || ""), leftMargin + 26, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text("Longitud:", leftMargin + 90, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(lng.toFixed(6) || ""), leftMargin + 110, yPosition);
    yPosition += 5;

    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Descripción del evento`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 7;

    doc.setFont("helvetica", "bold");
    doc.text("Evento:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(titulo || ""), leftMargin + 20, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text("Afectación:", leftMargin + 90, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.afectacion || ""), leftMargin + 120, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(
        new Date(item.FECHA).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) || ""
      ),
      leftMargin + 20,
      yPosition
    );
    doc.setFont("helvetica", "bold");
    doc.text("Prioridad:", leftMargin + 90, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.prioridad || ""), leftMargin + 120, yPosition);
    yPosition += 5;

    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Mapa de Ubicación`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 5;

    // Verificar si necesitamos nueva página para el mapa
    checkPageBreak(120);

    // Mapa
    let imagemap = await captureMap(lat, lng, 18);
    doc.addImage(imagemap, "PNG", leftMargin, yPosition, maxWidth, 100);
    yPosition += 105;

    doc.setFont("helvetica", "bold");
    doc.text("Descripción:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(
      String(item.descripcio || "No existe Descripción"),
      maxWidth - 40
    );

    // Verificar si necesitamos nueva página para la descripción
    checkPageBreak(lines.length * 7);

    doc.text(lines, leftMargin + 30, yPosition, {
      align: "justify",
      maxWidth: maxWidth - 30,
    });
    yPosition += Math.max(10, lines.length * 5);
    // Campos principales
    doc.setFont("helvetica", "bold");
    doc.text("Detalle:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(item.info_afect || "No existe personas afectadas, heridas o fallecidas"),
      leftMargin + 30,
      yPosition,
      { maxWidth: maxWidth - 30 }
    );
    yPosition += 5;

    divisoriaLine();

    // Verificar si necesitamos nueva página para el contenido siguiente
    checkPageBreak(50);

    // Campos principales
    doc.setFont("helvetica", "bold");
    doc.text("Atiende:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.depen || ""), leftMargin + 30, yPosition);
    yPosition += 7;

    // Acciones a desarrollar con manejo de texto largo
    if (item.accions) {
      doc.setFont("helvetica", "bold");
      doc.text("Acciones a desarrollar:", leftMargin, yPosition);
      yPosition += 7;

      // Formatear texto con guiones como lista
      const accionesList = formatListText(item.accions);

      // Verificar si necesitamos nueva página para las acciones
      checkPageBreak(accionesList.length * 10);

      doc.setFont("helvetica", "normal");
      for (let i = 0; i < accionesList.length; i++) {
        // Verificar si necesitamos nueva página para cada línea
        if (checkPageBreak(7)) {
          yPosition += 10;
        }
        doc.text(accionesList[i], leftMargin + 5, yPosition, {
          maxWidth: maxWidth - 30, align:"justify"
        });
        yPosition += 10;
      }
      yPosition += 7;
    }

    // Agregar imagen (si existe)
    async function getImageBase64(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("No se pudo descargar la imagen");
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Error al convertir imagen a base64:", err);
        return null;
      }
    }

    let imgData = `${item.anex_foto}`;
    if (imgData && !imgData.startsWith("data:image")) {
      imgData = await getImageBase64(imgData);
    }

    if (imgData) {
      // Verificar si necesitamos nueva página para la imagen
      checkPageBreak(110);

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

    // Verificar si necesitamos nueva página para las firmas
    checkPageBreak(60);

    // Espacio para firmas
    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("FIRMAS DE RESPONSABLES", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    // Dibujar cajas para firmas
    const boxWidth = (pageWidth - leftMargin - rightMargin - 20) / 2;
    const boxHeight = 40;

    // Primera firma
    doc.setDrawColor(0, 0, 0);
    doc.rect(leftMargin, yPosition, boxWidth, boxHeight);
    doc.setFontSize(10);
    doc.text("Nombre:", leftMargin + 5, yPosition + 10);
    doc.text("Firma:", leftMargin + 5, yPosition + 30);

    // Segunda firma
    doc.rect(leftMargin + boxWidth + 20, yPosition, boxWidth, boxHeight);
    doc.text("Nombre:", leftMargin + boxWidth + 25, yPosition + 10);
    doc.text("Firma:", leftMargin + boxWidth + 25, yPosition + 30);

    yPosition += boxHeight + 10;

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
