import jwt from 'jsonwebtoken';

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Assumes 'Bearer <token>' format

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; // Attach the user object to the request for future use
    next(); // Pass the control to the next middleware or route handler
  });
};

export default authenticateToken;
