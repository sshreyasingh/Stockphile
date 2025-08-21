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

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwtt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded; // ✅ Now req.user.id is available
    next();
  });
}

module.exports = { verifyToken };

const { supabaseClient } = require('../supabase');

router.get('/files', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ comes from decoded JWT
    const { data, error } = await supabaseClient
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
        return res.status(400).json({
            errors: errors.array(),
            message:'Invalid data'
        })
    }
    const{email,username,password}=req.body;
    
    const hashPass=await bcrypt.hash(password,10)
    const newUser= await userModel.create({
        email,username,password:hashPass
    })
//     const newUser = new User({
//     name,
//     email,
//     supabaseId: data.user.id // store Supabase user ID
//   });
//   await newUser.save();
    await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

    // res.json(newUser);

    
const token = jwt.sign(
  { userId: newUser._id, email: newUser.email }, // Include user ID
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

     res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });
    // console.log(req.body);
    // res.send('user registered');
    res.redirect('/home');


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
            return res.status(400).json({
                error:errors.array(),
                message:'Invalid Data'
            })
        }
        const {username,password}=req.body;
        const user=await userModel.findOne({
            username: username
        })
        console.log(user);
       if(!user){
        return res.status(400).json({
            message:'username or password is incorrect'
        });
       }
       const isMatch=await bcrypt.compare(password,user.password)
       if(!isMatch){
           return res.status(400).json({
           message:'username or password is incorrect'
           });
       }
       const token=jwt.sign({
        userId:user._id,
        email:user.email,
        username:user.username
       },
        process.env.JWT_SECRET  
    );
   res.cookie('token',token)
   // After MongoDB password match is confirmed:

//    res.send('logged in')
 res.redirect('/home');
//   res.json({ token });
// console.log(token)
    }
);





module.exports=router;