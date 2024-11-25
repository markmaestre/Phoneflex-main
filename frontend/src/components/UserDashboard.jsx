import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Avatar, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { Settings } from '@mui/icons-material';
import './css/userDashboard.css';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);  
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser(data.user);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                localStorage.removeItem('token');
                navigate('/login');
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        const confirmed = window.confirm('Do you want to logout?');
        if (confirmed) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleNavigateToProducts = () => {
        navigate('/products');
    };

    const handleNavigateToOrderHistory = () => {
        navigate('/order-history');
    };

    const handleNavigateToTransactions = () => {
        navigate('/transaction-history');
    };

    const handleNavigateToReviewHistory = () => {
        navigate('/review-history');
    };

    if (loading) return <CircularProgress />;  

    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <Box sx={{ width: 250, bgcolor: 'background.paper', padding: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                        src={user?.img ? `http://localhost:5000/${user.img}` : 'profile_placeholder.png'}
                        sx={{ width: 100, height: 100, mb: 2 }} 
                    />
                    <Typography variant="h6">{user?.name}</Typography>
                    <Button
                        onClick={() => navigate('/update-profile')}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, width: '100%' }}
                        startIcon={<Settings />}
                    >
                        Settings
                    </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
                <List>
                    <ListItem button onClick={handleNavigateToProducts}>
                        <ListItemText primary="Dashboard Products" />
                    </ListItem>
                    <ListItem button onClick={handleNavigateToOrderHistory}>
                        <ListItemText primary="Order History" />
                    </ListItem>
                    <ListItem button onClick={handleNavigateToTransactions}>
                        <ListItemText primary="Transaction History" />
                    </ListItem>
                    <ListItem button onClick={handleNavigateToReviewHistory}>
                        <ListItemText primary="Review History" />
                    </ListItem>
                </List>
                <Button
                    onClick={handleLogout}
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 2, width: '100%' }}
                >
                    Logout
                </Button>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to your Dashboard, {user?.name}
                </Typography>
                {/* Add other content here */}
            </Box>
        </Box>
    );
};

export default UserDashboard;
