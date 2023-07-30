import { useState } from 'react';
import {
    Box,
    Card,
    Container,
    Button,
    Stack,
    Snackbar,
    TextField,
    styled
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'src/utils/auth';

import MuiAlert from '@mui/material/Alert';

const MainContent = styled(Box)(({ theme }) => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center; 
`);



export default () => {
    const [openSnackbar, setOpenSnackbar] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn } = useAuth()

    const handleSignIn = async () => {
        if (email == '' || password == '') {
            setOpenSnackbar('Preencha todos os campos');
            return;
        }

        const requestSignIn = await signIn(email, password)
        if (!requestSignIn) {
            setOpenSnackbar('Email e/ou senha(s) incorreto(s)');
        }
        
    }

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>

            <Snackbar
                open={openSnackbar != ''}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar('')}
            >
                <MuiAlert style={{ color: 'whitesmoke' }} severity="error">{openSnackbar}</MuiAlert>
            </Snackbar>

            <MainContent>
                <Container maxWidth="sm">
                    <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                        <Stack spacing={3}>
                            <TextField
                                label="Seu email"
                                type="email"
                                value={email}
                                onChange={t => setEmail(t.target.value)}
                            />
                            <TextField
                                label="Sua senha"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={t => setPassword(t.target.value)}
                            />

                            <Button
                                onClick={handleSignIn}
                                variant="outlined"
                                style={{ marginTop: 40 }}
                            >
                                Entrar
                            </Button>
                        </Stack>
                    </Card>
                </Container>
            </MainContent>
        </>
    );
} 