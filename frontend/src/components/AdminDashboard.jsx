import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaStar, FaCalendar, FaUsers, FaGamepad } from 'react-icons/fa';
import logo from './img/logo.png';
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
      <div className="sidebar">
        <div className="sidebar-item" onClick={() => navigate('/home')}>
          <FaHome className="sidebar-icon" />
          Dashboard
        </div>
        <div className="sidebar-item" onClick={() => navigate('/events')}>
          <FaCalendar className="sidebar-icon" />
          Events
        </div>
        <div className="sidebar-item" onClick={() => navigate('/games')}>
          <FaGamepad className="sidebar-icon" />
          Games
        </div>
        <div className="sidebar-item" onClick={() => navigate('/users')}>
          <FaUsers className="sidebar-icon" />
          Users
        </div>
        <div className="sidebar-item" onClick={() => navigate('/ratings')}>
          <FaStar className="sidebar-icon" />
          Ratings
        </div>

        <div className="sidebar-item" onClick={() => navigate('/transactions')}>
        <FaUsers className="sidebar-icon" />
          Transactions
        </div> 
        <div className="sidebar-item" onClick={() => navigate('/brand-management')}>
          <FaStar className="sidebar-icon" />
          Brand Management
        </div>
        {/* Add Product Management Link */}
        <div className="sidebar-item" onClick={() => navigate('/product-management')}>
          <FaGamepad className="sidebar-icon" />
          Product Management
        </div>
        <div className="sidebar-item" onClick={handleLogout}>
          <FaSignOutAlt className="sidebar-icon" />
          Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <header className="header">
          <div className="right-section">
            <img src={logo} alt="Logo" className="logo" />
            <span className="user-name">PhoneFlex</span>
          </div>
        </header>
        <main className="main-content">
          <h2 className="main-title">Admin Dashboard</h2>
          <div className="box-container">
            <div className="box pink">
              <span>Ratings</span>
              <FaStar />
            </div>
            <div className="box pink">
              <span>Future Events</span>
              <FaCalendar />
            </div>
            <div className="box pink">
              <span>Users</span>
              <FaUsers />
              <div className="user-stats">
                <p>{userCount} Users</p>
                <p className="percentage-change">
                  {userChangePercentage >= 0 ? '↑' : '↓'} {Math.abs(userChangePercentage)}% Since last week
                </p>
              </div>
            </div>
            <div className="box pink">
              <span>Future Games</span>
              <FaGamepad />
            </div>
          </div>
          <div className="user-management">
            <h3>Manage Users</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
