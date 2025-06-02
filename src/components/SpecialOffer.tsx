import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';

import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import SmsIcon from '@mui/icons-material/Sms';
import StarIcon from '@mui/icons-material/Star';

const offerData = [
  {
    title: 'Combo Plan',
    description: 'Unlimited calls + 2GB/day + 100 SMS/day',
    icon: <StarIcon sx={{ fontSize: 40 }} color="warning" />,
    price: '₹299',
    validity: '28 Days',
  },
  {
    title: 'Data Booster',
    description: '6GB high-speed data',
    icon: <DataUsageIcon sx={{ fontSize: 40 }} color="secondary" />,
    price: '₹98',
    validity: 'No Validity',
  },
  {
    title: 'Talktime Pack',
    description: '₹100 Talktime + 200MB data',
    icon: <LocalPhoneIcon sx={{ fontSize: 40 }} color="primary" />,
    price: '₹107',
    validity: 'Unlimited Validity',
  },
];

const SpecialOffer: React.FC = () => {
  const [simNumber, setSimNumber] = useState('');
  const [serviceNumber, setServiceNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: 'success' | 'error';
    open: boolean;
  }>({
    message: '',
    severity: 'success',
    open: false,
  });

  const showMessage = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ message, severity, open: true });
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();

    const userStr = localStorage.getItem('loggedInUser');
    if (!userStr) {
      showMessage('Please login to continue.', 'error');
      return;
    }

    const user = JSON.parse(userStr);

    if (
      user.simNumber === simNumber.trim() &&
      user.serviceNumber === serviceNumber.trim()
    ) {
      if (!user.isSimValidated) {
        showMessage('SIM not validated yet. Please validate first.', 'error');
        return;
      }

      setIsVerified(true);
      showMessage('SIM Verified! Offers unlocked 🎉', 'success');
    } else {
      showMessage('SIM or Service Number is incorrect.', 'error');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Special Offers
      </Typography>

      {!isVerified ? (
        <Box
          component="form"
          onSubmit={handleValidate}
          sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}
        >
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
                                  Show Offers
                              </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(3, 1fr)',
            },
            mt: 4,
          }}
        >
          {offerData.map((offer, index) => (
            <Card
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 3,
                px: 2,
                height: '100%',
              }}
            >
              {offer.icon}
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  {offer.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {offer.description}
                </Typography>
                <Typography variant="subtitle1" align="center" sx={{ mt: 1 }}>
                  <strong>Price:</strong> {offer.price}
                  <br />
                  <strong>Validity:</strong> {offer.validity}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

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

export default SpecialOffer;
