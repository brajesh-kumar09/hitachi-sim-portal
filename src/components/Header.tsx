import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from "./logo.svg";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('loggedInUser'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('loggedInUser'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('loggedInUser'));
  }, [navigate]);

  const handleTitleClick = () => {
    navigate('/all-customers');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        // backgroundImage: 'linear-gradient(180deg, rgb(21, 65, 131) 0%, rgb(5, 26, 47) 100%)',
        backgroundColor: 'rgb(5, 26, 47)',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={handleTitleClick}
          sx={{
            flexGrow: 1,
            color: 'white',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',            // Use flex layout
            alignItems: 'center'
          }}
        >
          <img src={logo} alt="logo" height="32" style={{
            borderRadius: '5px'
          }}/>
          <span style={{marginInlineStart: '1%'}}>Hitachi SIM Activation Portal</span>
        </Typography>

        {isLoggedIn ? (
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogoutClick}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: '#ccc',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLoginClick}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: '#ccc',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
