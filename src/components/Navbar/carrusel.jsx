// components/MUICarousel.jsx
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, IconButton, Container } from '@mui/material';
import { Circle, CircleOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Carousel = ({ 
  slides = [], 
  autoPlay = true, 
  interval = 5000,
  height = 600,
  showIndicators = true
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [currentSlide, autoPlay, interval, slides.length]);

  const handleButtonClick = (slide) => {
    if (slide.buttonAction) {
      slide.buttonAction();
    } else if (slide.buttonLink) {
      if (slide.buttonLink.startsWith('http') || slide.buttonLink.startsWith('www')) {
        window.open(slide.buttonLink, slide.buttonTarget || '_blank');
      } else {
        navigate(slide.buttonLink);
      }
    }
  };

  if (!slides.length) {
    return (
      <Box height={height} display="flex" alignItems="center" justifyContent="center" bgcolor="grey.100">
        <Typography variant="h6" color="text.secondary">No hay slides para mostrar</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ p: 0 }}>
      <Box sx={{ position: 'relative', width: '100%', height: height, overflow: 'hidden' }}>
        <Box sx={{ 
          display: 'flex', 
          height: '100%',
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: 'transform 0.5s ease-in-out'
        }}>
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                minWidth: '100%',
                height: '100%',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <Box
                component="img"
                src={slide.image}
                alt={slide.alt || `Slide ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: slide.imageFilter || 'brightness(0.8)',
                }}
              />
              
              <Card sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(214, 209, 201, 0.6)',
                padding: 2,
                width: '95%',
                maxWidth: '800px',
                textAlign: 'center',
                border: '1px solid rgba(214, 209, 201, 0.1)'
              }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {slide.title && (
                    <Typography variant="h4" fontWeight="bold" color="black" gutterBottom>
                      {slide.title}
                    </Typography>
                  )}
                  
                  {slide.description && (
                    <Typography variant="h6" color="text.secondary" paragraph>
                      {slide.description}
                    </Typography>
                  )}
                  
                  {slide.buttonText && (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleButtonClick(slide)}
                      sx={{
                        backgroundColor: "#e28b18ff",
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: "#d17a0fff",
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {slide.buttonText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {showIndicators && slides.length > 1 && (
          <Box sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            backgroundColor: 'rgba(240, 240, 240, 0.7)',
            borderRadius: 3,
            p: 1,
          }}>
            {slides.map((_, index) => (
              <IconButton
                key={index}
                onClick={() => goToSlide(index)}
                size="small"
                sx={{
                  color: index === currentSlide ? "#e28b18ff" : "#cfbb9fff",
                  p: 0.5,
                  '&:hover': { color: "#e28b18ff" },
                }}
              >
                {index === currentSlide ? <Circle fontSize="small" /> : <CircleOutlined fontSize="small" />}
              </IconButton>
            ))}
          </Box>
        )}

        {slides.length > 1 && (
          <Box sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 3,
            p: '8px 16px',
          }}>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              {currentSlide + 1} / {slides.length}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Carousel;