import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import BrandManagement from './components/BrandManagement';
import ProductManagement from './components/ProductManagement'; 
import Homes from './components/Homes'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileUpdate from './components/ProfileUpdate';
import ProductsList from './components/ProductsList'; 
import OrderHistory from './components/OrderHistory'; 
import Transactions from './components/Transactions'; 
import TransactionHistory from './components/TransactionHistory'; 
import ReviewHistory from './components/ReviewHistory'; 
import AllReview from './components/AllReview'; 
import SalesChart from './components/SalesChart';
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="Login" />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/brand-management" element={<BrandManagement />} />
          <Route path="/product-management" element={<ProductManagement />} /> 
          <Route path="/home" element={<Homes />} /> 
          <Route path="/update-profile" element={<ProfileUpdate />} />
          <Route path="/products" element={<ProductsList />} /> 
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transaction-history" element={<TransactionHistory />} /> 
          <Route path="/review-history" element={<ReviewHistory />} /> 
          <Route path="/all-reviews" element={<AllReview />} />
          <Route path="/Chart" element={<SalesChart />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
