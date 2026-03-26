import jsPDF from "jspdf";
import { captureMap } from "../../../analisis/afects/maptoimage";
import {
  fieldsGT3,
  fieldsMTT1,
  fieldsMTT2,
  fieldsMTT3,
  fieldsMTT4,
  fieldsMTT5,
  fieldsMTT6,
  fieldsMTT7,
} from "../popups/afectMMT/Fields_afect/fiels_mtt";
//import { afectDoc } from "./afect_int";
import { parseByField } from "../../../utils/utils";
import { coordForm } from "../../../utils/Coords";

// Función generarPDF actualizada:
export async function generarPDFEvent(
  titulo,
  afect,
  accions,
  polygon,
  marker,
  polAF,
  mtt,
  files,
) {
  try {
    const doc = new jsPDF();
    const title = 11;
    const subtitle = 10;
    const textPar = 9;
    // Configuración de márgenes
    const leftMargin = 10;
    const rightMargin = 15;
    const topMargin = 35;
    //const bottomMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - leftMargin - rightMargin;
    const bottomMargin = 20;
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
        doc.addImage(fondoBase64, "PNG", 5, 0, pageWidth, pageHeight);
      }
    };
    // Función para línea divisoria
    const divisoriaLine = () => {
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
      yPosition += 5;
    };
    const SubdivisoriaLine = () => {
      doc.setDrawColor(51, 38, 97);
      doc.line(leftMargin, yPosition, pageWidth - rightMargin - 20, yPosition);
      yPosition += 5;
    };
    const someText = (text, max, maxOne, left) => {
      doc.setFontSize(textPar);
      doc.setFont("helvetica", "normal");

      // El ancho máximo para split debería ser el mismo que para dibujar
      const maxTextWidth = maxWidth - maxOne; // Usa maxOne para ambos

      const linesaccion = doc.splitTextToSize(
        String(text || "No existe personas afectadas, heridas o fallecidas"),
        maxTextWidth, // Usar el mismo ancho máximo
      );

      linesaccion.forEach((line) => {
        if (yPosition + 5 > pageHeight - bottomMargin) {
          addNewPage();
          yPosition = topMargin;
        }
        doc.text(line, leftMargin + left, yPosition, {
          align: "justify",
          maxWidth: maxTextWidth, // Usar el mismo ancho máximo
        });
        yPosition += 5;
      });
    };

    const formatDate = (dateString) => {
      if (!dateString) return "No disponible";
      try {
        const [datePart] = dateString.split(" ");
        const [d, m, y] = datePart.split("/");
        return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {
        return dateString;
      }
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
    /* const formatListText = (text) => {
      if (!text) return [];
      // Dividir por guiones y limpiar cada elemento
      return text
        .split("-")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) => `• ${item}`);
    }; */
    const Fondo1 = "https://i.imgur.com/bAcgjxK.png";
    // Agrega fondo antes de todo el contenido
    const fondoBase64 = await getImageFondo(Fondo1);
    if (fondoBase64) {
      doc.addImage(fondoBase64, "PNG", 5, 0, pageWidth, pageHeight);
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
    doc.setFontSize(title);
    doc.text(
      `Comite de Operaciones Emergentes - ${mtt}`,
      pageWidth / 2,
      topMargin,
      { align: "center" },
    );
    doc.setFont("helvetica", "bold");

    doc.text(
      `Detalle de Información de afectación ${polAF?.provincia}-${polAF.canton}${polAF.parroq}-${polAF.sector}-${polAF.row} `,
      pageWidth / 2,
      topMargin + 5,
      { align: "center" },
    );
    yPosition += 2;
    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    doc.text(`1. Identificación del avento adverso`, leftMargin, yPosition, {
      align: "left",
    });
    yPosition += 5;
    // Datos del evento adverso
    doc.setFont("helvetica", "bold");
    doc.setFontSize(textPar);
    doc.text("Provincia", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(polAF.provincia || polAF.prov || " "),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Cantón", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(polAF.canton || polAF.canton || ""),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Parroquia", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(polAF.parroq || polAF.parroq || ""),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Sector ", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(polAF.sector || polAF.sector || ""),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Fecha", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(formatDate(polAF.date_event) + " - " + polAF.time || ""),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Alerta", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(polAF.alerta || ""), leftMargin + 25, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Latitud ", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(marker?.[0] || ""), leftMargin + 25, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Longitud", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(String(marker?.[1] || ""), leftMargin + 25, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Evento", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(polAF.event || polAF.event || ""),
      leftMargin + 25,
      yPosition,
    );
    yPosition += 20;
    let imagemap = await captureMap(marker[0], marker[1], 18 /*  polygon */);
    doc.addImage(
      imagemap,
      "PNG",
      leftMargin + 90,
      topMargin + 10,
      maxWidth / 2,
      70,
    );
    yPosition += 5;
    divisoriaLine();
    //add descripcion event general
    // DESCRIPCIÓN
    doc.setFont("helvetica", "bold");
    doc.text("Descripción:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    someText(polAF.desc_plan, 15, 15, 20);
    // Línea divisoria
    divisoriaLine();
    // SITUACIÓN ACTUAL
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    doc.text("2. Situación Actual del evento:", leftMargin, yPosition);
    yPosition += 5;
    doc.setFontSize(textPar);
    afect.map(async (afect, index) => {
      //afectDoc(afect, index, leftMargin, yPosition, maxWidth);
      checkPageBreak(bottomMargin + 20);
      SubdivisoriaLine();
      const byData = parseByField(afect.data.by);
      const coord = coordForm(afect.data.ubi);
      doc.setFont("helvetica", "normal");
      doc.text(
        `- Afectación: ${index + 1} (${coord?.[0] || "0"}, ${coord?.[1] || "0"})`,
        leftMargin,
        yPosition,
        //{ maxWidth: maxWidth / 2 },
      );
      yPosition += 5;
      doc.text(
        `- Fecha de Actualización: ${formatDate(afect.data?.date_act) || "Fecha no registrada"}`,
        leftMargin,
        yPosition,
        //{ maxWidth: maxWidth / 2 },
      );
      yPosition += 5;
      doc.text(
        `- Reportado por: ${byData?.name || "Sin nombre"} - ${byData?.cargo || "Sin cargo"}`,
        leftMargin,
        yPosition,
        //{ maxWidth: maxWidth / 2 },
      );
      yPosition += 5;
      someText(
        `- Descripción de la afectación: ${afect?.data.desc}`,
        0,
        0,
        0,
      );
      
    });
    // Línea divisoria final
    divisoriaLine();
    // Campos principales
    // Verificar si necesitamos nueva página para el contenido siguiente
    checkPageBreak(100);
    // Campos principales
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle)
    doc.text("3. AFECTACIONES - RESUMEN", leftMargin, yPosition);
    yPosition += 8;
    let currentField;
    switch (mtt) {
      case "MTT1":
        currentField = fieldsMTT1;
        break;
      case "MTT2":
        currentField = fieldsMTT2;
        break;
      case "MTT3":
        currentField = fieldsMTT3;
        break;
      case "MTT4":
        currentField = fieldsMTT4;
        break;
      case "MTT5":
        currentField = fieldsMTT5;
        break;
      case "MTT6":
        currentField = fieldsMTT6;
        break;
      case "MTT7":
        currentField = fieldsMTT7;
        break;
      default:
        currentField = fieldsGT3;
    }

    // Mostrar campos y acumular suma de valores específicos si es necesario
    let sumaTotalGeneral = 0;
    doc.setFontSize(textPar)
    currentField.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(41, 98, 255);
      doc.text(item.label, leftMargin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 140, 0);

      // Sumar todos los valores para este campo específico
      let sumaCampoActual = 0;
      let valoresEncontrados = [];

      // Recorrer todos los elementos de afect para sumar
      afect.forEach((afectItem) => {
        // Verificar si existe el key en el data del afectItem
        if (afectItem.data && afectItem.data[item.key] !== undefined) {
          const valor = afectItem.data[item.key];
          //console.log(item.label, item.key, "=", valor);

          // Acumular para este campo específico
          const valorNumerico = Number(valor);
          if (!isNaN(valorNumerico)) {
            sumaCampoActual += valorNumerico;
            valoresEncontrados.push(valor);
          }
        }
      });

      // Mostrar el valor (puede ser la suma o los valores individuales)
      // Opción 1: Mostrar la suma
      const textoAMostrar = sumaCampoActual > 0 ? sumaCampoActual : "";

      // Opción 2: Mostrar los valores individuales (descomenta si prefieres esto)
      // const textoAMostrar = valoresEncontrados.join(", ");

      doc.text(String(textoAMostrar), leftMargin + 100, yPosition);

      // Acumular para el total general si es necesario
      sumaTotalGeneral += sumaCampoActual;

      yPosition += 8;
    });

    //console.log("Suma total de todos los campos:", sumaTotalGeneral);

    checkPageBreak(100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("4. Anexo Fotografico", leftMargin, yPosition);
    yPosition += 5;
    // Agregar imagen (si existe)
    if (files && Array.isArray(files) && files.length > 0) {
      const maxImages = 6;
      const imagesToShow = files.slice(0, maxImages);
      const imgWidth = (pageWidth - leftMargin - rightMargin - 10) / 2;
      const imgHeight = 80;
      let x = leftMargin;
      let y = yPosition;
      let count = 0;
      for (let i = 0; i < imagesToShow.length; i++) {
        try {
          const item = imagesToShow[i];
          const file = item.file;
          const detail = item.detail || "";
          // Crear URL para el File object
          const imgUrl =
            file instanceof File ? URL.createObjectURL(file) : file;
          if (count > 0 && count % 2 === 0) {
            x = leftMargin;
            y += imgHeight + 20; // Espacio extra para el detalle
          }
          // Agregar imagen
          doc.addImage(imgUrl, "JPEG", x, y, imgWidth, imgHeight);
          // Agregar detalle
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.text(detail, x, y + imgHeight + 5, {
            maxWidth: imgWidth - 5,
            align: "justify",
          });
          x += imgWidth + 10;
          count++;
          // Liberar memoria del objeto URL
          if (file instanceof File) {
            URL.revokeObjectURL(imgUrl);
          }
        } catch (error) {
          console.error(`Error imagen ${i}:`, error);
        }
      }
      yPosition = y + imgHeight + 30;
    }
    // Verificar si necesitamos nueva página para las firmas
    checkPageBreak(55);
    const storedMember = localStorage.getItem("memberD");
    const parsedMember = JSON.parse(storedMember);
    const storedApoyo = localStorage.getItem("apoyoD");
    const parsedApoyo = JSON.parse(storedApoyo);
    const findLider = parsedApoyo.find((item) => item.cargo_COE === "Lider");

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
    const boxHeight = 50;

    // Primera firma
    doc.setDrawColor(0, 0, 0);
    //doc.rect(leftMargin, yPosition, boxWidth, boxHeight);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(parsedMember?.cargo_COE || "Cargo", leftMargin + 5, yPosition + 5);
    doc.text(
      parsedMember?.miembro || "Miembro",
      leftMargin + 5,
      yPosition + 10,
    );
    doc.text(
      parsedMember?.ci.toString() || "Cédula",
      leftMargin + 5,
      yPosition + 15,
    );
    doc.text(
      `${parsedMember?.cargo || "Cargo"} - ${parsedMember?.inst || "Institución"}` ||
        "Institución",
      leftMargin + 5,
      yPosition + 20,
      { maxWidth: 70 },
    );

    doc.text(
      "Firma:___________________________",
      leftMargin + 5,
      yPosition + 45,
    );

    // Segunda firma
    //doc.rect(leftMargin + boxWidth + 15, yPosition, boxWidth, boxHeight);

    doc.text(
      findLider?.cargo_COE || "Cargo",
      leftMargin + boxWidth + 20,
      yPosition + 5,
    );
    doc.text(
      findLider?.miembro || "Miembro",
      leftMargin + boxWidth + 20,
      yPosition + 10,
    );
    doc.text(
      findLider?.ci.toString() || "Cédula",
      leftMargin + boxWidth + 20,
      yPosition + 15,
    );
    doc.text(
      `${findLider?.cargo || "Cargo"} - ${findLider?.inst || "Institución"}` ||
        "Institución",
      leftMargin + boxWidth + 20,
      yPosition + 20,
      { maxWidth: 70 },
    );

    doc.text(
      "Firma:___________________________",
      leftMargin + boxWidth + 20,
      yPosition + 45,
    );

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
