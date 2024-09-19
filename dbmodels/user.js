const mongoose=require('mongoose');
const user=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    bio:{type:String,required:true},
    role:{type:String,enum:['admin','user']},
    token:{type:String},
    password:{type:String,required:true}
})

module.exports=mongoose.model('user',user);