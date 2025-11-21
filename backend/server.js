const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const shiftsRoutes = require('./routes/shifts');
const companiesRoutes = require('./routes/companies');
const timeRoutes = require('./routes/time');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/shifts', shiftsRoutes);
app.use('/api/time', timeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> {
  console.log('Server running on port', PORT);
});
