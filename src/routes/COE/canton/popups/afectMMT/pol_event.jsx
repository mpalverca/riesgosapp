import React, { useMemo, useState } from "react";
import { GeoJSON, Popup } from "react-leaflet";
import { Box, Button, Divider, Typography, Modal, IconButton } from "@mui/material";
import { generarPDFEvent } from "../../pdf/script_pdf_event";
import { coordForm } from "../../../../utils/Coords";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

export const PolEventView = ({ polygon, formatDate, mtt, files, ...props }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  const getStyle = (alerta) => {
    const colors = {
      roja: "#e6101b",
      naranja: "#ff8c00",
      amarilla: "#ffff00",
      verde: "#228b22",
    };

    return {
      fillColor: colors[alerta?.toLowerCase()] || "#3519d2",
      weight: 3,
      opacity: 2,
      color: "white",
      dashArray: "5",
      fillOpacity: 0.5,
    };
  };

  const getFilteredData = useMemo(() => {
    if (!polygon || !Array.isArray(polygon))
      return {
        afectMap: new Map(),
        accMap: new Map(),
      };
    const afectMap = new Map();
    const accMap = new Map();

    polygon.forEach((item) => {
      const rowID = item.row;
      const afectFiltered =
        props.afect?.filter(
          (afect) => Number(afect?.data.row_event) === rowID,
        ) || [];

      const accFiltered =
        props.acciones?.filter(
          (accion) => Number(accion?.data.row_event) === rowID,
        ) || [];
      afectMap.set(rowID, afectFiltered);
      accMap.set(rowID, accFiltered);
    });

    return { afectMap, accMap };
  }, [polygon, props.afect, props.acciones]);

  const handleImageClick = (images, index) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setSelectedImage(images[index]);
    setOpenModal(true);
  };

  const handleNextImage = () => {
    const newIndex = (currentImageIndex + 1) % currentImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentImages[newIndex]);
  };

  const handlePrevImage = () => {
    const newIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentImages[newIndex]);
  };

  // Componente de Carrusel para las miniaturas
  const ImageCarousel = ({ images, onImageClick }) => {
    const [startIndex, setStartIndex] = useState(0);
    const visibleThumbnails = 5; // Número de miniaturas visibles

    const nextThumbnails = () => {
      if (startIndex + visibleThumbnails < images.length) {
        setStartIndex(startIndex + 1);
      }
    };

    const prevThumbnails = () => {
      if (startIndex > 0) {
        setStartIndex(startIndex - 1);
      }
    };

    return (
      <div style={{ marginTop: "15px" }}>
        <Typography
          align="justify"
          variant="subtitle2"
          style={{
            fontSize: "0.85rem",
            fontStyle: "italic",
            margin: "0 0 10px 0",
          }}
          sx={{ mb: 1, pb: 1 }}
        >
          <strong>Anexo Fotográfico</strong>
        </Typography>

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "5px" }}>
          {/* Botón anterior del carrusel */}
          {images.length > visibleThumbnails && startIndex > 0 && (
            <IconButton
              onClick={prevThumbnails}
              size="small"
              sx={{
                position: "absolute",
                left: -30,
                zIndex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" }
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          )}

          {/* Miniaturas */}
          <div
            style={{
              display: "flex",
              overflowX: "hidden",
              gap: "10px",
              flex: 1,
              justifyContent: "center"
            }}
          >
            {images.slice(startIndex, startIndex + visibleThumbnails).map((img, idx) => {
              const actualIndex = startIndex + idx;
              return (
                <img
                  key={actualIndex}
                  src={img}
                  alt={`Miniatura ${actualIndex + 1}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: currentImageIndex === actualIndex ? "3px solid #e6101b" : "1px solid #ddd",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={() => onImageClick(images, actualIndex)}
                />
              );
            })}
          </div>

          {/* Botón siguiente del carrusel */}
          {images.length > visibleThumbnails && startIndex + visibleThumbnails < images.length && (
            <IconButton
              onClick={nextThumbnails}
              size="small"
              sx={{
                position: "absolute",
                right: -30,
                zIndex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" }
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {polygon &&
        Array.isArray(polygon) &&
        polygon.map((item, index) => {
          const imageUrls = item.img
            ? Array.isArray(item.img)
              ? item.img
              : item.img
                  .split(",")
                  .map((img) => img.trim())
                  .filter((img) => img)
            : [];
          
          let geoJsonData = null;
          const afectFilter = getFilteredData.afectMap.get(item.row) || [];
          const accFilter = getFilteredData.accMap.get(item.row) || [];
          let coords = coordForm(item.ubi);

          try {
            if (typeof item.Poligono === "string") {
              geoJsonData = JSON.parse(item.Poligono);
            } else {
              geoJsonData = item.Poligono;
            }
          } catch (error) {
            console.error("Error parseando GeoJSON:", error);
            return null;
          }

          if (!geoJsonData) return null;
          if (item.estado === "Finalizado") return null;
          
          return (
            <GeoJSON
              key={`poly-${item.id || index}`}
              data={geoJsonData}
              style={() => getStyle(item.alerta)}
            >
              <Popup options={{ maxWidth: 500, minWidth: 250 }} maxWidth={500}>
                <Box
                  style={{ minWidth: "200px" }}
                  sx={{ height: "60vh", overflowY: "auto", maxWidth: "450px" }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      color: "#e6101b",
                      textTransform: "uppercase",
                      fontSize: "1.1rem",
                    }}
                  >
                    {item.event || "Evento"} - {item.row}
                  </h3>
                  <Typography
                    variant="body2"
                    sx={{ color: "#3519d2", fontWeight: "bold" }}
                  >
                    Estado: {item.estado} | Alerta: {item.alerta}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography style={{ margin: "4px 0" }}>
                    <strong>Sector:</strong> {item.sector}
                  </Typography>
                  <Typography style={{ margin: "4px 0" }}>
                    <strong>Fecha de registro:</strong>{" "}
                    {formatDate(item.date_event)}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography
                    align="justify"
                    style={{
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                      margin: 0,
                    }}
                  >
                    <strong>Descripción:</strong> {item.desc_plan}
                  </Typography>

                  {/* Carrusel de imágenes */}
                  {imageUrls.length > 0 && (
                    <ImageCarousel 
                      images={imageUrls} 
                      onImageClick={handleImageClick}
                    />
                  )}
                </Box>

                <Box sx={{ pt: 2, display: "flex", gap: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      props.setOpenDialog(true);
                    }}
                  >
                    Registro
                  </Button>
                  <Button
                    fullWidth
                    disabled={!afectFilter.length && !accFilter.length}
                    variant="outlined"
                    color="warning"
                    onClick={() =>
                      generarPDFEvent(
                        "evento",
                        afectFilter,
                        accFilter,
                        props.recursos,
                        geoJsonData.features[0].geometry.coordinates[0],
                        coords,
                        item,
                        mtt,
                        files,
                      )
                    }
                  >
                    PDF
                  </Button>
                </Box>
              </Popup>
            </GeoJSON>
          );
        })}

      {/* Modal para ver imagen en tamaño completo */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            boxShadow: 24,
            p: 4,
            width: '90vw',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none'
          }}
        >
          {/* Botón cerrar */}
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Botón anterior */}
          {currentImages.length > 1 && (
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                zIndex: 1
              }}
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>
          )}

          {/* Imagen principal */}
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Vista ampliada"
              style={{
                maxWidth: '100%',
                maxHeight: '85%',
                objectFit: 'contain'
              }}
            />
          )}

          {/* Botón siguiente */}
          {currentImages.length > 1 && (
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                zIndex: 1
              }}
            >
              <ArrowForwardIosIcon fontSize="large" />
            </IconButton>
          )}

          {/* Contador de imágenes */}
          {currentImages.length > 1 && (
            <Typography
              sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '4px 12px',
                borderRadius: '20px'
              }}
            >
              {currentImageIndex + 1} / {currentImages.length}
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};