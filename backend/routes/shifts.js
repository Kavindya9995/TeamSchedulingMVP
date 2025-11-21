const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// create shift (manager)
router.post('/', auth, (req,res) => {
  if (req.user.role !== 'manager') return res.status(403).json({error:'Forbidden'});
  const { title, start, end, assigned_user_id } = req.body;
  db.run('INSERT INTO shifts (company_id, title, start, end, assigned_user_id) VALUES (?,?,?,?,?)',
    [req.user.companyId, title, start, end, assigned_user_id || null],
    function(err){
      if (err) return res.status(500).json({error: err.message});
      res.json({ id: this.lastID, title, start, end, assigned_user_id });
    });
});

// list shifts for company
router.get('/', auth, (req,res)=>{
  db.all('SELECT * FROM shifts WHERE company_id = ?', [req.user.companyId], (err, rows)=>{
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// employee clock in / out
router.post('/:id/clock', auth, (req,res)=>{
  const shiftId = req.params.id;
  const { action } = req.body; // 'in' or 'out'
  if (action === 'in') {
    db.run('INSERT INTO time_entries (shift_id, user_id, clock_in) VALUES (?,?,datetime("now"))',
      [shiftId, req.user.id], function(err){
        if (err) return res.status(500).json({error: err.message});
        res.json({ id: this.lastID });
      });
  } else if (action === 'out') {
    db.get('SELECT * FROM time_entries WHERE shift_id = ? AND user_id = ? AND clock_out IS NULL ORDER BY id DESC LIMIT 1',
      [shiftId, req.user.id], (err, row) => {
        if (err) return res.status(500).json({error: err.message});
        if (!row) return res.status(400).json({error:'No active clock-in found'});
        db.run('UPDATE time_entries SET clock_out = datetime("now") WHERE id = ?', [row.id], function(err){
          if (err) return res.status(500).json({error: err.message});
          res.json({ updated: this.changes });
        });
      });
  } else {
    res.status(400).json({error:'Invalid action'});
  }
});

module.exports = router;
