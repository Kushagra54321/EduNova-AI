const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars FIRST before anything else that might use them
dotenv.config();

const mongoose = require('mongoose');
const aiRoutes = require('./routes/aiRoute');
const authRoutes = require('./routes/authRoute');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'EduNova AI Backend Server is running!' });
});

const PORT = process.env.PORT || 5000; // Database Connection & Server Start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  });
