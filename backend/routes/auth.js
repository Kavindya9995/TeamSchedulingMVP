const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev_secret';

// register a company + admin user
router.post('/register', async (req, res) => {
  const { companyName, name, email, password } = req.body;
  if(!companyName || !name || !email || !password) return res.status(400).json({error:'Missing fields'});
  try {
    db.run('INSERT INTO companies (name) VALUES (?)', [companyName], function(err) {
      if (err) return res.status(500).json({error: err.message});
      const companyId = this.lastID;
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({error: err.message});
        db.run('INSERT INTO users (company_id, name, email, password, role) VALUES (?,?,?,?,?)',
          [companyId, name, email, hash, 'manager'],
          function(err) {
            if (err) return res.status(500).json({error: err.message});
            const userId = this.lastID;
            const token = jwt.sign({ id: userId, companyId, role: 'manager' }, SECRET, {expiresIn:'7d'});
            res.json({ token });
          });
      });
    });
  } catch(e) {
    res.status(500).json({error: e.message});
  }
});

// login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({error: err.message});
    if (!user) return res.status(400).json({error: 'Invalid credentials'});
    bcrypt.compare(password, user.password, (err, same) => {
      if (err) return res.status(500).json({error: err.message});
      if (!same) return res.status(400).json({error: 'Invalid credentials'});
      const token = jwt.sign({ id: user.id, companyId: user.company_id, role: user.role }, SECRET, {expiresIn:'7d'});
      res.json({ token, role: user.role, name: user.name });
    });
  });
});

module.exports = router;
