export const coordForm = (ubi) => {
    let coords = null;
  if (typeof ubi === "string") {
    const cleanStr = ubi.replace(/[\[\]\s]/g, "");
    const parts = cleanStr.split(",");
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) coords = [lat, lng];
    }
  } else if (Array.isArray(ubi)) {
    coords = ubi;
  }
  return coords;
};
