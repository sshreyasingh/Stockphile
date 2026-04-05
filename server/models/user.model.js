const mongoose=require('mongoose')

// Use your Atlas collection name exactly: "user" (not Mongoose's default "users").
// Database name = segment in MONGO_URI after the host, e.g.
// mongodb+srv://...@cluster0.xxxxx.mongodb.net/stockphile?retryWrites=true&w=majority

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength:[3,'username must be atleast 3 characters long']
    },
    email:{
         type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength:[5,'email is too short']
    },
    password:{
         type:String,
        required:true,
        trim:true,
        minlength:[5,'password must be atleast 5 characters long']
    }
}, { collection: 'user' })

const User=mongoose.model('user',userSchema)

module.exports=User