import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import './css/profileUpdate.css'; 

const ProfileUpdate = () => {
    const [error, setError] = useState(''); 
    const [newName, setNewName] = useState(''); 
    const [newImage, setNewImage] = useState(null); 
    const [loading, setLoading] = useState(false); 
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
                    const errorText = await response.text();
                    setError('Failed to fetch user data: ' + errorText);
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                const data = await response.json();
                setNewName(data.user.name); 
            } catch (err) {
                setError('Error fetching user data: ' + err.message);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', newName);
        if (newImage) formData.append('image', newImage);

        try {
            const response = await fetch('http://localhost:5000/api/auth/update-profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to update profile: ' + errorText);
            }

            const updatedUser = await response.json();
            alert('Profile updated successfully!');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setNewImage(e.target.files[0]); 
    };

    if (error) return <Typography color="error">{error}</Typography>; 

    return (
        <Box sx={{ maxWidth: 500, margin: '0 auto', padding: 3, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom align="center">Update Your Profile</Typography>

            <form onSubmit={handleProfileUpdate}>
                {}
                <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                    margin="normal"
                />

                {}
                <Box sx={{ marginTop: 2 }}>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="upload-image"
                    />
                    <label htmlFor="upload-image">
                        <Button variant="contained" color="secondary" component="span">
                            Upload Profile Picture
                        </Button>
                    </label>
                </Box>

                {}
                <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ProfileUpdate;
