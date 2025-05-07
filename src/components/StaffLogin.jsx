import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../styles/Login.css';

function StaffLogin({ userType }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Corrected history to navigate

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username && password) {
      navigate('/dashboard');
    }
  };

  async function submit(e) {   
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/staff-login", {
        username, password
      })
      .then(res => {
        if (res.data.token) {   // Assuming the server responds with a token
          const token = res.data.token;

          
          localStorage.setItem('token', token);

          
          navigate("/dashboard", { state: { id: username } });

          console.log("Login successful, token stored.");
        } 
         else if (res.data === "Incorrect") {
          alert("Incorrect username or password");
        }
      })
      .catch(e => {
        alert("Login failed");
        console.log(e);
      });
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Staff Login</h2>
        <form>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" onClick={submit}>Login</button>
        </form>
        <div className="login-links">
          <p>Don't have an account? <Link to="/staff-register">Register here</Link></p>
          
        </div>
      </div>
    </div>
  );
}

export default StaffLogin;
