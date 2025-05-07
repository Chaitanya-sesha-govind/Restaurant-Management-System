import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/PaymentTracking.css';

const PaymentTracking = () => {
  const [orders, setOrders] = useState([]);
  const [isStaff, setIsStaff] = useState(false);
  const [newStatuses, setNewStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const taxRate = 0.08;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        
        const { role } = JSON.parse(atob(token.split('.')[1]));
        setIsStaff(role === 'staff');
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const endpoint = role === 'staff' ? 'pmorders' : 'pyourorder';
        const response = await axios.get(`http://localhost:4000/api/${endpoint}`, config);

        if (response.status === 200) {
          const data = Array.isArray(response.data) ? response.data : 
                     (response.data.items && Array.isArray(response.data.items) ? 
                      response.data.items : []);
          
          setOrders(data);
          
          if (role === 'staff') {
            const initialStatuses = data.reduce((acc, order) => {
              acc[order.order_id] = order.payment_status;
              return acc;
            }, {});
            setNewStatuses(initialStatuses);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.put(
        `http://localhost:4000/api/orders/${orderId}/payment-status`,
        { paymentStatus: newStatuses[orderId] },
        config
      );

      if (response.status === 200) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.order_id === orderId
              ? { ...order, payment_status: newStatuses[orderId] }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid': return 'status-badge paid';
      case 'pending': return 'status-badge pending';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  
  if (error) return <div className="error-message">Error: {error}</div>;
  const totalBill = orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);
  return (
    <div className="payment-tracking-container">
      <header className="payment-header">
        <h2>Payment Tracking</h2>
        {isStaff && <span className="staff-badge">Staff View</span>}
      </header>
      
      {orders.length === 0 ? (
        <div className="no-orders-message">
          <p>No payment records found.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Tax (8%)</th>
                <th>Total Due</th>
                <th>Status</th>
                {isStaff && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const tax = parseFloat(order.amount || 0) * taxRate;
                const totalDue = parseFloat(order.amount || 0) + tax;
                
                return (
                  <tr key={order.order_id}>
                    <td><span className="order-id">{order.order_id}</span></td>
                    <td>${parseFloat(order.amount || 0).toFixed(2)}</td>
                    <td>${tax.toFixed(2)}</td>
                    <td><strong>${totalDue.toFixed(2)}</strong></td>
                    <td>
                      <span className={getStatusBadgeClass(order.payment_status)}>
                        {order.payment_status}
                      </span>
                    </td>
                    {isStaff && (
                      <td className="action-cell">
                        <div className="status-update-control">
                          <select
                            value={newStatuses[order.order_id]}
                            onChange={(e) => setNewStatuses({
                              ...newStatuses,
                              [order.order_id]: e.target.value,
                            })}
                            className="status-select"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button 
                            onClick={() => handleStatusUpdate(order.order_id)}
                            className="update-button"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    )}
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentTracking;
