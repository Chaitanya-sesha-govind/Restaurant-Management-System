import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [userRole, setUserRole] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decoded.role);
    }
  }, [token]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/orderslist', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [token]);

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token'); // Get fresh token
      const response = await axios.put(
        `http://localhost:4000/api/orders/${id}/status`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setOrders(prevOrders => {
        if (status === 'Completed') {
          // Remove the completed order immediately
          return prevOrders.filter(order => order.order_id !== id);
        }
        // Update status for other cases
        return prevOrders.map(order => 
          order.order_id === id ? { ...order, status } : order
        );
      });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <div className="order-grid">
        {orders.map((order) => (
          <div key={order.order_id} className="order-box">
            <div className="order-header">
              <h3>Order #{order.order_id}</h3>
              <p>Table: {order.table_id}</p>
              <p>Amount: ${order.amount}</p>
              <p>Status: {order.status}</p>
            </div>
            <div className="order-items">
              <strong>Items:</strong>
              <ul>
                {order.items && order.items.map((item, index) => (
                  <li key={index}>{item.name} (x{item.quantity}) - ${item.price}</li>
                ))}
              </ul>
            </div>
            <div className="order-actions">
              {order.status === 'pending' && userRole === 'staff' && (
                <button className="update-button" onClick={() => handleUpdateOrderStatus(order.order_id, 'In Progress')}>
                  Start Preparing
                </button>
              )}
              {order.status === 'In Progress' && userRole === 'staff' && (
                <button className="update-button" onClick={() => handleUpdateOrderStatus(order.order_id, 'Ready')}>
                  Mark as Ready
                </button>
              )}
              {order.status === 'Ready' && userRole === 'staff' && (
                <button className="update-button" onClick={() => handleUpdateOrderStatus(order.order_id, 'Completed')}>
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
