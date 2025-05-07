import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard1.css';

function Dashboard1({ setActiveSection }) {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [porders, setporders] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [userRole, setUserRole] = useState('');


  
  useEffect(() => {
    fetchTables();

    const savedTableId = localStorage.getItem('selectedTableId');
    if (savedTableId) {
      setSelectedTableId(Number(savedTableId));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decoded.role);
    }
  }, []);

  useEffect(() => {
    if (userRole === 'staff') {
      fetchOrders();
      fetchPaymentOrders();
    }
  }, [userRole]);

 
  

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:4000/get-tables', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(data.tables)) {
        setTables(data.tables);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

 
  
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:4000/api/orderslist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data); // data is already an array of orders
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
         
  const fetchPaymentOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:4000/api/pmorders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(data.items)) {
        setporders(data.items);
      }
    } catch (error) {
      console.error('Error fetching payment orders:', error);
    }
  };
  console.log(porders);
  const totalTables = tables.length;
  const bookedTables = tables.filter((t) => t.status === 'Occupied').length;
  const availableTables = totalTables - bookedTables;
  const isCustomer = userRole != 'staff';
  return (
    <div className="dashboard1-container">
      <h2 className="dashboard1-title">🍴 Restaurant Dashboard</h2>
      <p className="dashboard1-subtitle">Here’s your current overview.</p>
      
     
      {isCustomer && (
         <div className="dashboard1-stats">
         <div className="stat-card">
           <div className="stat-icon">🪑</div>
           <div className="stat-label">Total Tables</div>
           <div className="stat-value">{totalTables}</div>
         </div>
         <div className="stat-card">
           <div className="stat-icon">✅</div>
           <div className="stat-label">Available</div>
           <div className="stat-value">{availableTables}</div>
         </div>
         <div className="stat-card">
           <div className="stat-icon">🔒</div>
           <div className="stat-label">Booked</div>
           <div className="stat-value">{bookedTables}</div>
         </div>
       </div>
      )}

{!isCustomer && (
         <div className="dashboard1-stats">
         <div className="stat-card">
           <div className="stat-icon">📝</div>
           <div className="stat-label">Pending orders</div>
           <div className="stat-value">{orders.filter(order => order.status === 'pending').length}</div>
         </div>
         <div className="stat-card">
           <div className="stat-icon">💰</div>
           <div className="stat-label">Pending Payments</div>
           <div className="stat-value">{porders.filter(order => order.payment_status === 'pending').length}</div>
         </div>
         <div className="stat-card">
           <div className="stat-icon">🔒</div>
           <div className="stat-label">Booked Tables</div>
           <div className="stat-value">{bookedTables}</div>
         </div>
       </div>
      )}

      {isCustomer && selectedTableId && (
        <div className="dashboard1-booking-note">
          🎉 You have successfully booked <strong>Table {selectedTableId}</strong>
        </div>
      )}

      <div className="dashboard1-actions">
        <button className="dashboard1-menu-btn" onClick={() => setActiveSection('tables')}>
          View Tables
        </button>
        <button className="dashboard1-menu-btn" onClick={() => setActiveSection('menu')}>
          Explore Menu
        </button>
      </div>
    </div>
  );
}

export default Dashboard1;
