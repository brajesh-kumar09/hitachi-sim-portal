import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

interface Customer {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  address: string;
}

const ValidateCustomerForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: 'success' | 'error';
    open: boolean;
  }>({
    message: '',
    severity: 'success',
    open: false,
  });

  const [loading, setLoading] = useState(false);

  const dobRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/;

  const formatDobToISO = (dob: string): string => {
    const [mm, dd, yyyy] = dob.split('-');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const showError = (msg: string) =>
      setSnackbar({ message: msg, severity: 'error', open: true });

    const showSuccess = (msg: string) =>
      setSnackbar({ message: msg, severity: 'success', open: true });

    if (!email.trim() || !dob.trim()) {
      showError('Email/dob value is required');
      return;
    }

    if (!dobRegex.test(dob)) {
      showError('DOB must be in mm-dd-yyyy format');
      return;
    }

    if (!emailRegex.test(email)) {
      showError('Invalid email');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/Customer');
      if (!res.ok) throw new Error('Failed to fetch customers');
      const customers: Customer[] = await res.json();

      const formattedDob = formatDobToISO(dob);
      const found = customers.find(
        (c) =>
          c.email.toLowerCase() === email.toLowerCase() &&
          c.dateOfBirth === formattedDob
      );

      if (!found) {
        showError('Invalid Customer:The customer doesn not exist');
      } else {
        showSuccess('Customer details validate successfully');
      }
    } catch (err) {
      showError('Error validating customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Validate Customer
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          type="email"
          required
        />
        <TextField
          label="Date of Birth (mm-dd-yyyy)"
          variant="outlined"
          fullWidth
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          margin="normal"
          placeholder="mm-dd-yyyy"
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: 'orange',
            '&:hover': {
              backgroundColor: '#e69500',
            },
          }}
          disabled={loading}
        >
          {loading ? 'Validating...' : 'Validate'}
        </Button>

      </form>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ValidateCustomerForm;
