import { Container, createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import PostList from './components/PostList';
import AppBar from './components/AppBar';
import './App.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar />
            <Container maxWidth='sm' sx={{ mt: 4 }}>
                <PostList />
            </Container>
        </ThemeProvider>
    );
}

export default App;
