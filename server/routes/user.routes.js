const express=require('express');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const userModel=require('../models/user.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const supabase = require('../supabase');
const multer= require('../config/multer');
const upload=multer;

require('dotenv').config();

const jwtt = require('jsonwebtoken');

function redirectAuthError(res, path, message) {
  return res.redirect(`${path}?error=${encodeURIComponent(message)}`);
}


function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwtt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded; // ✅ Now req.user.id is available
    next();
  });
}

router.get('/files', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ comes from decoded JWT
    const { data, error } = await supabase
      .storage
      .from('drive')
      .list(`uploads/${userId}`); // ✅ folder named after user

    if (error) throw error;
    res.json({ files: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.get('/register',(req,res)=>{
    res.render('register.ejs');
     
})

router.post('/register',
    body('email').trim().isEmail().isLength({min:13}),
    body('password').trim().isLength({min:5}),
    body('username').trim().isLength({min:3}),
    async (req,res)=>{

    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return redirectAuthError(res, '/user/register', 'Please check your email, username, and password.');
    }
    const{email,username,password}=req.body;

    try {
    const hashPass=await bcrypt.hash(password,10)
    const newUser= await userModel.create({
        email,username,password:hashPass
    })
    await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

const token = jwt.sign(
  { userId: newUser._id, email: newUser.email }, // Include user ID
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

     res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
    });
    res.redirect('/home');
    } catch (err) {
      console.error(err);
      const msg = err.code === 11000
        ? 'That email or username is already registered.'
        : (err.message || 'Registration failed. Please try again.');
      return redirectAuthError(res, '/user/register', msg);
    }


})


router.get('/login',(req,res)=>{
    res.render('login.ejs')
})

router.post('/login',
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),
    async (req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return redirectAuthError(res, '/user/login', 'Please enter a valid username and password.');
        }
        const {username,password}=req.body;
        const user=await userModel.findOne({
            username: username
        })
        console.log(user);
       if(!user){
        return redirectAuthError(res, '/user/login', 'Username or password is incorrect.');
       }
       const isMatch=await bcrypt.compare(password,user.password)
       if(!isMatch){
           return redirectAuthError(res, '/user/login', 'Username or password is incorrect.');
       }
       const token=jwt.sign({
        userId:user._id,
        email:user.email,
        username:user.username
       },
        process.env.JWT_SECRET  
    );
   res.cookie('token', token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax',
   });
 res.redirect('/home');
//   res.json({ token });
// console.log(token)
    }
);





module.exports=router;