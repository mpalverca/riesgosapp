import jsPDF from "jspdf";
import { captureMap } from "../../../analisis/afects/maptoimage";
import { parseByField } from "../../../utils/utils";
import { coordForm } from "../../../utils/Coords";

// ========== CONSTANTES DE ESTILO ==========
const STYLES = {
  COLORS: {
    PRIMARY: [51, 38, 97],
    SECONDARY: [100, 100, 100],
    SUCCESS: [46, 125, 50],
    WARNING: [237, 108, 2],
    DANGER: [200, 50, 50],
    DIVIDER: [200, 200, 200],
    TEXT: [0, 0, 0],
    TEXT_LIGHT: [100, 100, 100],
    WHITE: [255, 255, 255],
  },
  FONTS: {
    TITLE: 14,
    SUBTITLE: 12,
    HEADING: 11,
    BODY: 9,
    SMALL: 8,
    CAPTION: 7,
  },
  MARGINS: {
    LEFT: 20,
    RIGHT: 15,
    TOP: 35,
    BOTTOM: 20,
  },
  LINE_HEIGHT: 5,
  BOX_PADDING: 4,
  CARD_HEIGHT: 15,
};

// ========== FUNCIÓN PRINCIPAL ==========
export async function generarPDFAccions(titulo, accions, vigente, finalizada) {
  try {
    // ========== CONFIGURACIÓN INICIAL ==========
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const title = STYLES.FONTS.TITLE;
    const subtitle = STYLES.FONTS.SUBTITLE;
    const textPar = STYLES.FONTS.BODY;
    
    const leftMargin = STYLES.MARGINS.LEFT;
    const rightMargin = STYLES.MARGINS.RIGHT;
    const topMargin = STYLES.MARGINS.TOP;
    const bottomMargin = STYLES.MARGINS.BOTTOM;
    const maxWidth = pageWidth - leftMargin - rightMargin;
    
    let yPosition = topMargin + 7;
    let fondoBase64 = null;

    // ========== FUNCIONES DE PÁGINA ==========
    const addNewPage = () => {
      doc.addPage();
      yPosition = topMargin;
      if (fondoBase64) {
        doc.addImage(fondoBase64, "PNG", 5, 0, pageWidth, pageHeight);
      }
      // Agregar encabezado en cada página
      addHeader();
    };

    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - bottomMargin) {
        addNewPage();
        return true;
      }
      return false;
    };

    // ========== FUNCIONES DE DISEÑO ==========
    const addHeader = () => {
      const headerY = topMargin;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(title);
      doc.setTextColor(...STYLES.COLORS.PRIMARY);
      doc.text("Comité de Operaciones Emergentes", pageWidth / 2, headerY, {
        align: "center",
      });
      
      doc.setFontSize(subtitle);
      doc.text("Plan de Accion Cantonal Loja-Loja", pageWidth / 2, headerY + 10, {
        align: "center",
      });
      
      yPosition = headerY + 14;
      
      // Fecha de generación
      const fechaDescarga = new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      
      doc.setFontSize(STYLES.FONTS.SMALL);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...STYLES.COLORS.TEXT_LIGHT);
      doc.text(`Generado: ${fechaDescarga}`, pageWidth - rightMargin, headerY + 2, {
        align: "right",
      });
      
      divisoriaLine();
    };

    const divisoriaLine = () => {
      doc.setDrawColor(...STYLES.COLORS.DIVIDER);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
      yPosition += STYLES.LINE_HEIGHT;
    };

    const subDivisoriaLine = () => {
      doc.setDrawColor(...STYLES.COLORS.PRIMARY);
      doc.setLineWidth(0.8);
      doc.line(leftMargin, yPosition, pageWidth - rightMargin - 30, yPosition);
      yPosition += STYLES.LINE_HEIGHT;
    };

    const addSectionTitle = (text) => {
      checkPageBreak(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(subtitle);
      doc.setTextColor(...STYLES.COLORS.PRIMARY);
      doc.text(text, leftMargin, yPosition);
      yPosition += STYLES.LINE_HEIGHT;
      subDivisoriaLine();
    };

    const someText = (text, max, maxOne, left) => {
      doc.setFontSize(textPar);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...STYLES.COLORS.TEXT);

      const maxTextWidth = maxWidth - maxOne;
      const linesaccion = doc.splitTextToSize(
        String(text || "No existe informacion disponible"),
        maxTextWidth
      );

      linesaccion.forEach((line) => {
        if (yPosition + 5 > pageHeight - bottomMargin) {
          addNewPage();
          yPosition = topMargin;
        }
        doc.text(line, leftMargin + left, yPosition, {
          align: "justify",
          maxWidth: maxTextWidth,
        });
        yPosition += 4;
      });
    };

    const addField = (label, value, indent = 0) => {
      if (!value && value !== 0) return;
      
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(textPar);
      doc.setTextColor(...STYLES.COLORS.TEXT);
      doc.text(`${label}:`, leftMargin + indent, yPosition);
      
      const labelWidth = doc.getTextWidth(`${label}:`);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...STYLES.COLORS.TEXT_LIGHT);
      const textWidth = maxWidth - indent - labelWidth - 5;
      const lines = doc.splitTextToSize(String(value || "No disponible"), textWidth);
      doc.text(lines, leftMargin + indent + labelWidth + 5, yPosition);
      
      yPosition += (lines.length * 4) + 2;
    };

    const addStatusBadge = (estado) => {
      const estadoLower = estado?.toLowerCase() || "pendiente";
      
      let color;
      let label = estadoLower;
      
      if (estadoLower === "completado" || estadoLower === "finalizada") {
        color = STYLES.COLORS.SUCCESS;
        label = "FINALIZADA";
      } else if (estadoLower === "en ejecucion" || estadoLower === "en ejecución") {
        color = STYLES.COLORS.WARNING;
        label = "EN EJECUCION";
      } else if (estadoLower === "programado" || estadoLower === "programada") {
        color = [33, 150, 243];
        label = "PROGRAMADA";
      } else {
        color = STYLES.COLORS.DANGER;
        label = "PENDIENTE";
      }
      
      const badgeWidth = doc.getTextWidth(label) + 10;
      const x = pageWidth - rightMargin - badgeWidth;
      const y = yPosition - 3;
      
      doc.setFillColor(...color);
      doc.roundedRect(x, y, badgeWidth, 7, 2, 2, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(STYLES.FONTS.CAPTION);
      doc.setTextColor(...STYLES.COLORS.WHITE);
      doc.text(label, x + 5, y + 5);
      doc.setTextColor(...STYLES.COLORS.TEXT);
    };

    const formatDate = (dateString) => {
      if (!dateString) return "No disponible";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    // ========== CARGA DE IMÁGENES ==========
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

    // ========== GENERACIÓN DEL PDF ==========
    const Fondo1 = "https://i.imgur.com/bAcgjxK.png";
    fondoBase64 = await getImageFondo(Fondo1);
    
    if (fondoBase64) {
      doc.addImage(fondoBase64, "PNG", 5, 0, pageWidth, pageHeight);
    }

    // Encabezado principal
    addHeader();

    // ========== SECCIÓN: RESUMEN ==========
    addSectionTitle(`Resumen de Acciones - ${titulo}`);

    // Tarjetas de estadísticas
    const cardWidth = (maxWidth - 20) / 3;
    const cardHeight = STYLES.CARD_HEIGHT;
    const stats = [
      { label: "Total", value: accions.length, color: STYLES.COLORS.PRIMARY },
      { label: "Vigentes", value: vigente || 0, color: STYLES.COLORS.SUCCESS },
      { label: "Finalizadas", value: finalizada || 0, color: STYLES.COLORS.DANGER },
    ];

    stats.forEach((stat, index) => {
      const x = leftMargin + (index * (cardWidth + 10));
      const y = yPosition;
      
      // Fondo de tarjeta
      doc.setFillColor(...stat.color);
      doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
      
      // Texto
      doc.setFont("helvetica", "bold");
      doc.setFontSize(STYLES.FONTS.HEADING);
      doc.setTextColor(...STYLES.COLORS.WHITE);
      doc.text(String(stat.value), x + cardWidth / 2, y + cardHeight / 2 - 3, { align: "center" });
      
      doc.setFontSize(STYLES.FONTS.SMALL);
      doc.text(stat.label, x + cardWidth / 2, y + cardHeight / 2 + 3, { align: "center" });
    });

    yPosition += cardHeight + 10;

    // ========== SECCIÓN: DETALLE DE ACCIONES ==========
    addSectionTitle("Detalle de Acciones");

    for (let index = 0; index < accions.length; index++) {
      const accItem = accions[index];
      const byData = parseByField(accItem.by || {});
      const coord = coordForm(accItem.ubi);

      checkPageBreak(bottomMargin + 25);
      
      // Título de la acción
      subDivisoriaLine();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(subtitle);
      doc.setTextColor(...STYLES.COLORS.PRIMARY);
      doc.text(
        `${index + 1}. ${accItem.accion || "Accion pendiente"}`,
        leftMargin,
        yPosition
      );
      
      // Badge de estado
      addStatusBadge(accItem.estado);
      yPosition += STYLES.LINE_HEIGHT + 2;

      // Información principal en columnas
      doc.setFontSize(textPar);
      
      // Columna izquierda
      const colWidth = (maxWidth-20) / 2;
      const startY = yPosition;
      const itemsLeft = [
        { label: "Fecha de Registro", value: formatDate(accItem?.date) },
        { label: "Fecha de Actualizacion", value: formatDate(accItem?.dateUpdate) },
        { label: "Reportado por", value: `${byData?.miembro || "Sin nombre"} - ${byData?.cargo || "Sin cargo"}` },
        { label: "Responsable", value: accItem.responsable || "Sin Responsable" },
      ];

      itemsLeft.forEach((item, i) => {
        const y = startY + (i * STYLES.LINE_HEIGHT * 2);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...STYLES.COLORS.TEXT);
        doc.text(`${item.label}:`, leftMargin, y);
        
        const labelWidth = doc.getTextWidth(`${item.label}:`);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...STYLES.COLORS.TEXT_LIGHT);
        const lines = doc.splitTextToSize(item.value, colWidth - labelWidth - 10);
        doc.text(lines, leftMargin + labelWidth + 5, y);
      });

      // Columna derecha
      const itemsRight = [
        { label: "Instituciones de Apoyo", value: accItem.inst || "Sin Responsable" },
        { label: "Presupuesto", value: accItem.cash ? `$${accItem.cash}` : "Sin Responsable" },
        { label: "Ubicacion", value: coord ? `${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}` : "No disponible" },
      ];

      itemsRight.forEach((item, i) => {
        const y = startY + (i * STYLES.LINE_HEIGHT * 2);
        const x = leftMargin + colWidth + 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...STYLES.COLORS.TEXT);
        doc.text(`${item.label}:`, x, y);
        
        const labelWidth = doc.getTextWidth(`${item.label}:`);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...STYLES.COLORS.TEXT_LIGHT);
        const lines = doc.splitTextToSize(item.value, colWidth - labelWidth - 15);
        doc.text(lines, x + labelWidth + 5, y);
      });

      yPosition = startY + (Math.max(itemsLeft.length, itemsRight.length) * STYLES.LINE_HEIGHT * 2) + 3;

      // Descripción
      if (accItem?.desc) {
        someText(`Descripcion: ${accItem.desc}`, 0, 0, 0);
      }

      // Detalle
      if (accItem?.detail) {
        someText(`Detalle: ${accItem.detail}`, 0, 0, 0);
      }

      // Indicador
      if (accItem?.indicador) {
        addField("Indicador", accItem.indicador);
      }

      // Verificación
      if (accItem.verifi === "si") {
        checkPageBreak(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(textPar);
        doc.setTextColor(...STYLES.COLORS.SUCCESS);
        doc.text("Verificacion:", leftMargin, yPosition);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...STYLES.COLORS.TEXT_LIGHT);
        doc.text(`${accItem.verificableUrl}`, leftMargin + 28, yPosition);
        yPosition += STYLES.LINE_HEIGHT;
      }

      yPosition += 3;
    }

    // ========== SECCIÓN: FIRMAS ==========
    checkPageBreak(60);
    divisoriaLine();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(subtitle);
    doc.setTextColor(...STYLES.COLORS.PRIMARY);
    doc.text("FIRMAS DE RESPONSABLES", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 12;

    // Obtener datos de firma
    let parsedMember = null;
    let parsedApoyo = null;
    let findLider = null;

    try {
      const storedMember = localStorage.getItem("memberD");
      if (storedMember) {
        parsedMember = JSON.parse(storedMember);
      }
      const storedApoyo = localStorage.getItem("apoyoD");
      if (storedApoyo) {
        parsedApoyo = JSON.parse(storedApoyo);
        findLider = parsedApoyo.find((item) => item.cargo_COE === "Lider");
      }
    } catch (e) {
      console.warn("Error cargando datos de firma:", e);
    }

    const boxWidth = (pageWidth - leftMargin - rightMargin - 20) / 2;
    const boxHeight = 55;

    const signatureFields = [
      {
        title: parsedMember?.cargo_COE || "Coordinador",
        name: parsedMember?.miembro || "Sin asignar",
        id: parsedMember?.ci || "Sin cedula",
        role: `${parsedMember?.cargo || "Cargo"} - ${parsedMember?.inst || "Institucion"}`,
      },
      {
        title: findLider?.cargo_COE || "Lider",
        name: findLider?.miembro || "Sin asignar",
        id: findLider?.ci || "Sin cedula",
        role: `${findLider?.cargo || "Cargo"} - ${findLider?.inst || "Institucion"}`,
      },
    ];

    signatureFields.forEach((field, index) => {
      const x = leftMargin + (index * (boxWidth + 15));
      const y = yPosition;

      // Recuadro de firma
      doc.setDrawColor(...STYLES.COLORS.DIVIDER);
      doc.setLineWidth(0.3);
      doc.rect(x, y, boxWidth, boxHeight);

      // Información
      doc.setFont("helvetica", "bold");
      doc.setFontSize(STYLES.FONTS.SMALL);
      doc.setTextColor(...STYLES.COLORS.PRIMARY);
      doc.text(field.title, x + STYLES.BOX_PADDING, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(STYLES.FONTS.BODY);
      doc.setTextColor(...STYLES.COLORS.TEXT);
      doc.text(field.name, x + STYLES.BOX_PADDING, y + 17);
      doc.text(`Cedula: ${field.id}`, x + STYLES.BOX_PADDING, y + 25);

      doc.setFontSize(STYLES.FONTS.SMALL);
      doc.setTextColor(...STYLES.COLORS.TEXT_LIGHT);
      doc.text(field.role, x + STYLES.BOX_PADDING, y + 34, { maxWidth: boxWidth - 15 });

      // Línea de firma
      doc.setDrawColor(...STYLES.COLORS.TEXT);
      doc.setLineWidth(0.5);
      doc.line(x + 10, y + boxHeight - 12, x + boxWidth - 10, y + boxHeight - 12);
      
      doc.setFontSize(STYLES.FONTS.CAPTION);
      doc.setTextColor(...STYLES.COLORS.TEXT_LIGHT);
      doc.text("Firma", x + boxWidth / 2, y + boxHeight - 4, { align: "center" });
    });

    yPosition += boxHeight + 15;

    // ========== PIE DE PÁGINA ==========
    doc.setFontSize(STYLES.FONTS.SMALL);
    doc.setTextColor(...STYLES.COLORS.TEXT_LIGHT);
    doc.text(
      "Reporte generado automaticamente",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    // ========== GUARDAR PDF ==========
    const fechaDescarga = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.save(
      `reporte_${titulo.replace(/[^a-z0-9]/gi, "_")}_${fechaDescarga.replace(
        /[/,: ]/g,
        "-",
      )}.pdf`
    );

  } catch (e) {
    console.error("Error al generar PDF:", e);
    alert("Ocurrio un error al generar el reporte");
  }
}