const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config;
const morgan = require('morgan');

const cors = require('cors');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const checkoutRoutes = require('./routes/stripe');

const PORT = process.env.PORT || 5000;

const whitelist = [
  'https://dreamcloth.netlify.app',
  'https://dreamcloth-dev.netlify.app',
  'http://localhost:8000',
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback('NOT ALLOWED BY CORS');
      }
    },
  })
);
app.use(morgan('tiny'));
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/checkout', checkoutRoutes);


mongoose.connection.on('connected', () => {
  console.log('Connection successfull');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on('error', () => console.log(err));
mongoose.connection.on('disconnected', () =>
  console.log('Database has been disconnected...')
);

process.stdin.resume();
const closeDatabaseConnection = () => {
  mongoose.connection.close(() => {
    console.warn('Database connection closed!');
    process.exit(0);

  });
};

process
  .on('SIGINT', closeDatabaseConnection)
  .on('SIGTERM', closeDatabaseConnection)
  .on('beforeExit', closeDatabaseConnection);


try {
  mongoose.connect(process.env.DATABASE_URL);
} catch (err) {
  console.log(err.message);
}
