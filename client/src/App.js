import { Container, createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import PostList from './components/PostList';
import AppBar from './components/AppBar';
import './App.css';
import axios from 'axios';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    const [user, setUser] = React.useState({});
    const getUser = async () => {
        const { data } = await axios.get('http://localhost:3001/api/author/1');
        setUser(data);
    };
    React.useEffect(() => {
        getUser();
    }, []);
    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar user={user} />
            <Container maxWidth='sm' sx={{ mt: 4 }}>
                <PostList user={user} />
            </Container>
        </ThemeProvider>
    );
}

export default App;
