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

const supabaseAfect = createClient(SUPABASE_URL, SUPABASE_KEY);
const parroq = createClient(SUPABASE_O_URL, SUPABASE_O_KEY);

export const cargarDatosafec = async (
  priority,
  estado,
  afect,
  parroq,
  event,
  atiende,
) => {
  try {
    /*  const { data, error } = await supabaseAfect
      .from("bd_loja_1")
      .select("id,geom,date,prioridad,event,estado,parroq,afectacion,radio");  */

    let query = supabaseAfect
      .from("bd_loja_1")
      .select(
        "id,geom,date,depen,prioridad,event,estado,parroq,afectacion,radio",
      );
    // Aplicar filtros dinámicamente

    if (estado && estado !== "Todos") {
      query = query.eq("estado", estado);
    }
    if (priority && priority !== "Todos") {
      query = query.eq("prioridad", priority);
    }
    if (afect && afect !== "Todos") {
      query = query.eq("afectacion", afect);
    }
    if (parroq && parroq !== "Todos") {
      query = query.eq("parroq", parroq);
    }
    if (event && event !== "Todos") {
      query = query.eq("event", event);
    }
    if (atiende && atiende !== "Todos") {
      query = query.eq("depen", atiende);
    }
    const { data, error } = await query;
    // console.log(data);
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

export const cargarDatosParroquia = async () => {
  try {
    const { data, error } = await parroq.from("parroquial").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// Función generarPDF actualizada:
export async function generarPDF(
  titulo,
  lat,
  lng,
  itemStr,
  require,
  printToPDF,
) {
  try {
    const item = itemStr;
    //const imgData = await printToPDF();
    //console.log(item);
    //console.log("Generando PDF para el ítem:", item)
    const doc = new jsPDF();
    const title = 11;
    const subtitle = 10;
    const textPar = 9;
    // Configuración de márgenes
    const leftMargin = 15;
    const rightMargin = 15;
    const topMargin = 35;
    //const bottomMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - leftMargin - rightMargin;
    const bottomMargin = 25;
    let yPosition = topMargin + 7;

    // Función para verificar y agregar nueva página si es necesario
    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - bottomMargin) {
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

    const someText = (text, max, maxOne, left) => {
      doc.setFontSize(textPar);
      doc.setFont("helvetica", "normal");
      const linesaccion = doc.splitTextToSize(
        String(text || "No existe personas afectadas, heridas o fallecidas"),
        maxWidth - max,
      );
      // Verificar si necesitamos nueva página para la descripción
      // checkPageBreak(lines.length * 7);
      linesaccion.forEach((line) => {
        if (yPosition + 5 > pageHeight - bottomMargin) {
          addNewPage();
          yPosition = topMargin;
        }
        doc.text(line, leftMargin + left, yPosition, {
          align: "justify",
          maxWidth: maxWidth - maxOne,
        });
        //yPosition += Math.max(10, lines.length * 5);
        yPosition += 5;
      });
    };

    const codigosPermitidos = [
      "1150511853",
      "1104914260",
      "1104998370",
      "1105867459",
    ];
    const employed = [
      {
        ci: "1105867459",
        name: "Krupskaya Campoverde Ventimilla",
        cargo: "Analista Geologo",
      },
      {
        ci: "1104914260",
        name: "Millan Alverca Gaona",
        cargo: "Especialsita en gestión de riesgos",
      },
      {
        ci: "1105160533",
        name: "Juan Fernandez Jimenez",
        cargo: "Ingeniero Geologo",
      },
    ];
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
    doc.setFontSize(textPar);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado: ${fechaDescarga}`, pageWidth - rightMargin, 20, {
      align: "right",
    });
    // Configuración inicial del documento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(title);
    doc.text(
      `FICHA REGISTRO DE AFECTACIÓN Nro. CGR-${item.id}`,
      pageWidth / 2,
      topMargin,
      { align: "center" },
    );

    if (!codigosPermitidos.includes(require.ci)) {
      divisoriaLine();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(subtitle);
      doc.text(`Información Requiriente`, pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 5;
      // Datos personales
      doc.setFontSize(textPar);
      doc.setFont("helvetica", "bold");
      doc.text("Nombre:", leftMargin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(String(require.name || ""), leftMargin + 20, yPosition, {
        maxWidth: 90,
      });
      doc.setFont("helvetica", "bold");
      doc.text("Cédula:", leftMargin + 90, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(String(require.ci || ""), leftMargin + 110, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Teléfono:", leftMargin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(String(require.phone || ""), leftMargin + 20, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text("Correo:", leftMargin + 90, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(String(require.email || ""), leftMargin + 110, yPosition);
      yPosition += 3;
    }
    divisoriaLine();
    doc.setFontSize(subtitle);
    doc.setFont("helvetica", "bold");
    doc.text(`Información General`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 8;
    doc.setFontSize(textPar);
    doc.setFont("helvetica", "bold");
    doc.text("Parroquia:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.parroq || ""), leftMargin + 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Sector:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.sector || ""), leftMargin + 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Latitud:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(lat.toFixed(6) || ""), leftMargin + 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Longitud:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(lng.toFixed(6) || ""), leftMargin + 20, yPosition);
    /* yPosition += 3;
    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    doc.text(`Descripción del evento`, pageWidth / 2, yPosition, {
      align: "center",
    }); */
    yPosition += 7;
    doc.setFontSize(textPar);
    doc.setFont("helvetica", "bold");
    doc.text("Evento:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(titulo || ""), leftMargin + 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Afectación:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.afectacion || ""), leftMargin + 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "bold");
    doc.text("F. Registro:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(
        new Date(item.date).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) || "",
      ),
      leftMargin + 20,
      yPosition,
    );
    yPosition += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Prioridad:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.prioridad || ""), leftMargin + 20, yPosition);
    // Verificar si necesitamos nueva página para el mapa
    // checkPageBreak(120 + marginBottom);
    // Mapa
    yPosition += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Reporta:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.report || ""), leftMargin + 20, yPosition, {
      maxWidth: 90,
    });
    let imagemap = await captureMap(lat, lng, 18);
    doc.addImage(
      imagemap,
      "PNG",
      leftMargin + 80,
      codigosPermitidos.includes(require.ci) ? topMargin + 35 : topMargin + 17,
      // maxWidth / 2,
      (pageWidth - leftMargin) / 2,
      70,
    );
    /* doc.addImage(
      imgData,
      "PNG",
      leftMargin + 75,
      !codigosPermitidos.includes(require.ci)?topMargin+35:topMargin+17,
      // maxWidth / 2,
      (pageWidth - leftMargin) / 2,
      70,
    ); */
    yPosition += 15;
    divisoriaLine();
    doc.setFontSize(textPar);
    doc.setFont("helvetica", "bold");
    doc.text("Descripción:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    someText(item.descripcio, 20, 15, 20);

    /* const linesDesp = doc.splitTextToSize(
      String(item.descripcio || "No existe Descripción"),
      maxWidth - 20,
    );
    // Verificar si necesitamos nueva página para la descripción
    // checkPageBreak(lines.length * 7);
    linesDesp.forEach((line) => {
      if (yPosition + 5 > pageHeight - bottomMargin) {
        addNewPage();
        yPosition = topMargin;
      }
      doc.text(line, leftMargin + 20, yPosition, {
        align: "justify",
        maxWidth: maxWidth - 20,
      });
      //yPosition += Math.max(10, lines.length * 5);
      yPosition += 5;
    }); */
    divisoriaLine();
    // Campos principales
    doc.setFont("helvetica", "bold");
    doc.text("Detalle de afectados:", leftMargin, yPosition, {
      maxWidth: leftMargin + 17,
    });
    yPosition += 5;
    doc.setFont("helvetica", "normal");
    someText(
      item.info_afec || "No existe personas afectadas, heridas o fallecidas",
      20,
      15,
      20,
    );
    /*   const linesDetail = doc.splitTextToSize(
      String(
        item.info_afec || "No existe personas afectadas, heridas o fallecidas",
      ),
      maxWidth - 20,
    );
    // Verificar si necesitamos nueva página para la descripción
    // checkPageBreak(lines.length * 7);
    linesDetail.forEach((line) => {
      if (yPosition + 5 > pageHeight - bottomMargin) {
        addNewPage();
        yPosition = topMargin;
      }
      doc.text(line, leftMargin + 20, yPosition, {
        align: "justify",
        maxWidth: maxWidth - 15,
      });
      //yPosition += Math.max(10, lines.length * 5);
      yPosition += 5;
    }); */
    divisoriaLine();
    // Verificar si necesitamos nueva página para el contenido siguiente
    // Campos principales
    doc.setFont("helvetica", "bold");
    doc.text("Atiende:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    someText(item.depen || "", 20, 15, 20);
    //doc.text(String(item.depen || ""), leftMargin + 20, yPosition);
    divisoriaLine();
    yPosition += 7;
    // Acciones a desarrollar con manejo de texto largo
    /* if (item.accions) {
      doc.setFontSize(subtitle);
      doc.setFont("helvetica", "bold");
      doc.text("Acciones a desarrollar:", leftMargin, yPosition);
      yPosition += 7;
      // Formatear texto con guiones como lista
      const accionesList = formatListText(item.accions);
      // Verificar si necesitamos nueva página para las acciones
      doc.setFont("helvetica", "normal");
      doc.setFontSize(textPar);
      for (let i = 0; i < accionesList.length; i++) {
        // Verificar si la línea actual cabe
        if (checkPageBreak(10)) {
          // Si se añadió página, continuar
        }

        doc.text(accionesList[i], leftMargin + 5, yPosition, {
          maxWidth: maxWidth - 15,
          align: "justify",
        });
        yPosition += 10;
      }

      yPosition += 5; // Espacio después de las acciones
    } */
    doc.setFontSize(subtitle);
    doc.setFont("helvetica", "bold");
    doc.text("Recomendaciones", leftMargin, yPosition);
    yPosition += 5;
    doc.setFontSize(textPar);
    doc.setFont("helvetica", "normal");
    someText(item.accions, 20, 15, 20);
    /*  const linesaccion = doc.splitTextToSize(
      String(
        item.accions || "No existe personas afectadas, heridas o fallecidas",
      ),
      maxWidth - 20,
    );
    // Verificar si necesitamos nueva página para la descripción
    // checkPageBreak(lines.length * 7);
    linesaccion.forEach((line) => {
      if (yPosition + 5 > pageHeight - bottomMargin) {
        addNewPage();
        yPosition = topMargin;
      }
      doc.text(line, leftMargin + 20, yPosition, {
        align: "justify",
        maxWidth: maxWidth - 15,
      });
      //yPosition += Math.max(10, lines.length * 5);
      yPosition += 5;
    }); */

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    checkPageBreak(bottomMargin + 20);
    // doc.setTextColor(150, 150, 150);
    doc.text(
      "Las acciones planteadas tienen carácter orientativo y su materialización dependerá de la disponibilidad de recursos y equipos, correspondiendo su ejecución tanto a las instancias competentes como a los usuarios, de acuerdo al grado de competencia definido para cada caso",
      leftMargin,
      yPosition,
      {
        align: "justify",
        maxWidth: maxWidth - 15,
      },
    );
    yPosition += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(subtitle);
    doc.setFont("helvetica", "bold");
    doc.text("Anexo Fotografico:", leftMargin, yPosition);
    yPosition += 5;
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

    if (item.anex_foto) {
      const imageUrls = item.anex_foto
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url);

      if (imageUrls.length > 0) {
        // Configuración
        const maxImagesToShow = 6;
        const imagesToProcess = imageUrls.slice(0, maxImagesToShow);
        const imagesPerRow = Math.min(imagesToProcess.length, 2);

        // Dimensiones de página
        //const pageHeight = doc.internal.pageSize.height;
        // const pageWidth = doc.internal.pageSize.width;
        // const bottomMargin = 30;
        // const topMargin = 20;

        // Espacio disponible para imágenes
        const availableWidth = pageWidth - leftMargin - rightMargin;
        const spacing = 5;
        const imgWidth =
          imagesPerRow > 1 ? (availableWidth - spacing) / 2 : availableWidth;
        const imgHeight = 60; // Altura fija por imagen
        const rowHeight = imgHeight + spacing;

        let currentImageIndex = 0;

        while (currentImageIndex < imagesToProcess.length) {
          // Calcular cuántas filas caben en la página actual
          const spaceLeftOnPage = pageHeight - yPosition - bottomMargin;
          const maxRowsInCurrentPage = Math.floor(spaceLeftOnPage / rowHeight);
          const imagesPerRow = 2; // Máximo 2 imágenes por fila
          const maxImagesInCurrentPage = maxRowsInCurrentPage * imagesPerRow;

          // Si no cabe ninguna imagen en la página actual, crear nueva página
          if (maxImagesInCurrentPage <= 0) {
            addNewPage(); // Usa tu función existente
            yPosition = topMargin;
            continue;
          }

          // Calcular cuántas imágenes procesar en esta página
          const imagesRemaining = imagesToProcess.length - currentImageIndex;
          const imagesToProcessInThisPage = Math.min(
            imagesRemaining,
            maxImagesInCurrentPage,
          );

          // Variables para posicionamiento
          let x = leftMargin;
          let y = yPosition;
          let countInRow = 0;
          let imagesProcessedInThisPage = 0;

          // Procesar imágenes para esta página
          for (let i = 0; i < imagesToProcessInThisPage; i++) {
            const imgIndex = currentImageIndex + i;
            const imgUrl = imagesToProcess[imgIndex];

            try {
              let imgData = imgUrl;
              if (imgData && !imgData.startsWith("data:image")) {
                imgData = await getImageBase64(imgData);
              }

              if (imgData) {
                // Nueva fila cada 2 imágenes
                if (countInRow > 0 && countInRow % 2 === 0) {
                  x = leftMargin;
                  y += imgHeight + spacing;
                }

                // Agregar imagen
                doc.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);

                // Número de imagen
                doc.setFontSize(8);
                doc.setFillColor(255, 255, 255);
                doc.circle(x + 5, y + 4, 2, "FD");
                doc.text(`${imgIndex + 1}`, x + 4, y + 5);

                x += imgWidth + spacing;
                countInRow++;
                imagesProcessedInThisPage++;
              }
            } catch (error) {
              console.warn(`Error con imagen ${imgIndex + 1}:`, error);
            }
          }

          // Actualizar posición Y para la siguiente página
          if (countInRow > 0) {
            // Calcular la última posición Y después de todas las imágenes de esta página
            const rowsInThisPage = Math.ceil(
              imagesProcessedInThisPage / imagesPerRow,
            );
            yPosition = y + imgHeight + spacing;

            // Si todavía quedan imágenes por procesar, preparar para siguiente página
            if (
              currentImageIndex + imagesProcessedInThisPage <
              imagesToProcess.length
            ) {
              // Verificar si hay espacio para un separador
              if (yPosition + 10 < pageHeight - bottomMargin) {
                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text(
                  `Continúa en la siguiente página...`,
                  leftMargin,
                  yPosition,
                );
                yPosition += 10;
              }

              // Pequeño margen antes de la siguiente página
              yPosition += 5;
            }
          }

          // Avanzar al siguiente lote de imágenes
          currentImageIndex += imagesProcessedInThisPage;

          // Si quedan imágenes, crear nueva página (excepto en la última iteración)
          if (currentImageIndex < imagesToProcess.length) {
            addNewPage();
            yPosition = topMargin;
          }
        }

        // Nota si hay más imágenes de las que mostramos
        if (imageUrls.length > maxImagesToShow) {
          // Verificar si necesitamos nueva página para la nota
          if (yPosition + 10 > pageHeight - bottomMargin) {
            addNewPage();
            yPosition = topMargin;
          }

          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(
            `* Se muestran ${maxImagesToShow} de ${imageUrls.length} imágenes`,
            leftMargin,
            yPosition,
          );
          yPosition += 10;
        }

        // Espacio después de las imágenes
        yPosition += 5;
      }
    }
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(textPar);
    doc.setFont("helvetica", "normal");
    someText(item.desc_img, 0, 0, 0);
    /* const lineImg = doc.splitTextToSize(String(item.desc_img || " "), maxWidth);
    // Verificar si necesitamos nueva página para la descripción
    // checkPageBreak(lines.length * 7);
    lineImg.forEach((line) => {
      if (yPosition + 5 > pageHeight - bottomMargin) {
        addNewPage();
        yPosition = topMargin;
      }
      doc.text(line, leftMargin, yPosition, {
        align: "justify",
        maxWidth: maxWidth,
      });
      //yPosition += Math.max(10, lines.length * 5);
      yPosition += 5;
    }); */
    // Verificar si necesitamos nueva página para las firmas
    // checkPageBreak(60);
    checkPageBreak(bottomMargin + 20);
    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    doc.text(`Alcance y responsabilidades`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 5;
    doc.setFontSize(7);
    doc.setFontSize(textPar);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    someText(
      "Cabe destacar que el presente documento no constituye un estudio técnico vinculante, ya que se fundamenta en una inspección visual de campo y revisión de información secundaria existente. Para la emisión de un dictamen técnico con validez certificada, se requerirían estudios especializados que incluyan levantamientos topográficos detallados, obtención y análisis de muestras de suelo, ensayos de laboratorio y demás necesarios.",
      0,
      0,
      0,
    );
    yPosition += 5;
    // doc.setTextColor(150, 150, 150);
    /*  doc.text(
      "Cabe destacar que el presente documento no constituye un estudio técnico vinculante, ya que se fundamenta en una inspección visual de campo y revisión de información secundaria existente. Para la emisión de un dictamen técnico con validez certificada, se requerirían estudios especializados que incluyan levantamientos topográficos detallados, obtención y análisis de muestras de suelo, ensayos de laboratorio y demás necesarios.",
      leftMargin,
      yPosition,
      {
        align: "justify",
        maxWidth: maxWidth - 15,
      },
    );
    yPosition += 20;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    // doc.setTextColor(150, 150, 150);
    doc.text(
      "De conformidad con la normativa vigente, en especial la Ley Orgánica de Gestión Integral de Riesgos de Desastres (LOGIRD) y el Código Orgánico de Organización Territorial, Autonomía y Descentralización (COOTAD), la institución emisora no asume responsabilidad por las decisiones que se adopten con base en este análisis técnico de carácter referencial, cuya aplicación corresponde exclusivamente al encargado de la infraestructura o autoridad competente. En observancia del principio de autoprotección, será responsabilidad de los usuarios ejecutar las acciones básicas de mantenimiento, conservación y adecuación funcional necesarias para mantener las condiciones de seguridad, conforme a la normativa vigente.",
      leftMargin,
      yPosition,
      {
        align: "justify",
        maxWidth: maxWidth - 15,
      },
    ); */

    // Espacio para firmas

    if (codigosPermitidos.includes(require.ci)) {
      checkPageBreak(bottomMargin + 20);
      divisoriaLine();
      /* doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("FIRMAS DE RESPONSABLES", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 5; */

      // Dibujar cajas para firmas
      const boxWidth = (pageWidth - leftMargin - rightMargin - 20) / 2;
      const boxHeight = 45;

      // Primera firma
      if (String(require.ci) !== "1150511853") {
        const empleadoEncontrado = employed.find(
          (emp) => emp.ci === String(require.ci),
        );
        doc.setDrawColor(0, 0, 0);
        doc.rect(leftMargin, yPosition, boxWidth, boxHeight);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
          "Firma:______________________________",
          leftMargin + 5,
          yPosition + 25,
        );
        doc.text(empleadoEncontrado?.name, leftMargin + 5, yPosition + 35);
        doc.text(empleadoEncontrado?.cargo, leftMargin + 5, yPosition + 42);
      }

      // Segunda firma
      doc.rect(leftMargin + boxWidth + 20, yPosition, boxWidth, boxHeight);

      doc.text(
        "Firma:______________________________",
        leftMargin + boxWidth + 25,
        yPosition + 25,
      );
      doc.text(
        "Ing.José Luis Lima Maza",
        leftMargin + boxWidth + 25,
        yPosition + 35,
      );
      doc.text(
        "Coordinador de Gestión de Riesgos",
        leftMargin + boxWidth + 25,
        yPosition + 42, // Corregido: estaba en yPosition + 5
      );

      yPosition += boxHeight + 10;
    }

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Reporte generado automáticamente",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 15,
      { align: "center" },
    );

    /* doc.setFontSize(8);
    doc.text(
      "En base al Literal d, artículo 113 de la ordenanza 070-2025, REFORMA A LA ORDENANZA DE ACTUALIZACIÓN DE LOS PLANES: DE DESARROLLO Y ORDENAMIENTO TERRITORIAL (PDOT) 2023-2027 Y DE USO Y GESTIÓN DE SUELO (PUGS) 2023-2033 URBANO Y RURAL DEL CANTÓN LOJA ",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center", maxWidth: 90 },
    ); */

    // Guardar el PDF
    doc.save(
      `reporte_${titulo.replace(/[^a-z0-9]/gi, "_")}_${fechaDescarga.replace(
        /[/,: ]/g,
        "-",
      )}.pdf`,
    );
  } catch (e) {
    console.error("Error al generar PDF:", e);
    alert("Ocurrió un error al generar el reporte");
  }
}
