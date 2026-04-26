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
  requires,
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
    const leftMargin = 10 + 10;
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
    //add descripcion event general
    // DESCRIPCIÓN
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    doc.text("1.1. Descripción del evento", leftMargin + 5, yPosition);
    //doc.text("Descripción:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 5;
    someText(polAF.desc_plan, 0, 0, 0);
    // Línea divisoria
    divisoriaLine();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    doc.text("1.1. Anexo Fotografico General", leftMargin, yPosition);
    yPosition += 5;
    if (polAF.img) {
      const imageUrls = polAF.img
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
            /* const rowsInThisPage = Math.ceil(
              imagesProcessedInThisPage / imagesPerRow,
            ); */
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
          yPosition += 5;
        }

        /*      // Espacio después de las imágenes
        yPosition += 5; */
      }
    }
    // SITUACIÓN ACTUAL
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    doc.text("2. Situación Actual del evento", leftMargin, yPosition);
    yPosition += 5;
    doc.text("2.1 Afectaciones Registradas", leftMargin + 10, yPosition);
    yPosition += 5;
    doc.setFontSize(textPar);
    /* afect.map(async (afect, index) => {
      //afectDoc(afect, index, leftMargin, yPosition, maxWidth);
      checkPageBreak(bottomMargin + 10);
      SubdivisoriaLine();
      const byData = parseByField(afect.data.by);
      const coord = coordForm(afect.data.ubi);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Afectación ${index + 1} (${coord?.[0] || "0"}, ${coord?.[1] || "0"}) - ${afect.data.estado || "pendiente"}`,
        leftMargin,
        yPosition,
        //{ maxWidth: maxWidth / 2 },
      );
      yPosition += 5;
      doc.setFont("helvetica", "normal");
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
      someText(`- Descripción de la afectación: ${afect?.data.desc}`, 0, 0, 0);

      let imagemapAF = await captureMap(
        coord?.[0],
        coord?.[1],
        18,
        //  polygon 
      );
      doc.addImage(
        imagemapAF,
        "PNG",
        leftMargin + 20,
        topMargin + 10,
        maxWidth / 2,
        70,
      );
      yPosition += 5;
    }); */
// Usar for...of para manejar correctamente las promesas
for (let index = 0; index < afect.length; index++) {
  const afectItem = afect[index];
  checkPageBreak(bottomMargin + 15);
  SubdivisoriaLine();
  const byData = parseByField(afectItem.data.by);
  const coord = coordForm(afectItem.data.ubi);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Afectación ${index + 1} - ${afectItem.data.estado || "pendiente"}`,
    leftMargin,
    yPosition,
  );
  yPosition += 5;
  doc.setFont("helvetica", "normal");
  doc.text(
    `- Fecha de Actualización: ${formatDate(afectItem.data?.date_act) || "Fecha no registrada"}`,
    leftMargin,
    yPosition,
  );
  yPosition += 5;
  doc.text(
    `- Reportado por: ${byData?.name || "Sin nombre"} - ${byData?.cargo || "Sin cargo"}`,
    leftMargin,
    yPosition,
  );
  yPosition += 5;
  // Descripción de la afectación
  someText(`- Descripción de la afectación: ${afectItem?.data.desc}`, 0, 0, 0);
 // Guardar posición actual para la imagen
  doc.text(
    `Ubicación: Lat ${coord?.[0].toFixed(6) || "0"}, Lng ${coord?.[1].toFixed(6) || "0"} `,
    leftMargin,
    yPosition,
  );
  yPosition += 2;
  const imageYPosition = yPosition;
  // Generar la imagen
  checkPageBreak(bottomMargin + 70);
  try {
    const imagemapAF = await captureMap(
      coord?.[0],
      coord?.[1],
      18,
    );
    
    if (imagemapAF) {
      doc.addImage(
        imagemapAF,
        "PNG",
        leftMargin,
        imageYPosition,
        maxWidth / 2,
        70,
      );
      yPosition += 75; // Altura de la imagen + espacio
    } else {
      doc.text(
        `- Mapa no disponible`,
        leftMargin,
        imageYPosition,
      );
      yPosition += 10;
    }
  } catch (error) {
    console.error("Error al capturar el mapa:", error);
    doc.text(
      `- Error al cargar el mapa`,
      leftMargin,
      imageYPosition,
    );
    yPosition += 10;
  }
}
    // Línea divisoria final
    // Campos principales
    // Verificar si necesitamos nueva página para el contenido siguiente
    checkPageBreak(bottomMargin + 10);
    // Campos principales
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    doc.text("2.2. Resumen de Afectaciones", leftMargin + 10, yPosition);
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
    doc.setFontSize(textPar);
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
      checkPageBreak(bottomMargin + 10);
      doc.text(String(textoAMostrar), leftMargin + 100, yPosition);
      yPosition += 3;
      SubdivisoriaLine();
      // Acumular para el total general si es necesario
      sumaTotalGeneral += sumaCampoActual;
      
    });
    //console.log("Suma total de todos los campos:", sumaTotalGeneral);
  
    checkPageBreak(bottomMargin + 20);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    yPosition += 5;
    doc.text("3. Acciones Realizadas", leftMargin, yPosition);
    doc.setFont("helvetica", "bold");
    yPosition += 5;
    doc.setFontSize(textPar);
    accions.map((accion, index) => {
      checkPageBreak(bottomMargin + 20);
      SubdivisoriaLine();
      const byData = parseByField(accion.data.by);
      const coord = coordForm(accion.data.ubi);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(textPar);
      doc.text(
        `Acción: ${index + 1} (${coord?.[0] || "0"}, ${coord?.[1] || "0"}) - ${accion.data.estado || "pendiente"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;
      doc.setFont("helvetica", "normal");
      doc.text(
        `- Fecha de Actualización: ${formatDate(accion.data?.date_act) || "Fecha no registrada"} - ${accion.data?.estado || "Vigenta"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;
      doc.text(
        `- Reportado por: ${byData?.miembro || "Sin nombre"} - ${byData?.cargo || "Sin cargo"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;
      doc.text(
        `- Mtt/GT que atiende: ${accion.data?.sector_COE || "no registrado"} - ${accion.data?.Inst_atie || "Institución no registrada"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;
      someText(
        `- Descripción de la acción: ${accion?.data.acc_resp || "Sin descripción"}`,
        0,
        0,
        0,
      );

      someText(
        `- Observaciones: ${accion.data?.obs || "no existe observaciones"}`,
        0,
        0,
        0,
      );
      // Columna izquierda
      doc.setFont("helvetica", "bold");
      //ddoc.setFontSize(subtitle);
      checkPageBreak(bottomMargin + 20);
      doc.text(
        `Recurso Movilizados - ${accion.data?.Inst_atie || "Institución no registrada"} - ${accion.data?.date_mov || "Fecha no registrada"}`,
        leftMargin,
        yPosition,
      );
      doc.setFontSize(textPar);
      doc.setFont("helvetica", "normal");
      yPosition += 5;
      doc.text(
        `- # Herramientas: ${accion.data?.n_herramientas || "Cantidad no registrada"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;

      doc.text(
        `- # Personal: ${accion.data?.n_personal || "Cantidad no registrada"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;

      doc.text(
        `- # Unidades de emergencia: ${accion.data?.u_emerg || "Cantidad no registrada"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;

      doc.text(
        `- # Livianos: ${accion.data?.n_livianos || "Cantidad no registrada"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;

      doc.text(
        `- # Pesados: ${accion.data?.n_pesados || "Cantidad no registrada"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;

      doc.text(
        `- # Unidades aéreas: ${accion.data?.u_aereas || "Cantidad no registrada"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;

      doc.text(
        `- # Otros: ${accion.data?.otro || "No hay información adicional"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;
      someText(
        `- observaciones: ${accion.data?.obser || "no existe observaciones de recursos movilizados"}`,
        0,
        0,
        0,
      );
      // Título de Necesidades Identificadas
      doc.setFont("helvetica", "bold");
      checkPageBreak(bottomMargin + 20);
      doc.text(
        `Necesidades Identificadas - ${accion.data?.to_mtt_gt || "MTT/GT No especificado"} - ${accion.data?.date_req || "Fecha no registrada"} - ${accion.data?.state_req || "Estado no registrado"}`,
        leftMargin,
        yPosition,
      );
      doc.setFontSize(textPar);
      doc.setFont("helvetica", "normal");
      yPosition += 5;

      // Código de requerimiento
      doc.text(
        `- Código de requerimiento: ${accion.data?.code_req || "Código no registrado"} -  ${accion.data?.state_requ || "Estado no registrado"}`,
        leftMargin,
        yPosition,
      );
      yPosition += 5;

      // Necesidad
      someText(
        `- Necesidad: ${accion.data?.need || "No especificada"}`,
        0,
        0,
        0,
      );
      someText(
        `- Acción implementada: ${accion.data?.acc_implementada || "No se ha implementado acción"}`,
        0,
        0,
        0,
      );

      someText(
        `- Observaciones: ${accion.data?.obs_need || "no existen observaciones de necesidades identificadas"}`,
        0,
        0,
        0,
      );
    });

    console.log(require)
    divisoriaLine();
    checkPageBreak(bottomMargin + 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("4. Anexo Fotografico", leftMargin, yPosition);
    yPosition += 5;
    // Agregar imagen (si existe)
    if (files && Array.isArray(files) && files.length > 0) {

      checkPageBreak(bottomMargin + 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("4. Anexo Fotografico", leftMargin, yPosition);
    yPosition += 5;
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
    doc.setFontSize(9);
    doc.text(
      `${parsedMember?.cargo_COE || "Cargo"} de ${mtt}`,
      leftMargin + 5,
      yPosition + 5,
    );
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
      `${findLider?.cargo_COE || "Cargo"} de ${mtt}`,
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
