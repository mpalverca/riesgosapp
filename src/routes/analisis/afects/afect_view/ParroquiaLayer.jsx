// src/components/maps/components/ParroquiaLayer.jsx
import React, { useMemo } from "react";
import { Polygon, Popup } from "react-leaflet";
import PropTypes from "prop-types";

const PARROQUIA_COLOR = {
  color: "#050505",
  fillColor: "#b6b1b1",
  fillOpacity: 0.2,
};

const ParroquiaLayer = ({ parroquia = [] }) => {
  const renderParroquiaPolygons = useMemo(() => {
    return parroquia
      .flatMap((item, index) => {
        if (!item?.geom || item.geom.type !== "MultiPolygon") return null;

        return item.geom.coordinates.map((poly, polyIdx) => {
          const polyCoords = poly[0].map((coord) => [coord[1], coord[0]]);

          return (
            <Polygon
              key={`parroquia-${item.id || index}-${polyIdx}`}
              positions={polyCoords}
              pathOptions={{
                color: PARROQUIA_COLOR.color,
                fillColor: PARROQUIA_COLOR.fillColor,
                fillOpacity: PARROQUIA_COLOR.fillOpacity,
                weight: 2,
              }}
            >
              <Popup>
                <strong>Parroquia:</strong> {item.DPA_DESPAR || "Sin nombre"}
              </Popup>
            </Polygon>
          );
        });
      })
      .filter(Boolean);
  }, [parroquia]);

  return <>{renderParroquiaPolygons}</>;
};

ParroquiaLayer.propTypes = {
  parroquia: PropTypes.array,
};

export default React.memo(ParroquiaLayer);