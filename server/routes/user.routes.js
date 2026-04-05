const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const User = require('../models/user.model'); // ✅ FIXED MODEL NAME

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

const multer = require('../config/multer');
const upload = multer;

require('dotenv').config();

function redirectAuthError(res, path, message) {
  return res.redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token)
    return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ error: 'Invalid token' });

    req.user = decoded;
    next();
  });
}

router.get('/files', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const { data, error } = await supabase
      .storage
      .from('drive')
      .list(`uploads/${userId}`);

    if (error) throw error;

    res.json({ files: data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/* ================= REGISTER ================= */

router.get('/register', (req, res) => {
  res.render('register.ejs');
});


// router.post(
//   '/register',

//   body('email').trim().isEmail(),
//   body('password').trim().isLength({ min: 5 }),
//   body('username').trim().isLength({ min: 3 }),

//   async (req, res) => {

//     console.log("Incoming Register Data:", req.body); // 🔍 DEBUG

//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return redirectAuthError(
//         res,
//         '/user/register',
//         'Please check your email, username, and password.'
//       );
//     }

//     const { email, username, password } = req.body;

//     if (mongoose.connection.readyState !== 1) {

//       console.error(
//         'MongoDB NOT connected. readyState=',
//         mongoose.connection.readyState
//       );

//       return redirectAuthError(
//         res,
//         '/user/register',
//         'Database unavailable.'
//       );
//     }

//     if (!process.env.JWT_SECRET) {
//       return redirectAuthError(
//         res,
//         '/user/register',
//         'JWT_SECRET missing.'
//       );
//     }

//     try {

//       /* HASH PASSWORD */
//       const hashPass = await bcrypt.hash(password, 10);

//       /* SAVE USER TO MONGODB */
//       const newUser = await User.create({
//         email,
//         username,
//         password: hashPass
//       });

//       console.log("User Saved To MongoDB:", newUser); // 🔍 DEBUG

//       /* SUPABASE SIGNUP (Optional) */

//       try {

//         const { error: supaErr } =
//           await supabase.auth.signUp({
//             email,
//             password,
//             options: { data: { username } }
//           });

//         if (supaErr) {
//           console.error(
//             'Supabase signUp error:',
//             supaErr.message
//           );
//         }

//       } catch (supaEx) {
//         console.error(
//           'Supabase exception:',
//           supaEx.message || supaEx
//         );
//       }

//       /* JWT TOKEN */

//       const token = jwt.sign(
//         {
//           userId: newUser._id,
//           email: newUser.email
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: '1d' }
//       );

//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: 'lax',
//       });

//       res.redirect('/home');

//     }

//     catch (err) {

//       console.error('Register error:', err);

//       const msg =
//         err.code === 11000
//           ? 'Email or username already exists.'
//           : (err.message || 'Registration failed.');

//       return redirectAuthError(
//         res,
//         '/user/register',
//         msg
//       );
//     }

//   }
// );

router.post('/register', async (req,res)=>{

  console.log("REGISTER ROUTE HIT"); // 🔥 ADD THIS
  console.log("BODY:", req.body); // 🔥 ADD THIS
  
  const {email,username,password} = req.body;
  
  try {
  
  const hashPass = await bcrypt.hash(password,10);
  
  const newUser = await User.create({
      email,
      username,
      password: hashPass
  });
  
  console.log("USER SAVED:", newUser); // 🔥 ADD THIS
  
  res.redirect('/home');
  
  } catch (err) {
  
  console.error("REGISTER ERROR:", err); // 🔥 ADD THIS
  
  res.send("Error saving user");
  
  }
  
  });

/* ================= LOGIN ================= */

router.get('/login', (req, res) => {
  res.render('login.ejs');
});


router.post(
  '/login',

  body('username').trim().isLength({ min: 3 }),
  body('password').trim().isLength({ min: 5 }),

  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return redirectAuthError(
        res,
        '/user/login',
        'Invalid username or password.'
      );
    }

    const { username, password } = req.body;

    try {

      const user = await User.findOne({
        username: username
      });

      console.log("User Found:", user);

      if (!user) {
        return redirectAuthError(
          res,
          '/user/login',
          'Username or password incorrect.'
        );
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {
        return redirectAuthError(
          res,
          '/user/login',
          'Username or password incorrect.'
        );
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username
        },
        process.env.JWT_SECRET
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      res.redirect('/home');

    }

    catch (err) {

      console.error("Login error:", err);

      return redirectAuthError(
        res,
        '/user/login',
        'Login failed.'
      );
    }

  }
);



module.exports = router;