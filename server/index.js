const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./lib/db');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// Passport config
require('./lib/passport');

const authRoutes = require('./routes/auth.route');
const categoryRoutes = require('./routes/category.route');
const projectRoutes = require('./routes/projects.route');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(fileUpload());

const allowedOrigins = [
  'https://proshelf.vercel.app/'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/projects', projectRoutes);

// Production static serving (if hosting frontend together)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// DB connect + start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB', err);
    process.exit(1);
  });




// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '.env') });

// const { connectDB } = require('./lib/db');
// const express = require('express');
// const passport = require('passport');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const fileUpload = require('express-fileupload');

// require('./lib/passport');

// require('dotenv').config();

// const authRoutes = require('./routes/auth.route');
// const categoryRoutes = require('./routes/category.route');
// const projectRoutes = require('./routes/projects.route');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(fileUpload());

// app.use(cors({
//   origin: 'http://localhost:5173', 
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));


// app.use(express.json());
// app.use(cookieParser());
// app.use(passport.initialize());

// app.get('/api', (req, res) => {
//   res.json({ message: "Hello from the backend!" });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/category', categoryRoutes);
// app.use('/api/projects', projectRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   connectDB();
// });

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
//   });
// }
