import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaStar, FaCalendar, FaUsers, FaGamepad } from 'react-icons/fa';
import logo from './img/phoneflex.png';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Button, Grid, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './css/adminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUsers(token);
    }
  }, [navigate]);

  const fetchUsers = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filteredUsers = data.filter((user) => user.role === 'user');
        setUsers(filteredUsers);
        setUserCount(filteredUsers.length);
        setPreviousCount(filteredUsers.length - 1);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        setUserCount(userCount - 1);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const userChangePercentage = previousCount
    ? Math.round(((userCount - previousCount) / previousCount) * 100)
    : 0;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button onClick={() => navigate('/all-reviews')}>
            <ListItemIcon><FaStar /></ListItemIcon>
            <ListItemText primary="Review and Ratings Management" />
          </ListItem>
          <ListItem button onClick={() => navigate('/transactions')}>
            <ListItemIcon><FaUsers /></ListItemIcon>
            <ListItemText primary="Transactions Management" />
          </ListItem>
          <ListItem button onClick={() => navigate('/brand-management')}>
            <ListItemIcon><FaStar /></ListItemIcon>
            <ListItemText primary="Brand Management" />
          </ListItem>
          <ListItem button onClick={() => navigate('/product-management')}>
            <ListItemIcon><FaGamepad /></ListItemIcon>
            <ListItemText primary="Product Management" />
          </ListItem>
          <ListItem button onClick={() => navigate('/Chart')}>
            <ListItemIcon><FaGamepad /></ListItemIcon>
            <ListItemText primary="Charts Management" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><FaSignOutAlt /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ display: 'flex' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          <AppBar position="static">
            <Toolbar>
              <img src={logo} alt="Logo" style={{ height: 40, marginRight: '16px' }} />
              <Typography variant="h6">PhoneFlex</Typography>
            </Toolbar>
          </AppBar>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Ratings</Typography>
                  <FaStar />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Product</Typography>
                  <FaCalendar />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Users</Typography>
                  <FaUsers />
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">{userCount} Users</Typography>
                    <Typography variant="body2" color={userChangePercentage >= 0 ? 'green' : 'red'}>
                      {userChangePercentage >= 0 ? '↑' : '↓'} {Math.abs(userChangePercentage)}% Since last week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Charts</Typography>
                  <FaGamepad />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Manage Users
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="primary" sx={{ mr: 1 }}>Edit</Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleDelete(user._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AdminDashboard;
