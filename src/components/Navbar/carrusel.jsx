// components/MUICarousel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  IconButton, 
  Container,
  Fade,
  Stack,
  Paper
} from '@mui/material';
import { 
  Circle, 
  CircleOutlined, 
  NavigateBefore, 
  NavigateNext,
  Pause,
  PlayArrow
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Carousel = ({ 
  slides = [], 
  autoPlay = true, 
  interval = 5000,
  height = 600,
  showIndicators = true,
  showNavigation = true,
  showCounter = true,
  pauseOnHover = true,
  animation = "slide" // slide, fade
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    // Reiniciar timer automático al cambiar manualmente
    if (autoPlay && isPlaying) {
      resetTimer();
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (autoPlay && isPlaying && !(pauseOnHover && isHovered)) {
      timerRef.current = setInterval(nextSlide, interval);
    }
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    
    if (isPlaying && !(pauseOnHover && isHovered)) {
      timerRef.current = setInterval(nextSlide, interval);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSlide, autoPlay, interval, slides.length, isPlaying, isHovered, pauseOnHover]);

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
      <Box 
        height={height} 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        bgcolor="action.hover"
        borderRadius={4}
      >
        <Typography variant="h6" color="text.secondary">
          📸 No hay imágenes para mostrar
        </Typography>
      </Box>
    );
  }

  return (
    
      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%', 
          height: height, 
          overflow: 'hidden',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      //  onMouseEnter={() => pauseOnHover && setIsHovered(true)}
       // onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      >
        {/* Slides Container */}
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        
              <Box
                key={currentSlide}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <SlideContent 
                  slide={slides[currentSlide]} 
                  handleButtonClick={handleButtonClick}
                />
              </Box>
            ) : (
              <Fade in timeout={500}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <SlideContent 
                    slide={slides[currentSlide]} 
                    handleButtonClick={handleButtonClick}
                  />
                </Box>
              </Fade>
            
         
        </Box>

        {/* Navigation Arrows */}
        {showNavigation && slides.length > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <NavigateBefore fontSize="large" />
            </IconButton>
            
            <IconButton
              onClick={nextSlide}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <NavigateNext fontSize="large" />
            </IconButton>
          </>
        )}

        {/* Play/Pause Button */}
        {autoPlay && slides.length > 1 && (
          <IconButton
            onClick={toggleAutoPlay}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
            }}
            size="small"
          >
            {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
          </IconButton>
        )}

        {/* Indicators */}
        {showIndicators && slides.length > 1 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: 2,
              p: 1,
              backdropFilter: 'blur(8px)',
            }}
          >
            {slides.map((_, index) => (
              <IconButton
                key={index}
                onClick={() => goToSlide(index)}
                size="small"
                sx={{
                  color: index === currentSlide ? "#e28b18ff" : "rgba(255,255,255,0.6)",
                  p: 0.5,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: "#e28b18ff",
                    transform: 'scale(1.2)',
                  },
                }}
              >
                {index === currentSlide ? (
                  <Circle fontSize="small" />
                ) : (
                  <CircleOutlined fontSize="small" />
                )}
              </IconButton>
            ))}
          </Stack>
        )}

        {/* Counter */}
        {showCounter && slides.length > 1 && (
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              zIndex: 2,
            }}
          >
            <Typography variant="body2" color="white" fontWeight="medium">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </Typography>
          </Paper>
        )}

        {/* Progress Bar */}
        {autoPlay && isPlaying && slides.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '4px',
              width: '100%',
              backgroundColor: 'rgba(226, 139, 24, 0.3)',
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: '0%',
               // backgroundColor: 'rgb(24, 37, 226)',
                animation: `progress ${interval / 1000}s linear forwards`,
                '@keyframes progress': {
                  '0%': { width: '0%' },
                  '100%': { width: '100%' }
                }
              }}
            />
          </Box>
        )}
      </Box>
   
  );
};

// Componente interno para el contenido del slide
const SlideContent = ({ slide, handleButtonClick }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box
        component="img"
        src={slide.image}
        alt={slide.alt || 'Slide image'}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: slide.imageFilter || 'brightness(0.65)',
        }}
      />
      
      <Card 
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        sx={{
          position: 'absolute',
          top: '20%',
          left: '12%',
          //transform: 'translate(-50%, -50%)',
          backgroundColor: isCardHovered 
            ? 'rgba(255, 255, 255, 0.3)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: { xs: 1.5, sm: 2, md: 2 },
          width: { xs: '90%', sm: '85%', md: '70%' },
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          transition: 'background-color 0.4s ease',
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {slide.title && (
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              color={isCardHovered ? "white" : "text.primary"}
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                textShadow: isCardHovered ? '2px 2px 4px rgba(0,0,0,0.5)' : '1px 1px 2px rgba(0,0,0,0.1)',
                transition: 'color 0.4s ease, textShadow 0.4s ease',
              }}
            >
              {slide.title}
            </Typography>
          )}
          
          {slide.description && (
            <Typography 
              variant="body1" 
              color={isCardHovered ? "white" : "text.secondary"}
              paragraph
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                maxWidth: '90%',
                mx: 'auto',
                transition: 'color 0.4s ease',
              }}
            >
              {slide.description}
            </Typography>
          )}
          
          {slide.buttonText && (
            <Button
              variant="contained"
              size="large"
              onClick={() => handleButtonClick(slide)}
              sx={{
                backgroundColor: "rgb(24, 61, 226)",
                px: { xs: 3, sm: 4, md: 6 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                borderRadius: 4,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: "rgb(15, 18, 209)",
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {slide.buttonText}
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Carousel;