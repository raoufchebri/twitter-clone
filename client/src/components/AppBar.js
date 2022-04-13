import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';

const ResponsiveAppBar = () => {
    return (
        <AppBar position='sticky'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                        }}
                    ></Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <IconButton sx={{ p: 0 }}>
                            <Avatar
                                alt='Remy Sharp'
                                src='/static/images/avatar/2.jpg'
                            />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
