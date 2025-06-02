import React from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Drawer,
  Toolbar,
  ListItemIcon,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';


import PeopleIcon from '@mui/icons-material/People';
import SimCardIcon from '@mui/icons-material/SimCard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InfoIcon from '@mui/icons-material/Info';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'All Customer', path: '/all-customers', icon: <PeopleIcon /> },
    { label: 'Validate SIM', path: '/validate-sim', icon: <SimCardIcon /> },
    { label: 'Validate Customer', path: '/validate-customer', icon: <VerifiedUserIcon /> },
    { label: 'Validate Customer Details', path: '/validate-customer-details', icon: <InfoIcon /> },
    { label: 'Validate ID Proof', path: '/validate-id-proof', icon: <BadgeIcon /> },
    { label: 'Special Offers', path: '/special-offers', icon: <LocalOfferIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          background: 'linear-gradient(0deg,rgb(21, 65, 131) 0%,rgb(5, 26, 47) 90%)',
          color: 'white',
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map(({ label, path, icon }) => {
          const isSelected = location.pathname === path;
          return (
            <ListItemButton
              key={label}
              onClick={() => navigate(path)}
              sx={{
                color: 'white',
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(2, 22, 35, 0.25)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
