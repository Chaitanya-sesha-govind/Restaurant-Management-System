import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const [currentText, setCurrentText] = useState({ text: 'Book table', icon: '🍽️' });
  const options = [
    { text: 'Book table', icon: '🍽️' },
    { text: 'View order', icon: '🧾' },
    { text: 'Track payment', icon: '💳' }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navbar toggle state
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % options.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [options.length]);

  useEffect(() => {
    setCurrentText(options[currentIndex]);
  }, [currentIndex, options]);

  // Close navbar when clicking a link (optional for better UX)
  const handleNavLinkClick = () => setIsNavOpen(false);

  return (
    <div id="root">
      <nav className="navbar">
        <div className="navbar-logo">🍽️ Taste on go</div>
        <ul className={`navbar-links ${isNavOpen ? 'open' : ''}`}>
          <li><a href="/" onClick={handleNavLinkClick}>Home</a></li>
          <li><a href="/about" onClick={handleNavLinkClick}>About</a></li>
        </ul>
        <div
          className={`navbar-toggle${isNavOpen ? ' open' : ''}`}
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle navigation"
          tabIndex={0}
          role="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      <div className="container">
        <div className="left-half">
          <div className="title-container">
            <div className='htitle'>
              <h1>Restaurant Management System</h1>
            </div>
            {/* Animated Feature Box */}
            <div className="animated-square-box">
              <div className="square-content">
                <p className="emoji-text">
                  <span className="emoji">{currentText.icon}</span> {currentText.text}
                </p>
                <div className="indicators">
                  {options.map((_, idx) => (
                    <span
                      key={idx}
                      className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-half">
          <div className="buttons-container">
            <Link to="/customer-login">
              <button>Customer Login</button>
            </Link>
            <Link to="/register">
              <button>Customer Register</button>
            </Link>
            <Link to="/staff-login">
              <button>Staff Login</button>
            </Link>
            <Link to="/staff-register">
              <button>Staff Register</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
