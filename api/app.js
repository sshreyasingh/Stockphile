const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const connectToDB=require('./config/db')
const cookieParser=require('cookie-parser')
connectToDB();
const indexRouter=require('./routes/index.routes')
// middleware/auth.js
const jwt = require('jsonwebtoken');

// app.use(cors({
//   origin: ["https://your-frontend.vercel.app"],
//   credentials: true
// }));


function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET; // make sure it's in .env
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // e.g., req.user.id
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token.' });
  }
}

module.exports = verifyToken;


const userRouter=require('./routes/user.routes')
const fileRoutes=require('./upload')
app.use('/api/files',fileRoutes);


app.set('view engine','ejs');
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/upload', require('./upload'));


// app.listen(3001,()=>{
//     console.log('server running');
// })
module.exports = app;

const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route for React
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
