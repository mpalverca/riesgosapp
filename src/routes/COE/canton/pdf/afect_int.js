import jsPDF from "jspdf";
import { parseByField } from "../../../utils/utils";

export function afectDoc(afect, index, leftMargin, yPosition, maxWidth) {
    const doc = new jsPDF();
    const byData = parseByField(afect.by);
    console.log(afect)
    console.log(byData)

    const dataResp=()=>{ 
        doc.setFont("helvetica", "normal");
      doc.text(`Afectación ${index+1} - ${byData?.name || "Sin nombre"} - ${byData?.cargo || "Sin cargo"}`, leftMargin, yPosition);
      yPosition += 5;
      const lines_situacion = doc.splitTextToSize(
        String(afect?.desc || "No existe descripción de situación actual"),
        maxWidth - 20,
      );
      // Calcular altura necesaria
      const situacionHeight = lines_situacion.length * 4;
      // Mostrar situación actual
      doc.text(lines_situacion, leftMargin + 5, yPosition, {
        align: "justify",
        maxWidth: maxWidth - 10,
      });
      // ACTUALIZAR yPosition DESPUÉS DEL TEXTO (¡esto es lo importante!)
      yPosition += situacionHeight + 5;}
      return dataResp
     
}