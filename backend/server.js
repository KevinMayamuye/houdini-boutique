import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import servicesRoutes from './routes/services.js';
import bookingsRoutes from './routes/bookings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Connection options for MongoDB Atlas
// Note: mongodb+srv:// automatically handles TLS/SSL
// For Node.js 22.x compatibility, we use minimal options
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // Increased timeout for initial connection
  socketTimeoutMS: 45000,
  // Additional options for reliability
  retryWrites: true,
  w: 'majority',
};

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Make sure your MongoDB Atlas connection string is correct and your IP is whitelisted.');
    }
    // Handle SSL/TLS errors
    if (error.message.includes('SSL') || error.message.includes('TLS') || error.message.includes('tlsv1')) {
      console.error('\n⚠️  SSL/TLS connection error detected.');
      console.error('This is often a Node.js version compatibility issue with OpenSSL.\n');
      console.error('Troubleshooting steps:');
      console.error('1. Check Node.js version: node --version');
      console.error('   - Recommended: Node.js 18.x LTS or 20.x LTS');
      console.error('   - Node.js 22.x may have OpenSSL compatibility issues\n');
      console.error('2. Verify MongoDB Atlas connection string:');
      console.error('   - Should start with: mongodb+srv://');
      console.error('   - Format: mongodb+srv://username:password@cluster.mongodb.net/database\n');
      console.error('3. Check MongoDB Atlas Network Access:');
      console.error('   - Ensure your IP is whitelisted (or use 0.0.0.0/0 for development)\n');
      console.error('4. Try updating mongoose:');
      console.error('   - npm install mongoose@latest\n');
      console.error('Retrying connection with minimal options...\n');
      
      // Try once more with absolute minimal options
      setTimeout(() => {
        mongoose.connect(MONGODB_URI, {
          serverSelectionTimeoutMS: 30000,
        }).then(() => {
          console.log('✅ Connected to MongoDB Atlas (retry successful)');
        }).catch(err => {
          console.error('❌ Retry failed:', err.message);
          console.error('\nIf the issue persists, consider:');
          console.error('- Using Node.js 18.x or 20.x instead of 22.x');
          console.error('- Checking your network/firewall settings');
          console.error('- Verifying MongoDB Atlas cluster is running');
          process.exit(1);
        });
      }, 3000);
    } else {
      process.exit(1);
    }
  });

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Routes
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

