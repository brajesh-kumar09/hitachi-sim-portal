import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const SimServiceForm: React.FC = () => {
  const [simNumber, setSimNumber] = useState('');
  const [serviceNumber, setServiceNumber] = useState('');
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: 'success' | 'error';
    open: boolean;
  }>({ message: '', severity: 'success', open: false });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      setSnackbar({ message: location.state.message, severity: 'error', open: true });
      // Clear the state after showing
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const showError = (msg: string) =>
    setSnackbar({ message: msg, severity: 'error', open: true });
  const showSuccess = (msg: string) =>
    setSnackbar({ message: msg, severity: 'success', open: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!simNumber.trim() || !serviceNumber.trim()) {
      showError('SIM Number and Service Number are required');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/Customer');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const match = data.find(
        (item: any) =>
          item.simNumber === simNumber.trim() &&
          item.serviceNumber === serviceNumber.trim()
      );

      if (match) {
        const updateRes = await fetch(`http://localhost:3001/Customer/${match.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isSimValidated: true }),
        });

        if (!updateRes.ok) throw new Error('Failed to update server');

        const userStr = localStorage.getItem('loggedInUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          const updatedUser = { ...user, isSimValidated: true };
          localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        }

        showSuccess('SIM and Service Number validated successfully!');
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
        Validate SIM & Service Number
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="SIM Number"
          fullWidth
          margin="normal"
          value={simNumber}
          onChange={(e) => setSimNumber(e.target.value)}
          required
        />
        <TextField
          label="Service Number"
          fullWidth
          margin="normal"
          value={serviceNumber}
          onChange={(e) => setServiceNumber(e.target.value)}
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

export default SimServiceForm;
