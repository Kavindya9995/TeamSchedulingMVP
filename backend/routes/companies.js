const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// get company details (manager)
router.get('/me', auth, (req, res) => {
  const companyId = req.user.companyId;
  db.get('SELECT id, name, created_at FROM companies WHERE id = ?', [companyId], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(row);
  });
});

module.exports = router;
