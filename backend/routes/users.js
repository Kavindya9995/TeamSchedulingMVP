const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

// list users for company
router.get('/', auth, (req,res)=>{
  db.all('SELECT id, name, email, role FROM users WHERE company_id = ?', [req.user.companyId], (err, rows)=>{
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// create user (manager only)
router.post('/', auth, (req,res)=>{
  if (req.user.role !== 'manager') return res.status(403).json({error:'Forbidden'});
  const { name, email, password, role } = req.body;
  bcrypt.hash(password || 'changeme', 10, (err, hash)=>{
    if (err) return res.status(500).json({error: err.message});
    db.run('INSERT INTO users (company_id, name, email, password, role) VALUES (?,?,?,?,?)',
      [req.user.companyId, name, email, hash, role || 'employee'],
      function(err){
        if (err) return res.status(500).json({error: err.message});
        res.json({ id: this.lastID, name, email, role: role || 'employee' });
      });
  });
});

module.exports = router;
