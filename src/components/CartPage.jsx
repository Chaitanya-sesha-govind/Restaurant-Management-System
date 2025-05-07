import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CartPage.css';
import YourOrder from './YourOrder';

function CartPage({ cart, setCart, handleRemoveFromCart, toggleCartPage, selectedTableId }) {
  const [showOrderPage, setShowOrderPage] = useState(false);
  const [userRole, setUserRole] = useState('');
  
  // Get user role from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decoded.role);
    }
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart && savedCart.length !== cart.length) {
      setCart(savedCart);
    }
    // eslint-disable-next-line
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
    } else if (!selectedTableId) {
      alert('Please select a table before placing an order.');
    } else {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          'http://localhost:4000/api/orders',
          {
            cartItems: cart,
            totalAmount: getTotalPrice(),
            tableId: selectedTableId,
          },
          config
        );

        if (response.status === 200) {
          alert('Order placed successfully!');
          setShowOrderPage(true);
          localStorage.removeItem('cart');
          setCart([]);
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place the order. Please try again.');
      }
    }
  };

  // Redirect staff users
  if (userRole === 'staff') {
    return (
      <div className="cart-page-container">
        <div className="access-denied">
          <h2>Staff Access Restricted</h2>
          <p>Staff members cannot place orders. Please log in as a customer.</p>
          <button onClick={toggleCartPage} className="back-to-menu-button">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {showOrderPage ? (
        <YourOrder cart={cart} />
      ) : (
        <div>
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul className="cart-items-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>Price: ${item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-summary">
                <h3>Total Price: ${getTotalPrice()}</h3>
                <button className="checkout-button" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
          <button onClick={toggleCartPage} className="back-to-menu-button">
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
