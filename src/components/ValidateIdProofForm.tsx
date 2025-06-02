import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Snackbar,
    Alert,
    Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const CustomerForm: React.FC = () => {
    const location = useLocation();
    const [aadhar, setAadhar] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [snackbar, setSnackbar] = useState<{
        message: string;
        severity: 'success' | 'error';
        open: boolean;
    }>({ message: '', severity: 'success', open: false });

    const showError = (msg: string) =>
        setSnackbar({ message: msg, severity: 'error', open: true });

    const showSuccess = (msg: string) =>
        setSnackbar({ message: msg, severity: 'success', open: true });

    const generateSimNumber = () =>
        Math.floor(1000000000000 + Math.random() * 9000000000000).toString();

    const generateServiceNumber = () =>
        Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // ✅ Show redirect message if any
    useEffect(() => {
        const state = location.state as { message?: string };
        if (state?.message) {
            showError(state.message);
        }
    }, [location.state]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!aadhar.trim() || !firstName.trim() || !lastName.trim() || !dateOfBirth.trim()) {
            showError('All fields are required');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/Customer');
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();

            const fullName = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();

            const match = data.find(
                (item: any) =>
                    item.aadharNumber === aadhar.trim() &&
                    item.name.toLowerCase() === fullName &&
                    item.dateOfBirth === dateOfBirth
            );

            if (match) {
                const simNumber = generateSimNumber();
                const serviceNumber = generateServiceNumber();

                const updateRes = await fetch(`http://localhost:3001/Customer/${match.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ simNumber, serviceNumber }),
                });

                if (!updateRes.ok) throw new Error('Update failed');

                // Update localStorage if user is logged in
                const loggedInUserStr = localStorage.getItem('loggedInUser');
                if (loggedInUserStr) {
                    const user = JSON.parse(loggedInUserStr);
                    const updatedUser = { ...user, simNumber, serviceNumber };
                    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
                }

                showSuccess(`Customer validated. SIM: ${simNumber}, Service: ${serviceNumber}`);
            } else {
                showError('No matching customer found.');
            }
        } catch (err) {
            showError('Server error. Please try again.');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" align="center" gutterBottom>
                Validate Customer
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Aadhar"
                    fullWidth
                    margin="normal"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value)}
                    required
                />
                <TextField
                    label="First Name"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <TextField
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    margin="normal"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    InputLabelProps={{ shrink: true }}
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
                    Validate
                </Button>

            </form>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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

export default CustomerForm;
