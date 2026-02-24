import jsPDF from "jspdf";
import { captureMap } from "../../../analisis/afects/maptoimage";
// Función generarPDF actualizada:
export async function generarPDFAccions(
  titulo,
  lat,
  lng,
  itemStr,
  data_V,
  polAF,
  mtt,
  files,
) {
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
      `Detalle de Información de acciones realizadas ${item?.prov}-${item.canton}${item.parroq_aten}-${item.sector}-${item.event_row}-${item.row} `,
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
    doc.text(`1. Identificación del avento adverso`, leftMargin, yPosition, {
      align: "left",
    });
    yPosition += 8;
    // Datos del evento adverso
    doc.setFont("helvetica", "bold");
    doc.text("Provincia", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      String(item.prov || polAF.prov || " "),
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
      String(item.parroq_aten || polAF.parroq || ""),
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
    doc.setFont("helvetica", "bold");
    doc.text("Descripción:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    const lines_desc_pol = doc.splitTextToSize(
      String(polAF.desc_plan || "No existe Descripción"),
      maxWidth - 40,
    );
    // Verificar espacio necesario
    const descHeight = lines_desc_pol.length * 4; // 5px por línea
    checkPageBreak(descHeight + 40);
    // Mostrar descripción con sangría
    doc.text(lines_desc_pol, leftMargin + 30, yPosition, {
      align: "justify",
      maxWidth: maxWidth - 30,
    });
    // Actualizar yPosition después de la descripción
    yPosition += descHeight;
    // Línea divisoria
    checkPageBreak(yPosition + 40);
    divisoriaLine();
    // SITUACIÓN ACTUAL
  doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`2. Acciones de Respuesta de ${mtt} `, leftMargin, yPosition);
    yPosition += 5;
    doc.setFont("helvetica", "normal");
    const lines_situacion = doc.splitTextToSize(
      String(item.desc || "No existe descripción de situación actual"),
      maxWidth - 20,
    );
    // Calcular altura necesaria
    const situacionHeight = lines_situacion.length * 4;
    checkPageBreak(situacionHeight + 30);

    // Mostrar situación actual
    doc.text(lines_situacion, leftMargin + 5, yPosition, {
      align: "justify",
      maxWidth: maxWidth - 10,
    });

    // ACTUALIZAR yPosition DESPUÉS DEL TEXTO (¡esto es lo importante!)
    yPosition += situacionHeight + 5;

    // Línea divisoria final
    divisoriaLine();
    // Campos principales
    // Verificar si necesitamos nueva página para el contenido siguiente
    checkPageBreak(100);
    // Campos principales
    doc.setFont("helvetica", "bold");
    doc.text("3. AFECTACIONES - RESUMEN", leftMargin, yPosition);
    yPosition += 8;
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

    doc.text("Firma:___________________________", leftMargin + 5, yPosition + 45);

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
