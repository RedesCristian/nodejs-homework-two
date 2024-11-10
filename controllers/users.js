const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const gravatar = require('gravatar');
const { v4: uuidv4 } = require('uuid');
const { sendVerificationEmail } = require('../services/emailService');




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

  // Functia pentru integrare Gravatar

  const uploadAvatar = (req, res) =>{
    const email = req.body.email;
    let avatarUrl;

    if(req.file){
      avatarUrl = `/public/avatars/${req.file.filename}`;
    }else{
      avatarUrl = gravatar.url(email,{s: '200', r: 'pg', d: 'retro'});
    }

    res.json({
      message:'Avatar updated successfully',
      avatarUrl:avatarUrl
    });
  }
  const verifyUser = async (req, res) => {
    const { verificationToken } = req.params;

    try {
        const user = await User.findOne({ verificationToken });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.verify = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const verificationToken = uuidv4();
      const user = new User({
          email,
          password,
          verificationToken,
      });

      await user.save();

      await sendVerificationEmail(email, verificationToken);

      res.status(201).json({ message: 'User registered. Check your email to verify your account.' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};
const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: 'missing required field email' });
  }

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (user.verify) {
          return res.status(400).json({ message: 'Verification has already been passed' });
      }

      await sendVerificationEmail(user.email, user.verificationToken);
      res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  uploadAvatar,
  verifyUser,
  registerUser,
  resendVerificationEmail
};
