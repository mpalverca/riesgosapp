export const parseByField = (byString) => {
  if (typeof byString !== "string") return byString;
  
  try {
    // Remover las llaves {} y espacios
    const cleanString = byString.replace(/[{}]/g, '').trim();
    
    // Separar por comas y crear objeto
    const obj = {};
    cleanString.split(',').forEach(pair => {
      const [key, ...valueParts] = pair.trim().split('=');
      let value = valueParts.join('=').trim();
      
      // Limpiar valores que pueden tener comillas
      value = value.replace(/^["']|["']$/g, '');
      
      // Convertir números si es posible
      if (!isNaN(value) && value !== '') {
        obj[key] = Number(value);
      } else {
        obj[key] = value;
      }
    });
    
    return obj;
  } catch (error) {
    console.error("Error parsing by field:", error);
    return { error: "Info no disponible" };
  }
};