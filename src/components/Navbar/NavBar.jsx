import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    Tooltip,
    MenuItem,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Person';
import logo1 from './logo_riesgos2.png';

const pages = [
    { name: 'Inicio', path: '/riesgosapp/' },
    { name: 'Visor Territorial', path: '/riesgosapp/alertmap' },
    { name: 'Análsis', path: '/riesgosapp/riesgosmapa' },
    { name: 'Preparación', path: '/riesgosapp/planfamiliar' },
    { name: 'Respuesta', path: '/riesgosapp/Evin' },
    { name: 'Geologia', path: '/riesgosapp/geologia' },
    { name: 'COE', path: '/riesgosapp/coe' }
];

const settings = [{ name: 'Perfil', path: '/riesgosapp/perfil' },
{ name: 'Cuenta', path: '/riesgosapp/cuenta' },
{ name: 'Panel', path: '/riesgosapp/panel' },
{ name: 'Cerrar Sesión', path: '/riesgosapp/' }];

export default function ResponsiveNavBar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" style={{ background: 'linear-gradient(45deg, #FF5733 20%, #FFD700 90%)' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo - visible en todas las pantallas */}
                    <IconButton sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} edge="start" color="inherit">
                        <img src={logo1} alt="Logo" style={{ width: '30px', height: '30px' }} />
                    </IconButton>

                    {/* Título - versión desktop */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/riesgosapp"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        GESTIÓN DE RIESGOS DE DESASTRES
                    </Typography>

                    {/* Menú hamburguesa - versión mobile */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                    <NavLink to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Typography textAlign="center">{page.name}</Typography>
                                    </NavLink>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Logo y título - versión mobile */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, alignItems: 'center' }}>
                        <IconButton sx={{ mr: 1 }} color="inherit">
                            <img src={logo1} alt="Logo" style={{ width: '30px', height: '30px' }} />
                        </IconButton>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/riesgosapp"
                            sx={{
                                mr: 2,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            CGRD
                        </Typography>
                    </Box>

                    {/* Menú principal - versión desktop */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                component={NavLink}
                                to={page.path}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    mx: 1,
                                    '&.active': {
                                        borderBottom: '2px solid white'
                                    }
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* Menú de usuario */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Abrir configuración">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <AdbIcon sx={{ color: 'white' }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <NavLink to={setting.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Typography textAlign="center">{setting.name}</Typography>
                                    </NavLink>

                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}