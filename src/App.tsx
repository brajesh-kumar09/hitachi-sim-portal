import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AllCustomerPage from './components/CustomerTable';
import ValidateCustomerPage from './pages/ValidateCustomerPage';
import ValidateCustomerDetailsPage from './pages/ValidateCustomerDetailsPage';
import LoginPage from './pages/LoginPage';
import ValidateSimPage from './pages/ValidateSimPage';
import ValidateIdProofPage from './pages/ValidateIdProofPage';
import SpecialOffersPage from './pages/SpecialOfferPage';
import { Box, Toolbar } from '@mui/material';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('loggedInUser');
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar sx={{ minHeight: 22 }} />
        {children}
      </Box>
    </Box>
  );
};

const ValidateSimGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userStr = localStorage.getItem('loggedInUser');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  if (!user.simNumber || !user.serviceNumber) {
    return (
      <Navigate
        to="/validate-id-proof"
        state={{ message: 'Please verify ID proof first.' }}
        replace
      />
    );
  }

  return <>{children}</>;
};

const SpecialOffersGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userStr = localStorage.getItem('loggedInUser');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  if (!user.isSimValidated) {
    return (
      <Navigate
        to="/validate-sim"
        state={{ message: 'Please validate your SIM first.' }}
        replace
      />
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/all-customers"
          element={
            <ProtectedLayout>
              <AllCustomerPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/validate-customer"
          element={
            <ProtectedLayout>
              <ValidateCustomerPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/validate-sim"
          element={
            <ProtectedLayout>
              <ValidateSimGuard>
                <ValidateSimPage />
              </ValidateSimGuard>
            </ProtectedLayout>
          }
        />
        <Route
          path="/validate-customer-details"
          element={
            <ProtectedLayout>
              <ValidateCustomerDetailsPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/validate-id-proof"
          element={
            <ProtectedLayout>
              <ValidateIdProofPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/special-offers"
          element={
            <ProtectedLayout>
              <SpecialOffersGuard>
                <SpecialOffersPage />
              </SpecialOffersGuard>
            </ProtectedLayout>
          }
        />
        <Route
          path="/"
          element={
            localStorage.getItem('loggedInUser') ? (
              <Navigate to="/all-customers" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
