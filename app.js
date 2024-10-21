const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
require('dotenv').config();
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const guestRoutes = require('./routes/indexRoutes'); 

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//static folder setup
app.use(express.static(path.join(__dirname, 'public')));

//view engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

//session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

//mongo connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

//routes
app.get('/', (req, res) => {
  res.render('home', { title: 'Home', isLoggedIn: false  });
});
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', guestRoutes);

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});