const jwt = require('jsonwebtoken');
const User = require('../models/users');
const secret = process.env.SECRET_WORD || 'defaultSecret';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Bearer token
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user; // Atașează user-ul la request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = auth;
