const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./lib/db');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

require('./lib/passport');

require('dotenv').config();

const authRoutes = require('./routes/auth.route');
const categoryRoutes = require('./routes/category.route');
const projectRoutes = require('./routes/projects.route');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(fileUpload({
  useTempFiles: true,
}));

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get('/api', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/project', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
