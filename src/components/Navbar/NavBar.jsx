import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
//import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import logo1 from './logo_riesgos2.png'
import { NavLink } from 'react-router-dom';

const pages = [
    { name: 'inicio', path: '/' },
    { name: 'alerta', path: '/alertmap' },
    { name: 'riesgos', path: '/riesgosmapa' },
    { name: 'Plan Familiar', path: '/planfamiliar' },
    { name: 'Plan de Contingencia', path: '/plancontingencia' },
    { name: 'COE', path: '/coe' }
];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
export default function NavBar() {
    return (
        <AppBar position="static" style={{ background: 'linear-gradient(45deg, #FF5733 30%, #FFD700 90%)' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <IconButton sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} edge="start" color="inherit" aria-label="menu">
                        <img src={logo1} alt="Logo Usuario"
                            style={{
                                width: '30px',
                                height: '30px',
                                //borderRadius: '50%'
                            }} />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
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
                        GESTIÓN DE RIESGOS
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button key={page.name} sx={{ my: 2, color: 'white', display: 'block' }}>
                                <Typography variant="body1">
                                    <NavLink to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {page.name}
                                    </NavLink>
                                </Typography>
                            </Button>

                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
