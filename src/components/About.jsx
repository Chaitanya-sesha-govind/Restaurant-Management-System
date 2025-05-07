import React from "react";
import "../styles/About.css";

function About() {
  return (
    <div className="about-page-container">
      <header className="header" style={{ top: 0, zIndex: 1000 }}>
        <p>About Taste on Go – Your Premium Dining Experience</p>
      </header>

      <main className="about-main-content">
        <section className="about-intro">
          <h1 className="about-title">Why Choose Taste on Go?</h1>
        </section>
        <section className="about-story">
  <h2>🍷 Our Story</h2>
  <p>
    Taste on Go was born out of a passion for fine dining and seamless technology. Our mission is to bring luxurious restaurant experiences to your fingertips—whether you're a guest looking for flavor or a team ensuring excellence.
  </p>
</section>

        <section className="about-features-grid">
          <div className="card glass-card">
            <h2>🍽️ Book Your Table</h2>
            <p>
              Reserve your favorite spot in seconds.
            </p>
          </div>
          <div className="card glass-card">
            <h2>📦 Track Your Orders</h2>
            <p>
              See what you've ordered, what's in progress, and what's been delivered. Everything is just a tap away.
            </p>
          </div>
          <div className="card glass-card">
            <h2>💳 Payment Status</h2>
            <p>
              Get real-time updates on your payments.
            </p>
          </div>
          <div className="card glass-card staff-card">
            <h2>🧑‍🍳 Staff Dashboard</h2>
            <p>
              Monitor orders, and verify payments in one unified dashboard—crafted for speed and accuracy.
            </p>
            </div>
            <div className="card glass-card staff-card">
            <h2>🧑‍🍳 Update orders</h2>
            <p>
             Easily monitor, verify, and update the preparation status of every order in real time, ensuring timely service.
            </p>
            </div>
            <div className="card glass-card staff-card">
            <h2>🧑‍🍳 Staff view payments</h2>
            <p>
             Easily track, verify, and update payment statuses for every order.
            </p>
          </div>
        </section>
        <section className="about-testimonials">
  <h2>🌟 What Our Users Say</h2>
  <div className="testimonial-card">
    <p>“Taste on Go completely changed how I dine out. Easy tracking of my order.”</p>
    <h4>- John, Customer</h4>
  </div>
  <div className="testimonial-card">
    <p>“Managing the floor has never been easier. We see orders and payments in real-time.”</p>
    <h4>- Aman, Restaurant Staff</h4>
  </div>
</section>
<section className="about-cta">
  <h2>🤝 Join the Movement</h2>
  <p>
    Want to join us.Taste on Go welcomes you.
  </p>
  <p className="email-contact">
  Email – tastongo123@tog.com
</p>

  
  
</section>

      </main>
    </div>
  );
}

export default About;
