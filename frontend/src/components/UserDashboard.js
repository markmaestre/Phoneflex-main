import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/userDashboard.css';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
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
            } catch (err) {
                setError(err.message);
                localStorage.removeItem('token');
                navigate('/login');
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

    const handleNavigateToCart = () => {
        navigate('/order-history');
    };

    if (error) return <p className="error">{error}</p>;

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="profile-section">
                    <div className="profile-picture">
                        {user?.img ? (
                            <img src={`http://localhost:5000/${user.img}`} alt="Profile" />
                        ) : (
                            <img src="profile_placeholder.png" alt="Profile" />
                        )}
                    </div>
                    <h3>{user ? user.name : 'User'}</h3>
                    <button
                        onClick={() => navigate('/update-profile')} 
                        className="settings-button"
                    >
                        Settings
                    </button>
                </div>
                <nav>
                    <ul>
                        <li>Dashboard</li>
                        <li onClick={handleNavigateToProducts} style={{ cursor: 'pointer' }}>Products</li>
                        <li onClick={handleNavigateToCart} style={{ cursor: 'pointer' }}>order-history</li> {}
                        <li>Transaction</li>
                        <li>Cart History</li>
                        <li>Review and Ratings</li>
                    </ul>
                </nav>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </aside>
        </div>
    );
};

export default UserDashboard;
