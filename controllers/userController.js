
const Joi = require('joi');
const { createToken } = require('../jwt');
const User = require('../dbmodels/user');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcryptjs');


module.exports = {
      register: async (req, res) => {
        try {
          const userSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            bio: Joi.string().min(10).max(100).required(),
            role: Joi.string().valid('admin', 'user').required(),
            password: Joi.string().min(6).required(),
          });
    
          const { error, value } = userSchema.validate(req.body, { abortEarly: false });
          if (error) {
            return res.status(400).json({
              message: "Validation failed",
              details: error.details.map(detail => detail.message)
            });
          }
    
          // Check if user already exists
          const userExist = await User.findOne({ email: req.body.email });
          if (userExist) {
            return res.status(400).json({ message: "User already registered" });
          }
    
          // Hash the password using bcryptjs
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
          // Create the user with the hashed password
          const newUser = await User.create({ ...req.body, password: hashedPassword });
    
          // Generate token after saving user
          const token = createToken(newUser);
          await User.findOneAndUpdate({ email: req.body.email }, { $set: { token } });
    
          res.status(201).json({
            message: "User registered successfully",
            data: newUser,
            token: token
          });
        } catch (error) {
          res.status(500).json({ message: "Internal server error" });
        }
      },
    
      login: async (req, res) => {
        try {
          const userSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
          });
    
          const { error, value } = userSchema.validate(req.body, { abortEarly: false });
          if (error) {
            return res.status(400).json({
              message: "Validation failed",
              details: error.details
            });
          }
    
          // Find user by email
          const user = await User.findOne({ email: req.body.email });
          if (!user) {
            return res.status(400).json({
              message: "User not found"
            });
          }
    
          // Compare password
          const isMatch = await bcrypt.compare(req.body.password, user.password);
          if (!isMatch) {
            return res.status(400).json({
              message: "Invalid credentials"
            });
          }
    
          // Generate new token and update it in the database
          const token = createToken(user);
          const updateToken = await User.findOneAndUpdate(
            { email: req.body.email },
            { $set: { token: token } },
            { new: true }
          );
    
          res.status(201).json({
            message: "User login successful",
            data: updateToken,
          });
        } catch (error) {
          res.status(500).json({ message: "Internal server error" });
        }
      },
    
    
  listAllProfiles:async(req,res)=>{
    try{
        

        const allUsers=await User.find();
        return res.status(200).json(
            {
                message:"list fetch successfully",
                data:allUsers
            }
        );

    }catch(error){
        res.status(500).json({ message: "Internal server error", error });

    }
  },
  getProfileDetails:async(req,res)=>{
    try{
        
        const userId=new ObjectId(req.user.id);
        const user=await User.findOne({_id:userId})
        console.log(user);
        if(user){
            res.status(200).json({
                message:"user fetch successfully",
                data:user
            })
        }else{
        res.status(400).json({message:"user not found"})
        }

    }catch(error){
        res.status(500).json({message:"Internal server error"})
        console.log(error);
    }
  },
  updateProfile:async(req,res)=>{
    try{

       
        const userSchema = Joi.object({
            name: Joi.string().min(3).max(30).optional(),
            email: Joi.string().email().optional(),
            bio: Joi.string().min(10).max(100).optional(),
            role: Joi.string().valid('admin', 'user').optional(),
          });
          
    
          const { error, value } = userSchema.validate(req.body, { abortEarly: false });
          if (error) {
            return res.status(400).json({
              message: "Validation failed",
              details: error.details.map(detail => detail.message)
            });
          }

          const userId=new ObjectId(req.user.id);
           
          const updateUser=await User.findOneAndUpdate({_id:userId},req.body,{new:true})

          if(updateUser){
            res.status(200).json({
                message:"user updated successfully",
                data:updateUser
            })
          }

    }catch(error){
        res.status(500).json({message:"Internal server error",error})
    }
  },
  deleteProfile:async(req,res)=>{
    try{
       const userId=new ObjectId(req.user.id);
        const deleteUser=await User.deleteOne({_id:userId})
    if(deleteUser){
        res.status(200).json({
        message:"user deleted successfully"
    }
    )
}
    }catch(error){
        res.status(500).json({message:"Internal server error",error})

    }
  }
};
