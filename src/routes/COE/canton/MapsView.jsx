import { MapContainer, TileLayer } from "react-leaflet";
import { AfectacionesView } from "./popups/afectaciones";
import { useEffect, useState } from "react";
import { AccionesView } from "./popups/acciones";
import { RecursosView } from "./popups/recursos";

function MapMark({ position, zoom, dataAF, mtt, dataAC, dataRE, ...props }) {
  // Estado para almacenar los marcadores procesados
  const [afectaciones, setAfect] = useState([]);
  const [acciones, setAcc] = useState([]);
  const [recursos, setRec] = useState([]);
  console.log(recursos);
  // Efecto para procesar dataAF y convertir ubi de string a array
  useEffect(() => {
    if (dataAF && Array.isArray(dataAF) && dataAF.length > 0) {
      const processedMarkers = dataAF
        .map((item, index) => {
          if (!item.ubi) return null;

          try {
            // Convertir la cadena "[lat, lng]" a array de números
            let coordinates;

            if (typeof item.ubi === "string") {
              // Remover corchetes y espacios, luego dividir por coma
              const cleanStr = item.ubi.replace(/[\[\]\s]/g, "");
              const parts = cleanStr.split(",");

              if (parts.length >= 2) {
                coordinates = [parseFloat(parts[0]), parseFloat(parts[1])];

                // Validar que sean números válidos
                if (!isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
                  return {
                    id: index,
                    position: coordinates,
                    data: item,
                  };
                }
              }
            } else if (Array.isArray(item.ubi)) {
              // Si ya es un array, usarlo directamente
              coordinates = item.ubi;
              return {
                id: index,
                position: coordinates,
                data: item,
              };
            }
          } catch (error) {
            console.error(`Error procesando ubi del item ${index}:`, error);
          }

          return null;
        })
        .filter((marker) => marker !== null);
      setAfect(processedMarkers);
    } else {
      setAfect([]);
    }
  }, [dataAF]);
  useEffect(() => {
    if (dataAC && Array.isArray(dataAC) && dataAC.length > 0) {
      const processedMarkers = dataAC
        .map((item, index) => {
          if (!item.ubi) return null;

          try {
            // Convertir la cadena "[lat, lng]" a array de números
            let coordinates;

            if (typeof item.ubi === "string") {
              // Remover corchetes y espacios, luego dividir por coma
              const cleanStr = item.ubi.replace(/[\[\]\s]/g, "");
              const parts = cleanStr.split(",");

              if (parts.length >= 2) {
                coordinates = [parseFloat(parts[0]), parseFloat(parts[1])];

                // Validar que sean números válidos
                if (!isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
                  return {
                    id: index,
                    position: coordinates,
                    data: item,
                  };
                }
              }
            } else if (Array.isArray(item.ubi)) {
              // Si ya es un array, usarlo directamente
              coordinates = item.ubi;
              return {
                id: index,
                position: coordinates,
                data: item,
              };
            }
          } catch (error) {
            console.error(`Error procesando ubi del item ${index}:`, error);
          }

          return null;
        })
        .filter((marker) => marker !== null);
      setAcc(processedMarkers);
    } else {
      setAcc([]);
    }
  }, [dataAC]);
  useEffect(() => {
    if (dataRE && Array.isArray(dataRE) && dataRE.length > 0) {
        console.log(dataRE)
      const processedMarkers = dataRE
        .map((item, index) => {
          if (!item.ubi) return null;
          try {
            // Convertir la cadena "[lat, lng]" a array de números
            let coordinates;
            if (typeof item.ubi === "string") {
              // Remover corchetes y espacios, luego dividir por coma
              const cleanStr = item.ubi.replace(/[\[\]\s]/g, "");
              const parts = cleanStr.split(",");
              if (parts.length >= 2) {
                coordinates = [parseFloat(parts[0]), parseFloat(parts[1])];
                // Validar que sean números válidos
                if (!isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
                  return {
                    id: index,
                    position: coordinates,
                    data: item,
                  };
                }
              }
            } else if (Array.isArray(item.ubi)) {
              // Si ya es un array, usarlo directamente
              coordinates = item.ubi;
              return {
                id: index,
                position: coordinates,
                data: item,
              };
            }
          } catch (error) {
            console.error(`Error procesando ubi del item ${index}:`, error);
          }

          return null;
        })
        .filter((marker) => marker !== null);
      setRec(processedMarkers);
    } else {
      setRec([]);
    }
  }, [dataRE]);
  // Función para parsear el campo 'by' que también es string
  const parseByField = (byString) => {
    try {
      if (typeof byString === "string") {
        // Reemplazar comillas simples por dobles y nombres sin comillas
        const fixedString = byString
          .replace(/(\w+):/g, '"$1":') // Agregar comillas a las keys
          .replace(/:\s*(\w+)(,|})/g, ': "$1"$2') // Agregar comillas a valores simples
          .replace(/:(\d+)(,|})/g, ": $1$2") // No agregar comillas a números
          .replace(/'/g, '"'); // Reemplazar comillas simples

        return JSON.parse(fixedString);
      }
      return byString;
    } catch (error) {
      //console.error("Error parseando campo 'by':", error);
      return { error: "No se pudo parsear la información" };
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";

    try {
      // Separar fecha y hora
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/");

      // Crear fecha manualmente
      const date = new Date(year, month - 1, day);

      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "90vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Mostrar todos los marcadores procesados */}
      {props.loading.loadingAF == false && props.selectCapa.afectaciones && (
        <AfectacionesView
          afect={afectaciones}
          parseByField={parseByField}
          formatDate={formatDate}
          mtt={mtt}
        />
      )}
      {props.loading.loadingAC == false && props.selectCapa.acciones && (
        <AccionesView
          acciones={acciones}
          parseByField={parseByField}
          formatDate={formatDate}
        />
      )}
      {props.loading.loadingRE == false &&
        props.selectCapa.recursos &&
        recursos && (            
          <RecursosView
            recursos={recursos}
            parseByField={parseByField}
            formatDate={formatDate}
          />         
        )}
      {/* Otras capas personalizadas */}
      {props.children}
    </MapContainer>
  );
}
export default MapMark;
