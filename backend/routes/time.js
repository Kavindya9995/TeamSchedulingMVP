const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all time entries
router.get('/', (req, res) => {
  const sql = `SELECT * FROM time_entries`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
