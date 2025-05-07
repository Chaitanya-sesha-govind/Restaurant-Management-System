import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../styles/Login.css';

function Login({ userType }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username && password) {
      localStorage.removeItem('selectedTableId');
      navigate('/dashboard');
    }
  };

  async function submit(e) {   
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/customer-login", {
        username, password
      })
      .then(res => {
        if (res.data.token) {   
          const token = res.data.token;

          localStorage.setItem('token', token);
          localStorage.removeItem('selectedTableId');
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

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{userType} Login</h2>
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
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          
        </div>
      </div>
    </div>
  );
}

export default Login;
