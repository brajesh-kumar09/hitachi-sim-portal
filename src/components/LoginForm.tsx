import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbar, setSnackbar] = useState<{
        message: string;
        severity: 'success' | 'error';
        open: boolean;
    }>({ message: '', severity: 'success', open: false });

    const navigate = useNavigate();

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ message, severity, open: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            showSnackbar('Email and Password are required', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/Customer');
            if (!response.ok) throw new Error('Failed to fetch customer data');

            const customers = await response.json();
            const matchedUser = customers.find(
                (cust: any) =>
                    cust.email.toLowerCase() === email.trim().toLowerCase() &&
                    cust.password === password.trim()
            );

            if (matchedUser) {
                localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
                showSnackbar('Login successful!', 'success');

                setTimeout(() => {
                    navigate('/all-customers');
                }, 1000);
            } else {
                showSnackbar('Invalid email or password', 'error');
            }
        } catch (err) {
            console.error(err);
            showSnackbar('Server error. Please try again.', 'error');
        }
    };

    return (
        <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, width: 350 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 2,
                            backgroundColor: 'orange',
                            '&:hover': {
                                backgroundColor: '#e69500', 
                            },
                        }}
                    >
                        Login
                    </Button>

                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginForm;
