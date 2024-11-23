import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import BrandManagement from './components/BrandManagement';
import ProductManagement from './components/ProductManagement'; // Import ProductManagement component
import Homes from './components/Homes'; // Renamed Homes to Homes (for /home route)
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileUpdate from './components/ProfileUpdate';
import ProductsList from './components/ProductsList'; // Import ProductsList component      
import OrderHistory from './components/OrderHistory'; // Import OrderHistory component
import Transactions from './components/Transactions'; // Import OrderHistory component




const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="home" />} /> {/* Optional: Redirect to /home */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/brand-management" element={<BrandManagement />} />
          <Route path="/product-management" element={<ProductManagement />} /> {/* Product Management route */}
          <Route path="/home" element={<Homes />} /> {/* Updated to Home */}
          <Route path="/update-profile" element={<ProfileUpdate />} />
          <Route path="/products" element={<ProductsList />} /> {/* Route for Products List */}
          <Route path="/order-history" element={<OrderHistory />} /> {/* Route for Order History */}
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
