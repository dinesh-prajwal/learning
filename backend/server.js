const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Username/Password Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // TODO: Implement your actual authentication logic here
    // This is a placeholder - you should:
    // 1. Check if user exists in database
    // 2. Verify password (use bcrypt or similar)
    // 3. Generate JWT token
    // 4. Return user info and token

    // Example placeholder logic (replace with real authentication):
    // const user = await User.findOne({ username });
    // if (!user) {
    //   return res.status(401).json({ success: false, message: 'Invalid credentials' });
    // }
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({ success: false, message: 'Invalid credentials' });
    // }

    // For now, return a placeholder response
    // In production, replace this with actual database lookup and password verification
    const appToken = jwt.sign(
      { username, userId: 'placeholder-id' },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        id: 'placeholder-id',
        username: username,
        name: username, // You can get this from database
      },
      token: appToken,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// Google Login Endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required',
      });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: userId, email, name, picture } = payload;

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Generate a JWT token for your app
    // 4. Return user info and token

    // For now, we'll generate a simple JWT token
    const appToken = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    // Return success response
    res.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        picture,
      },
      token: appToken,
      message: 'Google login successful',
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid Google token or authentication failed',
      error: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
