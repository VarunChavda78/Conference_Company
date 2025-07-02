const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a real database)
let bookings = [];
let users = [
  {
    id: '1',
    username: 'SrashtaSoft',
    password: '$2a$10$OyUUBjvhlV.1e/oq2MXtG.3dASabYSmaHhiBXzXdtPbzH5FecL9Qy', // "conf@123" hashed
    isOwner: true
  }
];

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isOwner: user.isOwner },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isOwner: user.isOwner
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Booking routes
app.get('/api/bookings', (req, res) => {
  const { date } = req.query;
  
  if (date) {
    const filteredBookings = bookings.filter(booking => booking.date === date);
    res.json(filteredBookings);
  } else {
    res.json(bookings);
  }
});

app.get('/api/bookings/date/:date', (req, res) => {
  const { date } = req.params;
  const filteredBookings = bookings.filter(booking => booking.date === date);
  res.json(filteredBookings);
});

app.post('/api/bookings', authenticateToken, (req, res) => {
  try {
    const bookingData = req.body;
    const newBooking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/bookings/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    bookings[bookingIndex] = { ...bookings[bookingIndex], ...updatedData };
    res.json(bookings[bookingIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    bookings.splice(bookingIndex, 1);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Conference Room Booking API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 