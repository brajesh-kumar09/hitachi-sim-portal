import React, { useEffect, useState } from 'react';
import { Customer } from '../types/Customer';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const rowsPerPage = 10;

  const fetchCustomers = () => {
    fetch('http://localhost:3001/Customer')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (cust: Customer) => cust.simNumber?.trim() !== '' && cust.serviceNumber?.trim() !== ''
        );
        setCustomers(filtered);
      })
      .catch((error) => console.error('Error fetching customers:', error));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const totalPages = Math.ceil(customers.length / rowsPerPage);

  const handlePrev = () => page > 0 && setPage(page - 1);
  const handleNext = () => page < totalPages - 1 && setPage(page + 1);

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    const [pin, cityPart, statePart] = customer.address?.split(',').map(str => str.trim()) ?? ['', '', ''];
    setPincode(pin || '');
    setCity(cityPart || '');
    setState(statePart || '');
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCustomer) return;

    const updatedAddress = `${pincode} ${city}, ${state}`;
    const res = await fetch(`http://localhost:3001/Customer/${editingCustomer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: updatedAddress }),
    });

    if (res.ok) {
      setOpen(false);
      setEditingCustomer(null);
      fetchCustomers(); // Refresh data
    } else {
      alert('Failed to update address');
    }
  };

  const paginatedCustomers = customers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', marginTop: 4 }}>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Customer Records
      </Typography>

      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['Name', 'Email', 'Date of Birth', 'Address', 'Actions'].map((header) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{ backgroundColor: 'goldenrod', color: '#fff', fontWeight: 'bold' }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((cust) => (
              <TableRow key={cust.id}>
                <TableCell align="center">{cust.name}</TableCell>
                <TableCell align="center">{cust.email}</TableCell>
                <TableCell align="center">{cust.dateOfBirth}</TableCell>
                <TableCell align="center">{cust.address}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditClick(cust)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button onClick={handlePrev} disabled={page === 0} startIcon={<ArrowBackIosNewIcon />}>
          Previous
        </Button>
        <Typography sx={{ mx: 2, mt: 1 }}>Page {page + 1} of {totalPages}</Typography>
        <Button onClick={handleNext} disabled={page >= totalPages - 1} endIcon={<ArrowForwardIosIcon />}>
          Next
        </Button>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <TextField
            label="Pincode"
            fullWidth
            margin="normal"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <TextField
            label="City"
            fullWidth
            margin="normal"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField
            label="State"
            fullWidth
            margin="normal"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerTable;
