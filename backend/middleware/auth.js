const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev_secret';
module.exports = function(req,res,next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({error:'No token'});
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({error:'Bad token'});
  const token = parts[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({error:'Invalid token'});
    req.user = decoded;
    next();
  });
};
