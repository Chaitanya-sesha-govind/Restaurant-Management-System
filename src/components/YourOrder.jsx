import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/YourOrder.css';



const YourOrder = () => {
  const [order, setOrder] = useState({
    items: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        };

        const response = await axios.get('http://localhost:4000/api/yourorder', config);
        if (response.status === 200) {

          setOrder(response.data);
        } else {
          throw new Error(`API endpoint error: ${response.status}`);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchOrder();
  }, []);
  

  return (
    <div className="order-container">
      <h2 className="order-title">Your Order</h2>
      {order.items.length === 0 ? (
        <p className="no-order-message">You haven't placed any order yet.</p>
      ) : (
        <ul className="order-list">
          {order.items.map((item, index) => (
            <li key={index} className="order-item">
              <p className="item-name">Item: {item.name}</p>
              <p className="item-quantity">Quantity: {item.quantity}</p>
              <p className="item-price">Price: {item.price}</p>
              <p className="item-name">Status: {item.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourOrder;