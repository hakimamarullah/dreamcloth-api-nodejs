const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth')
dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Connection successfull'))
  .catch((err) => console.log(err));

app.use(express.json())
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
