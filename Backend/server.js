
import session from "express-session";
import env from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors"
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";


const app = express();
const port = 4000;
const saltRounds = 10;
const SECRET_KEY = "chh333";

env.config();



const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true,

}));

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
  res.send("");
});

app.get("/login", (req, res) => {
  res.send("");
});

app.get("/register", (req, res) => {
  res.send("");
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const bearerToken = authHeader.split(' '); 
    const token = bearerToken[1]; 

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); 
      }
      req.user = user.username;
      
      next(); 
    });
  } else {
    res.sendStatus(401); 
  }
};


const isStaff = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Check if the role in the token is 'staff' or 'admin'
    if (decoded.role !== 'staff' && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Only staff can access this route' });
    }

    req.user = decoded; // Attach user information to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const checkResult = await db.query("SELECT * FROM customer WHERE name = $1", [username]);
    
    if (checkResult.rows.length > 0) {
      res.json({ message: "exist" });
    } else {
      // Hash the password before storing it
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          res.status(500).json({ message: "Error" });
        } else {
          // Insert the new user into the database
          await db.query("INSERT INTO customer (name, password) VALUES ($1, $2)", [username, hash]);

          // Generate a JWT token upon successful registration
          const token = jwt.sign(
            { username, id: username }, // Payload to include in the token
            SECRET_KEY,                 // Secret key
            { expiresIn: "1h" }         // Token expiration (e.g., 1 hour)
          );

        
          res.json({ message: "success", token });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

app.post("/customer-login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM customer WHERE name = $1", [username]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      bcrypt.compare(password, storedHashedPassword, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send("Error");
        }

        if (isMatch) {
          const token = jwt.sign(
            { username: user.name, id: user.id }, // Payload to include in the token
            SECRET_KEY,                           // Secret key
            { expiresIn: "1h" }                   // Token expiration (e.g., 1 hour)
          );

       
          res.json({ token, message: "Login successful" });
        } else {
          res.json({ message: "Incorrect" });
        }
      });
    } else {
      res.json({ message: "No user found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});


    app.post('/update-order-status', async (req, res) => {
      const { orderId, status } = req.body;
    
      try {
  
        const result = await db.query(
          'UPDATE Order SET Status = $1 WHERE id = $2 RETURNING *',
          [status, orderId]
        );
    
        if (result.rowCount > 0) {
          res.json({ success: true, updatedOrder: result.rows[0] });
        } else {
          res.status(404).json({ success: false, message: 'Order not found' });
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });
  
    app.get('/get-tables', authenticateToken, async (req, res) => {
      const userId = req.user; 
      try {
        const tablesResult = await db.query('SELECT * FROM tables');
        const selectedTableResult = await db.query('SELECT table_id FROM tables WHERE selected_by_user = $1', [userId]);
    
        const tables = tablesResult.rows;
        const selectedTableId = selectedTableResult.rowCount > 0 ? selectedTableResult.rows[0].table_id : null;
    
        res.json({ tables, selectedTableId });
      } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });
    
    
    // Endpoint to update table status
    app.post('/update-table-status',authenticateToken, async (req, res) => {
      const { tableId, status } = req.body;
      const userId = req.user; 
      try {
        const result = await db.query(
          'UPDATE tables SET status = $1,selected_by_user = $2 WHERE table_id = $3 RETURNING *',
          [status, userId ,tableId]
        );
    
        if (result.rowCount > 0) {
          res.json({ success: true, message: 'Table status updated successfully' });
        } else {
          res.status(404).json({ success: false, message: 'Table not found' });
        }
      } catch (error) {
        console.error('Error updating table status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });


    app.post('/api/orders', authenticateToken, async (req, res) => {
      const { cartItems, totalAmount,tableId } = req.body;
      const userId = req.user; 

      try {
       
        const result = await db.query("SELECT customer_id FROM customer WHERE name = $1", [userId]);
        const userIdFromDb = result.rows[0].customer_id;
       
        
        const newOrder = await db.query(
         'INSERT INTO orders (customer_id, amount, status ,table_id,payment_status) VALUES ($1, $2, $3,$4,$5) RETURNING *',
          [userIdFromDb, totalAmount, 'pending',tableId,'pending']
        );
        const orderId = newOrder.rows[0].order_id;

      
        for (const item of cartItems) {
          try {
            await db.query(
              'INSERT INTO order_items (order_id, name, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
              [orderId, item.name, item.quantity, item.price]
            );
          } catch (error) {
            console.error(`Error inserting order item: ${error}`);
            
          }
        }
        
        res.status(200).json({ message: 'Order placed successfully', orderId });
      } catch (error) {
        res.status(500).json({ message: 'Error placing the order', error });
      }
    });



    app.get('/api/yourorder', authenticateToken, async (req, res) => {
      const userId = req.user;
    
      try {
        // Get customer_id
        const result = await db.query("SELECT customer_id FROM customer WHERE name = $1", [userId]);
        const customerId = result.rows[0]?.customer_id;
    
        if (!customerId) {
          return res.status(404).json({ message: 'Customer not found' });
        }
    
        // Get all order items across all orders for this customer
        const orders = await db.query(`
          SELECT 
            o.order_id,
            o.table_id,
            o.amount,
            o.status,
            oi.name,
            oi.quantity,
            oi.price
          FROM orders o
          JOIN order_items oi ON o.order_id = oi.order_id
          WHERE o.customer_id = $1
          ORDER BY o.order_id DESC
        `, [customerId]);
    
        res.json({ items: orders.rows });
      } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ message: 'Error fetching order items' });
      }
    });
    

    app.get('/api/pyourorder', authenticateToken, async (req, res) => {
      const userId = req.user;
      try {
        const result = await db.query("SELECT * FROM customer WHERE name = $1", [userId]);
        const userIdFromDb = result.rows[0].customer_id;

        const orders = await db.query("SELECT * FROM orders WHERE customer_id = $1", [userIdFromDb]);
 
        res.json({ items: orders.rows });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching order' });
      }
    });
   
    
app.get('/api/orderslist', authenticateToken, async (req, res) => {
  try {
    const ordersWithItems = await db.query(`
      SELECT 
        o.order_id, o.table_id, o.amount, o.status,
        json_agg(json_build_object('name', oi.name, 'quantity', oi.quantity, 'price', oi.price)) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      GROUP BY o.order_id
      ORDER BY o.order_id DESC
    `);

    res.status(200).json(ordersWithItems.rows);
  } catch (error) {
    console.error('Error fetching orders with items:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});


    app.get('/api/pmorders', authenticateToken, async (req, res) => {
      try {
        const userRole = req.user; // Assuming req.user contains the decoded JWT with role info
    
        let result;
 
          result = await db.query("SELECT * FROM orders");
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No orders found' });
        }
   
        res.json({ items: result.rows });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
    });
    

app.post('/staff-login', async (req, res) => {
  const { username, password } = req.body;

  try {

    const result = await db.query('SELECT * FROM staff WHERE name = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const staff = result.rows[0];
    

    const validPassword = await bcrypt.compare(password, staff.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }


    const token = jwt.sign({ id: staff.id, role: staff.role }, SECRET_KEY,{ expiresIn: "1h" });
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



app.put('/api/orders/:orderId/status', isStaff, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    if (status === 'Completed') {
      await db.query(
        'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *',
        [status, orderId]
      );
      return res.json({ message: 'Order marked as completed' });
    }
    

    // Update other statuses
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *', 
      [status, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/api/orders/:orderId/payment-status', isStaff, async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body;

  try {
    const result = await db.query(
      'UPDATE orders SET payment_status = $1 WHERE order_id = $2 RETURNING *',
      [paymentStatus, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/staff-register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if the staff member already exists
    const staffExist = await db.query('SELECT * FROM staff WHERE name = $1', [username]);

    if (staffExist.rows.length > 0) {
      return res.json({ message: 'exist' }); // Conflict: staff already exists
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new staff member into the database
    const newStaff = await db.query(
      'INSERT INTO staff (name, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );

    // Generate a token
    const token = jwt.sign({ id: newStaff.rows[0].id, role: newStaff.rows[0].role }, SECRET_KEY,  { expiresIn: "1h" }  );

    // Return success message and token
    return res.status(201).json({ message: 'success', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});




passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
