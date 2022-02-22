import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LoginIcon from '@mui/icons-material/Login';
import { FloatWithIcon } from './FloatWithIcon';
import { Add } from '@mui/icons-material';

// const pages = ['Seminars'];
const pages = []
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const settings = ['Sign out']

const ResponsiveAppBar = ({
  logo,
  user,
  signedIn,
  loginAction,
  logoutAction,
  newSeminar
}) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" id="appbar" color="inherit">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            {logo}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>
          {signedIn && (
            <Box sx={{ mr: 5 }}>
              <FloatWithIcon elevation={0} Icon={Add} text="New seminar" onClick={newSeminar} />
            </Box>
          )}
          <Box sx={{ flexGrow: 0 }}>
            {signedIn ? (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.displayName} src="/static/images/avatar/tmp.png" />
                </IconButton>
              </Tooltip>
            ) : (
              <FloatWithIcon elevation={0} Icon={LoginIcon} text="Log in" onClick={loginAction} />
            )}

            {signedIn && (
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key="user-name" onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{user.displayName}</Typography>
                </MenuItem>
                <MenuItem key="user-logout" onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={() => logoutAction()}>Sign out</Typography>
                </MenuItem>
              </Menu>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
