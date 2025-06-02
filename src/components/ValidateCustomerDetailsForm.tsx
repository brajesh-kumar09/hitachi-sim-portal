import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';

interface Customer {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  address: string;
}

const ValidateCustomerDetailsForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: 'success' | 'error';
    open: boolean;
  }>({ message: '', severity: 'success', open: false });

  const showError = (msg: string) =>
    setSnackbar({ message: msg, severity: 'error', open: true });
  const showSuccess = (msg: string) =>
    setSnackbar({ message: msg, severity: 'success', open: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z]{1,15}$/;

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      showError('Firstname/Lastname should be a maximum of 15 characters');
      return;
    }

    if (!email.trim()) {
      showError('Email value is required');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/Customer');
      if (!res.ok) throw new Error('Network error');
      const customers: Customer[] = await res.json();

      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const matchedCustomer = customers.find(
        (c) =>
          c.name.toLowerCase() === fullName.toLowerCase() &&
          c.email.toLowerCase() === email.toLowerCase()
      );

      if (!matchedCustomer) {
        showError('No customer found for the provided details');
      } else {
        showSuccess('Customer details validated successfully!');
      }
    } catch {
      showError('Server error. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Validate Customer Details
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          inputProps={{ maxLength: 15 }}
          required
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          inputProps={{ maxLength: 15 }}
          required
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
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
        autoHideDuration={4000}
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

export default ValidateCustomerDetailsForm;
