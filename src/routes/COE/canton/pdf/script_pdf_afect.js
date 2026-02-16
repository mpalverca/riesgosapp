import jsPDF from "jspdf";
import { captureMap } from "../../../analisis/afects/maptoimage";
import {
  fieldsGT1,
  fieldsGT2,
  fieldsGT3,
  fieldsMTT1,
  fieldsMTT2,
  fieldsMTT3,
  fieldsMTT4,
  fieldsMTT5,
  fieldsMTT6,
  fieldsMTT7,
} from "../popups/afectMMT/Fields_afect/fiels_mtt";

// Función generarPDF actualizada:
export async function generarPDFAfect(
  titulo,
  lat,
  lng,
  itemStr,
  data_V,
  polAF,
  mtt,
  images,
) {
  console.log(
    "titulo:",
    titulo,
    "Latitud",
    lat,
    lng,
    "item:",
    itemStr,
    "Data",
    data_V,
    "PolAfecta",
    polAF,
  );
  try {
    const item = itemStr;
    const doc = new jsPDF();
    // Configuración de márgenes
    const leftMargin = 10;
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
    const Fondo1 = "https://i.imgur.com/bAcgjxK.png";
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

    /*  const logo = "https://i.imgur.com/WwKwvX1.png";
    if (logo) {
      doc.addImage(logo, "PNG", 0, 0, pageWidth / 2, topMargin);
    } */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      `Comite de Operaciones Emergentes - ${mtt}`,
      pageWidth / 2,
      topMargin,
      { align: "center" },
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      `Detalle de Información de afectación ${item?.provincia}-${item.canton}${item.parroq}-${item.sector}-${item.row_event}-${item.row} `,
      pageWidth / 2,
      topMargin + 5,
      { align: "center" },
    );
    yPosition += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(
      `La información en este documento fue Actualizada por: ${data_V.name}-${data_V.cargo}`,
      pageWidth / 2,
      yPosition,
      {
        align: "center",
      },
    );
    yPosition += 2;
    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`1. IDENTIFICACIÓN DEL EVENTO ADVERSO  `, leftMargin, yPosition, {
      align: "left",
    });
    yPosition += 8;
    // Datos del evento adverso
    doc.setFont("helvetica", "bold");
    doc.text("Provincia", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(item.provincia || polAF.prov || " "),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Cantón", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(item.canton || polAF.canton || ""),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Parroquia", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(item.parroq || polAF.parroq || ""),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Sector ", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(item.sector || polAF.sector || ""),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Fecha", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(item.date_event || polAF.date_event, polAF.time || ""),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Fecha", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.date_act || ""), leftMargin + 25, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Alerta", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(polAF.alerta || ""), leftMargin + 25, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Latitud ", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(lat || ""), leftMargin + 25, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Longitud", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(lng || ""), leftMargin + 25, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Evento", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(item.event || polAF.event || ""),
      leftMargin + 25,
      yPosition,
    );
    let imagemap = await captureMap(lat, lng, 18);
    doc.addImage(
      imagemap,
      "PNG",
      leftMargin + 90,
      topMargin + 17,
      maxWidth / 2,
      80,
    );
    yPosition += 5;
    divisoriaLine();
    //add descripcion event general
    // DESCRIPCIÓN
    doc.setFont("helvetica", "bold");
    doc.text("Descripción:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    const lines_desc_pol = doc.splitTextToSize(
      String(polAF.desc_plan || "No existe Descripción"),
      maxWidth - 40,
    );
    // Verificar espacio necesario
    const descHeight = lines_desc_pol.length * 4; // 5px por línea
    checkPageBreak(descHeight + 10);
    // Mostrar descripción con sangría
    doc.text(lines_desc_pol, leftMargin + 30, yPosition, {
      align: "justify",
      maxWidth: maxWidth - 30,
    });
    // Actualizar yPosition después de la descripción
    yPosition += descHeight;
    // Línea divisoria
    divisoriaLine();
    // SITUACIÓN ACTUAL
    doc.setFont("helvetica", "bold");
    doc.text("Situación Actual del evento:", leftMargin, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "normal");
    const lines_situacion = doc.splitTextToSize(
      String(item.desc || "No existe descripción de situación actual"),
      maxWidth - 20,
    );
    // Calcular altura necesaria
    const situacionHeight = lines_situacion.length * 4;
    checkPageBreak(situacionHeight + 10);

    // Mostrar situación actual
    doc.text(lines_situacion, leftMargin + 5, yPosition, {
      align: "justify",
      maxWidth: maxWidth - 10,
    });

    // ACTUALIZAR yPosition DESPUÉS DEL TEXTO (¡esto es lo importante!)
    yPosition += situacionHeight + 15;

    // Línea divisoria final
    divisoriaLine();
    // Campos principales
    // Verificar si necesitamos nueva página para el contenido siguiente
    checkPageBreak(10);
    // Campos principales
    doc.setFont("helvetica", "bold");
    doc.text("3. AFECTACIONES - RESUMEN", leftMargin, yPosition);
    yPosition += 8;
    const currentField =
      mtt === "MTT1"
        ? fieldsMTT1
        : mtt === "MTT2"
          ? fieldsMTT2
          : mtt === "MTT3"
            ? fieldsMTT3
            : mtt === "MTT4"
              ? fieldsMTT4
              : mtt === "MTT5"
                ? fieldsMTT5
                : mtt === "MTT6"
                  ? fieldsMTT6
                  : mtt === "MTT7"
                    ? fieldsMTT7
                    : mtt === "GT1"
                      ? fieldsGT1
                      : mtt === "GT2"
                        ? fieldsGT2
                        : fieldsGT3;

    currentField.forEach(({ key, label }) => {
      if (item[key]) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(41, 98, 255);
        doc.text(label, leftMargin, yPosition);
      }
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 140, 0);
      doc.text(String(item[key] || ""), leftMargin + 100, yPosition);
      yPosition += 8;
    });

      doc.setFont("helvetica", "bold");
    doc.text("4. Anexo Fotografico", leftMargin, yPosition);

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

    let imgDataString = `${images}`;
    if (imgDataString) {
      const imageUrls = imgDataString
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url);

      if (imageUrls.length > 0) {
        // Configuración
        const maxImagesToShow = 6;
        const imagesToProcess = imageUrls.slice(0, maxImagesToShow);
        const imagesPerRow = Math.min(imagesToProcess.length, 2);
        const rows = Math.ceil(imagesToProcess.length / imagesPerRow);

        // Altura dinámica basada en el espacio disponible
        const pageHeight = doc.internal.pageSize.height;
        const bottomMargin = 30;
        const spaceLeftOnPage = pageHeight - yPosition - bottomMargin;

        // Determinar altura óptima
        let imageHeight = 100; // Altura por defecto
        const minImageHeight = 50; // Altura mínima aceptable

        // Calcular altura máxima que cabe
        const maxPossibleHeight = Math.max(
          minImageHeight,
          (spaceLeftOnPage - rows * 10 - 15) / rows,
        );

        if (imageHeight > maxPossibleHeight) {
          // Si la altura por defecto no cabe, usar la máxima posible
          imageHeight = Math.max(minImageHeight, maxPossibleHeight);
        }

        // Verificar si aún no cabe
        const requiredHeight = imageHeight * rows + rows * 10 + 15;

        // Solo crear nueva página si es absolutamente necesario
        if (requiredHeight > spaceLeftOnPage && spaceLeftOnPage < 100) {
          checkPageBreak(requiredHeight);
        }

        // Procesar imágenes
        const availableWidth = pageWidth - leftMargin - rightMargin;
        const spacing = 10;
        const imgWidth =
          imagesPerRow > 1 ? (availableWidth - spacing) / 2 : availableWidth;

        let x = leftMargin,
          y = yPosition,
          count = 0;

        for (let i = 0; i < imagesToProcess.length; i++) {
          try {
            let imgData = imagesToProcess[i];

            if (imgData && !imgData.startsWith("data:image")) {
              imgData = await getImageBase64(imgData);
            }
            if (imgData) {
              // Nueva fila cada 2 imágenes
              if (count > 0 && count % 2 === 0) {
                x = leftMargin;
                y += imageHeight + spacing;
              }
              // Agregar imagen
              doc.addImage(imgData, "JPEG", x, y, imgWidth, imageHeight);
              // Opcional: agregar número de imagen
              doc.setFontSize(8);
              doc.setFont("helvetica", "normal");
              doc.text(`${i + 1}`, x + 5, y + 12);
              x += imgWidth + spacing;
              count++;
            }
          } catch (error) {
            console.warn(`Error con imagen ${i + 1}:`, error);
          }
        }
        if (count > 0) {
          // Actualizar posición Y
          yPosition = y + imageHeight + 15;

          // Línea separadora
          doc.line(
            leftMargin,
            yPosition - 5,
            pageWidth - rightMargin,
            yPosition - 5,
          );
          yPosition += 5;
          // Nota si hay más imágenes
          if (imageUrls.length > maxImagesToShow) {
            doc.setFontSize(9);
            doc.text(
              `* Se muestran ${maxImagesToShow} de ${imageUrls.length} imágenes`,
              leftMargin,
              yPosition,
            );
            yPosition += 10;
          }
        }
      }
    }
    // Verificar si necesitamos nueva página para las firmas
    checkPageBreak(10);

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
      { align: "center" },
    );

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
