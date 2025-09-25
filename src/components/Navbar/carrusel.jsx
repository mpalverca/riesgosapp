// components/MUICarousel.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
  Container
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Circle,
  CircleOutlined
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Styled components
const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
}));

const SlideContainer = styled(Box)({
  display: 'flex',
  transition: 'transform 0.5s ease-in-out',
  height: '100%',
});

const Slide = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  minWidth: '100%',
  opacity: active ? 1 : 0,
  transform: active ? 'translateX(0)' : 'translateX(100%)',
  transition: 'all 0.5s ease-in-out',
  position: active ? 'relative' : 'absolute',
  height: '500px',
  [theme.breakpoints.down('md')]: {
    height: '400px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '350px',
  },
}));

const SlideContent = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  maxWidth: '450px',
  width: '90%',
  boxShadow: theme.shadows[16],
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
  zIndex: 10,
  boxShadow: theme.shadows[8],
  width: theme.spacing(6),
  height: theme.spacing(6),
}));

const StyledIndicator = styled(IconButton)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.grey[400],
  padding: theme.spacing(0.5),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Carousel = ({ 
  slides = [], 
  autoPlay = true, 
  interval = 5000,
  height = 500,
  showIndicators = true,
  showNavigation = true
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  // Navegación entre slides
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [currentSlide, autoPlay, interval, slides.length]);

  // Manejar clic en botón con condición para enlaces
  const handleButtonClick = (slide) => {
    if (slide.buttonAction) {
      // Si tiene una acción personalizada, ejecutarla
      slide.buttonAction();
    } else if (slide.buttonLink) {
      // Verificar si es una ruta interna o enlace externo
      if (slide.buttonLink.startsWith('http') || slide.buttonLink.startsWith('www')) {
        // Enlace externo - abrir en nueva pestaña
        window.open(slide.buttonLink, slide.buttonTarget || '_blank');
      } else {
        // Ruta interna - navegar con react-router
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
        bgcolor="grey.100"
        borderRadius={2}
      >
        <Typography variant="h6" color="text.secondary">
          No hay slides para mostrar
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <CarouselContainer height={height}>
        <SlideContainer>
          {slides.map((slide, index) => (
            <Slide key={index} active={index === currentSlide}>
              {/* Imagen de fondo */}
              <CardMedia
                component="img"
                image={slide.image}
                alt={slide.alt || `Slide ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: slide.imageFilter || 'brightness(0.8)',
                }}
              />
              
              {/* Contenido superpuesto */}
              <SlideContent>
                <CardContent>
                  {/* Título */}
                  {slide.title && (
                    <Typography 
                      variant="h3" 
                      component="h2" 
                      gutterBottom
                      color="black"
                      fontWeight="bold"
                      sx={{
                        fontSize: {
                          xs: '1.5rem',
                          sm: '2rem',
                          md: '2.5rem'
                        }
                      }}
                    >
                      {slide.title}
                    </Typography>
                  )}
                  
                  {/* Descripción */}
                  {slide.description && (
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      paragraph
                      sx={{
                        fontSize: {
                          xs: '0.9rem',
                          sm: '1rem',
                          md: '1.1rem'
                        }
                      }}
                    >
                      {slide.description}
                    </Typography>
                  )}
                  
                  {/* Botón con condiciones para diferentes tipos de enlaces */}
                  {slide.buttonText && (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleButtonClick(slide)}
                      sx={{
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                          boxShadow: theme.shadows[8],
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease',
                        },
                      }}
                    >
                      {slide.buttonText}
                    </Button>
                  )}
                  
                  {/* Botón alternativo usando Link para rutas internas */}
                  {slide.buttonText && slide.buttonLink && !slide.buttonLink.startsWith('http') && (
                    <Button
                      component={Link}
                      to={slide.buttonLink}
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                          boxShadow: theme.shadows[8],
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease',
                        },
                        display: 'none', // Ocultamos este y usamos el otro para consistencia
                      }}
                    >
                      {slide.buttonText}
                    </Button>
                  )}
                </CardContent>
              </SlideContent>
            </Slide>
          ))}
        </SlideContainer>

        {/* Controles de navegación */}
        {/* {showNavigation && slides.length > 1 && (
          <>
            <NavigationButton 
              onClick={prevSlide}
              sx={{ left: theme.spacing(2) }}
              aria-label="Slide anterior"
            >
              <KeyboardArrowLeft fontSize="large" />
            </NavigationButton>
            
            <NavigationButton 
              onClick={nextSlide}
              sx={{ right: theme.spacing(2) }}
              aria-label="Slide siguiente"
            >
              <KeyboardArrowRight fontSize="large" />
            </NavigationButton>
          </>
        )} */}

        {/* Indicadores */}
        {showIndicators && slides.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: theme.spacing(2),
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: theme.spacing(0.5),
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              borderRadius: theme.spacing(3),
              padding: theme.spacing(0.5),
            }}
          >
            {slides.map((_, index) => (
              <StyledIndicator
                key={index}
                active={index === currentSlide}
                onClick={() => goToSlide(index)}
                size="small"
                aria-label={`Ir al slide ${index + 1}`}
              >
                {index === currentSlide ? (
                  <Circle fontSize="small" />
                ) : (
                  <CircleOutlined fontSize="small" />
                )}
              </StyledIndicator>
            ))}
          </Box>
        )}

        {/* Contador de slides */}
        {slides.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              top: theme.spacing(2),
              right: theme.spacing(2),
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              borderRadius: theme.spacing(3),
              padding: theme.spacing(1, 2),
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              {currentSlide + 1} / {slides.length}
            </Typography>
          </Box>
        )}
      </CarouselContainer>
    </Container>
  );
};

export default Carousel;