const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');



const SECRET_KEY = process.env.JWT_SECRET || 'secret-key'; // Folosește o cheie secretă din variabilele de mediu

const signup = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: 'Email in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) =>{
    
        const { email, password } = req.body;
      
        // Caută utilizatorul după email
        const user = await User.findOne({ email });
        
        if (!user) {
          return res.status(401).json({ message: 'Email or password is wrong' });
        }
      
        // Compară parola primită cu cea hash-ată din baza de date
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
          return res.status(401).json({ message: 'Email or password is wrong' });
        }
      
        // Generează token JWT
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        
        // Salvează token-ul în baza de date pentru utilizatorul curent
        user.token = token;
        await user.save();
      
        res.status(200).json({
          token,
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        });
      

};

const logout = async (req, res) => {
    const userId = req.user._id;
  

    await User.findByIdAndUpdate(userId, { token: null });
  
    res.status(204).send(); 
  };
  

 
const getCurrentUser = async (req, res) => {
    const { email, subscription } = req.user;
  
    res.status(200).json({
      email,
      subscription,
    });
  };
  

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
};
