import React from "react" 
import { MapContainer, TileLayer, Polygon, Polyline,Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PoligonMap = ({ geoData, sector, predio, clave }) => {
  if (!geoData || !geoData.features || geoData.features.length === 0) {
    return <div>No hay datos geoespaciales para mostrar</div>;
  }
  /* console.log(geoData);
  // Estilo para las geometrías
  const geoJsonStyle = {
    color: "#f80707ff",
    weight: 2,
    opacity: 0.7,
    fillOpacity: 0.1,
  }; */
  // Calcular centro del mapa basado en los datos
  
  const calculateCenter = () => {
    return [-3.99313, -79.20422];
  };
  const renderPolygons = () => {
    return geoData.features.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;
        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);

          return (
            <Polygon
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color:
                  item.properties.aptitud === "APTO"
                    ? "#00ff15ff"
                    : item.properties.aptitud ===
                      "APTO CON MEDIANAS LIMITACIONES"
                    ? "#0000ff"
                    : item.properties.aptitud ===
                      "APTO CON EXTREMAS LIMITACIONES"
                    ? "#fde407ff"
                    : item.properties.aptitud === "NO APTO"
                    ? "#ff0000ff"
                    : "#ff0000ff",
                fillColor:
                  item.properties.aptitud === "APTO"
                    ? "#48ff00ff"
                    : item.properties.aptitud ===
                      "APTO CON MEDIANAS LIMITACIONES"
                    ? "#0000ff"
                    : item.properties.aptitud ===
                      "APTO CON EXTREMAS LIMITACIONES"
                    ? "#f9fd07ff"
                    : item.properties.aptitud === "NO APTO"
                    ? "#ff0000ff"
                    : "#ff0000ff",
                fillOpacity: 0.2,
                weight: 2,
              }}
            >
              <Popup>
                <strong>Objeto:</strong> {item.properties.objectid}
                <br />
                <strong>Aptitud:</strong> {item.properties.aptitud}
                <br />
                <strong>Amenaza:</strong> {item.properties.amenazas}
                <br />
                <strong>Estudios:</strong> {item.properties.estudios}
                <br />
                <strong>Observaciones:</strong> {item.properties.observac_1},{" "}
                {item.properties.observac_2}
                <br />
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  const renderSector = () => {
    return sector.features.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;

        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);

          return (
            <Polygon
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color: "#030303ff",
                fillColor: "#c5c1c1ff",
                fillOpacity: 0.2,
                weight: 8,
              }}
            >
              <Popup>
                <strong>Sector:</strong> {item.properties.SECTOR}
                <br />
                <strong>Presidente:</strong> {item.properties.PRESIDENTE}
                <br />
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  const renderPredio = () => {
    return predio.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;
        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);
          return item.properties.clave_cata === clave ? (
            <Polygon
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color: "#f70303ff",
                fillColor: "#1b1a1aff",
                fillOpacity: 0.2,
                weight: 8,
              }}
            >
              <Popup>
                <strong>Clave_catastral:</strong> {item.properties.clave_cata}
                <br />
                <strong>Posee Edificación:</strong>{" "}
                {item.properties.edif === 1 ? "SI" : "NO"}
                <br />
                <strong>Area de edificacion:</strong>{" "}
                {item.properties.area_construccion}
                <br />
                <strong>Permiso de construcción:</strong>{" "}
                {item.properties.permiso_numero}-{" "}
                {item.properties.fecha_permiso}
                <br />
                <br />
                <strong>Detalle de intervención:</strong>{" "}
                {item.properties.detalle_intervencion_pisos}
              </Popup>
            </Polygon>
          ) : (
            <Polygon
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color: "#131212ff",
                fillColor: "#1b1a1aff",
                fillOpacity: 0.2,
                weight: 2,
              }}
            >
              <Popup>
                <strong>Clave_catastral:</strong> {item.properties.clave_cata}
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  return (
    <div className="geo-map">
      <MapContainer
        center={calculateCenter()}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {renderPolygons()}
        {renderSector()}
        {renderPredio()}
        {/* <GeoJSON
          data={geoData}
          style={geoJsonStyle}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const popupContent = Object.entries(feature.properties)
                .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                .join('<br/>');
              layer.bindPopup(popupContent);
            }
          }}
        /> */}
      </MapContainer>
    </div>
  );
};

export const SectorMap = ({ sector, predio, clave }) => {
  if (!sector || !sector.features || sector.features.length === 0) {
    return <div>No hay datos geoespaciales para mostrar</div>;
  }

  const calculateCenter = () => {
    return [-3.99313, -79.20422];
  };

  const renderSector = () => {
    return sector.features.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;

        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);

          return (
            <Polygon
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color: "#030303ff",
                fillColor: "#c5c1c1ff",
                fillOpacity: 0.2,
                weight: 8,
              }}
            >
              <Popup>
                <strong>Sector:</strong> {item.properties.SECTOR}
                <br />
                <strong>Presidente:</strong> {item.properties.PRESIDENTE}
                <br />
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  const renderPredio = () => {
    return predio.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;
        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);
          return (
            <Polygon
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color:
                  item.properties.clave_cata === clave
                    ? "#f70303ff"
                    : "#131212ff",
                fillColor: "#1b1a1aff",
                fillOpacity: 0.2,
                weight: 8,
              }}
            >
              <Popup>
                <strong>Clave_catastral:</strong> {item.properties.clave_cata}
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  return (
    <div className="geo-map">
      <MapContainer
        center={calculateCenter()}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
 
        {renderSector()}
        {renderPredio()}
     
      </MapContainer>
    </div>
  );
};

export const PolylineMap = ({ geoData, sector, predio, clave }) => {
  if (!geoData || !geoData.features || geoData.features.length === 0) {
    return <div>No hay datos geoespaciales para mostrar</div>;
  }

  const calculateCenter = () => {
    return [-3.99313, -79.20422];
  };

  // Función para determinar el tipo de geometría y renderizar adecuadamente
  const renderGeometry = (item) => {
    const geometryType = item.geometry.type;
    
    switch (geometryType) {
      case 'LineString':
        return renderLineString(item);
      case 'MultiLineString':
        return renderMultiLineString(item);
      case 'Polygon':
        return renderPolygon(item);
      case 'MultiPolygon':
        return renderMultiPolygon(item);
      default:
        console.warn(`Tipo de geometría no soportado: ${geometryType}`);
        return null;
    }
  };

  const renderLineString = (item) => {
    try {
      const coordinates = item.geometry.coordinates;
      const lineCoords = coordinates.map(coord => [coord[1], coord[0]]);

      return (
        <Polyline
          key={`line-${item.id || item.properties.objectid_left}`}
          positions={lineCoords}
          pathOptions={{
            color: getLineColor(item.properties),
            weight: getLineWeight(item.properties),
            opacity: 0.8,
          }}
        >
          <Popup>
            <VialidadPopup properties={item.properties} />
          </Popup>
        </Polyline>
      );
    } catch (error) {
      console.error("Error al procesar LineString:", item, error);
      return null;
    }
  };

  const renderMultiLineString = (item) => {
    try {
      const coordinates = item.geometry.coordinates;
      return coordinates.map((line, index) => {
        const lineCoords = line.map(coord => [coord[1], coord[0]]);
        return (
          <Polyline
            key={`multiline-${item.id || item.properties.objectid_left}-${index}`}
            positions={lineCoords}
            pathOptions={{
              color: getLineColor(item.properties),
              weight: getLineWeight(item.properties),
              opacity: 0.8,
            }}
          >
            <Popup>
              <VialidadPopup properties={item.properties} />
            </Popup>
          </Polyline>
        );
      });
    } catch (error) {
      console.error("Error al procesar MultiLineString:", item, error);
      return null;
    }
  };

  const renderPolygon = (item) => {
    try {
      const coordinates = item.geometry.coordinates[0];
      const polyCoords = coordinates.map(coord => [coord[1], coord[0]]);

      return (
        <Polygon
          key={`polygon-${item.id}`}
          positions={polyCoords}
          pathOptions={{
            color: getPolygonColor(item.properties),
            fillColor: getPolygonFillColor(item.properties),
            fillOpacity: 0.2,
            weight: 2,
          }}
        >
          <Popup>
            <PolygonPopup properties={item.properties} type={geoData.metadata?.type} />
          </Popup>
        </Polygon>
      );
    } catch (error) {
      console.error("Error al procesar Polygon:", item, error);
      return null;
    }
  };

  const renderMultiPolygon = (item) => {
    try {
      const coordinates = item.geometry.coordinates;
      return coordinates.map((polygon, index) => {
        const polyCoords = polygon[0].map(coord => [coord[1], coord[0]]);
        return (
          <Polygon
            key={`multipolygon-${item.id}-${index}`}
            positions={polyCoords}
            pathOptions={{
              color: getPolygonColor(item.properties),
              fillColor: getPolygonFillColor(item.properties),
              fillOpacity: 0.2,
              weight: 2,
            }}
          >
            <Popup>
              <PolygonPopup properties={item.properties} type={geoData.metadata?.type} />
            </Popup>
          </Polygon>
        );
      });
    } catch (error) {
      console.error("Error al procesar MultiPolygon:", item, error);
      return null;
    }
  };

  // Funciones para estilos de líneas (vialidad)
  const getLineColor = (properties) => {
    switch (properties.estado) {
      case 'PLANIFICADA': return '#ff9900';
      case 'CONSTRUIDA': return '#00cc00';
      case 'EN CONSTRUCCIÓN': return '#0066ff';
      default: return '#666666';
    }
  };

  const getLineWeight = (properties) => {
    switch (properties.jerarquia) {
      case 'PRINCIPAL': return 6;
      case 'SECUNDARIA': return 4;
      case 'LOCAL': return 2;
      default: return 2;
    }
  };

  // Funciones para estilos de polígonos (aptconst, aass, etc.)
  const getPolygonColor = (properties) => {
    if (properties.aptitud) {
      switch (properties.aptitud) {
        case "APTO": return "#00ff15";
        case "APTO CON MEDIANAS LIMITACIONES": return "#0000ff";
        case "APTO CON EXTREMAS LIMITACIONES": return "#fde407";
        case "NO APTO": return "#ff0000";
        default: return "#ff0000";
      }
    }
    return "#030303";
  };

  const getPolygonFillColor = (properties) => {
    if (properties.aptitud) {
      switch (properties.aptitud) {
        case "APTO": return "#48ff00";
        case "APTO CON MEDIANAS LIMITACIONES": return "#0000ff";
        case "APTO CON EXTREMAS LIMITACIONES": return "#f9fd07";
        case "NO APTO": return "#ff0000";
        default: return "#ff0000";
      }
    }
    return "#c5c1c1";
  };

  // Componente Popup para vialidad
  const VialidadPopup = ({ properties }) => {
    return (
      <div>
        <strong>Vía:</strong> {properties.nombre || 'N/A'}<br />
        <strong>Tipo:</strong> {properties.tipo_eje || 'N/A'}<br />
        <strong>Jerarquía:</strong> {properties.jerarquia || 'N/A'}<br />
        <strong>Estado:</strong> {properties.estado || 'N/A'}<br />
        <strong>Rodadura:</strong> {properties.rodadura || 'N/A'}<br />
        <strong>Sector:</strong> {properties.sector || 'N/A'}<br />
        <strong>Barrio:</strong> {properties.barrio || 'N/A'}<br />
        <strong>Ancho total:</strong> {properties.dim_total || 'N/A'} m<br />
        <strong>Ancho vía:</strong> {properties.dim_via || 'N/A'} m<br />
        <strong>Ancho acera:</strong> {properties.dim_acera || 'N/A'} m<br />
        <strong>Proyecto:</strong> {properties.proyecto || 'N/A'}<br />
        <strong>Descripción:</strong> {properties.descripcio || 'N/A'}<br />
        {properties.contacto && <><strong>Contacto:</strong> {properties.contacto}<br /></>}
        {properties.presidente && <><strong>Presidente:</strong> {properties.presidente}<br /></>}
      </div>
    );
  };

  // Componente Popup para polígonos (aptconst, aass, etc.)
  const PolygonPopup = ({ properties, type }) => {
    return (
      <div>
        <strong>Objeto:</strong> {properties.objectid || 'N/A'}<br />
        {properties.aptitud && <><strong>Aptitud:</strong> {properties.aptitud}<br /></>}
        {properties.amenazas && <><strong>Amenaza:</strong> {properties.amenazas}<br /></>}
        {properties.estudios && <><strong>Estudios:</strong> {properties.estudios}<br /></>}
        {properties.observac_1 && <><strong>Observación 1:</strong> {properties.observac_1}<br /></>}
        {properties.observac_2 && <><strong>Observación 2:</strong> {properties.observac_2}<br /></>}
        {/* Agrega más propiedades específicas según el tipo de datos */}
      </div>
    );
  };

  const renderSector = () => {
    if (!sector || !sector.features) return null;
    
    return sector.features.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);
          return (
            <Polygon
              key={`sector-${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color: "#030303",
                fillColor: "#c5c1c1",
                fillOpacity: 0.2,
                weight: 8,
              }}
            >
              <Popup>
                <strong>Sector:</strong> {item.properties.SECTOR}<br />
                <strong>Presidente:</strong> {item.properties.PRESIDENTE}<br />
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar sector:", item, error);
        return null;
      }
    });
  };

  const renderPredio = () => {
    if (!predio || predio.length === 0) return null;
    
    return predio.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);
          const isSelected = item.properties.clave_cata === clave;
          
          return (
            <Polygon
              key={`predio-${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color: isSelected ? "#f70303" : "#131212",
                fillColor: "#1b1a1a",
                fillOpacity: 0.2,
                weight: isSelected ? 8 : 2,
              }}
            >
              <Popup>
                <strong>Clave catastral:</strong> {item.properties.clave_cata}<br />
                <strong>Posee Edificación:</strong> {item.properties.edif === 1 ? "SI" : "NO"}<br />
                {item.properties.area_construccion && <><strong>Área construcción:</strong> {item.properties.area_construccion}<br /></>}
                {item.properties.permiso_numero && <><strong>Permiso:</strong> {item.properties.permiso_numero}<br /></>}
                {item.properties.fecha_permiso && <><strong>Fecha permiso:</strong> {item.properties.fecha_permiso}<br /></>}
                {item.properties.detalle_intervencion_pisos && <><strong>Detalle intervención:</strong> {item.properties.detalle_intervencion_pisos}<br /></>}
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar predio:", item, error);
        return null;
      }
    });
  };

  return (
    <div className="geo-map">
      <MapContainer
        center={calculateCenter()}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Renderizar geometrías principales */}
        {geoData.features.map((item, index) => (
          <React.Fragment key={`feature-${index}`}>
            {renderGeometry(item)}
          </React.Fragment>
        ))}
        
        {/* Renderizar capas adicionales */}
        {/* {renderSector()}
        {renderPredio()} */}
      </MapContainer>
    </div>
  );
};

export default PoligonMap;
