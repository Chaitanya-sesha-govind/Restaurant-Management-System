import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import StaffLogin from './components/StaffLogin';
import './App.css';
import StaffRegister from './components/StaffRegister';
import About from './components/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/customer-login" element={<Login userType="Customer" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/staff-register" element={<StaffRegister />} />
        <Route path="/about" element={<About/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/google" element={<RedirectExternalRoutes />} />
      </Routes>
    </Router>
  );
}

const RedirectExternalRoutes = () => {
  window.location.href = 'http://localhost:4000/auth/google';  
  return null;
};

export default App;
