export const parseByField = (byString) => {
    if (typeof byString !== "string") return byString;
    try {
      const fixedString = byString
        .replace(/(\w+):/g, '"$1":')
        .replace(/:\s*(\w+)(,|})/g, ': "$1"$2')
        .replace(/'/g, '"');
      return JSON.parse(fixedString);
    } catch {
      return { error: "Info no disponible" };
    }
  };