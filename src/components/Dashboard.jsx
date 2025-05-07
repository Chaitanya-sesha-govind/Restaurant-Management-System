import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
import Tables from './Tables';
import Orders from './Orders';
import YourOrder from './YourOrder';
import PaymentTracking from './PaymentTracking';
import CartPage from './CartPage';
import Dashboard1 from './Dashboard1';
import '../styles/Dashboard.css';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard1');
  const [cart, setCart] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decoded.role);
    }
  }, []);

  useEffect(() => {
    const savedTableId = localStorage.getItem('selectedTableId');
    const savedCart = JSON.parse(localStorage.getItem('cart'));

    if (userRole !== 'staff' && savedTableId) {
      setSelectedTableId(Number(savedTableId));
    } else {
      setSelectedTableId(null); 
    }
    if (savedCart) setCart(savedCart);
  }, []);

  useEffect(() => {
    if (selectedTableId !== null) {
      localStorage.setItem('selectedTableId', selectedTableId);
    }
  }, [selectedTableId]);

  useEffect(() => {
    if (userRole !== 'staff' && selectedTableId !== null) {
      localStorage.setItem('selectedTableId', selectedTableId);
    }
  }, [selectedTableId, userRole]);
  

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleRemoveFromCart = (menuItem) => {
    setCart((prevCart) => {
      const itemInCart = prevCart.find((item) => item.id === menuItem.id);
      if (!itemInCart) return prevCart;
      if (itemInCart.quantity === 1) {
        return prevCart.filter((item) => item.id !== menuItem.id);
      } else {
        return prevCart.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('selectedTableId');
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'menu':
        return (
          <Menu
            cart={cart}
            setCart={setCart}
            handleRemoveFromCart={handleRemoveFromCart}
            selectedTableId={selectedTableId}
          />
        );
      case 'tables':
        return (
          <Tables
            selectedTableId={selectedTableId}
            setSelectedTableId={setSelectedTableId}
          />
        );
      case 'orders':
        return <Orders />;
      case 'payment':
        return <PaymentTracking />;
      case 'yourorder':
        return <YourOrder cart={cart} />;
      case 'cart':
        return (
          <CartPage
            cart={cart}
            setCart={setCart}
            handleRemoveFromCart={handleRemoveFromCart}
            toggleCartPage={() => setActiveSection('menu')}
            selectedTableId={selectedTableId}
          />
        );
      default:
        return <Dashboard1 setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>Restaurant Dashboard</h2>
        <ul>
          <li onClick={() => setActiveSection('dashboard1')}>Dashboard</li>
          <li onClick={() => setActiveSection('menu')}>Menu</li>
          <li onClick={() => setActiveSection('tables')}>Tables</li>
          {userRole === 'staff' && (
    <li onClick={() => setActiveSection('orders')}>Orders</li>
  )}

  {userRole != 'staff' && (
    <li onClick={() => setActiveSection('yourorder')}>Your Order</li>
  )}
 
          <li onClick={() => setActiveSection('cart')}>Cart</li>
          <li onClick={() => setActiveSection('payment')}> Payment Tracking</li>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </ul>
      </nav>
      <main className="dashboard-main">{renderSection()}</main>
    </div>
  );
}

export default Dashboard;
