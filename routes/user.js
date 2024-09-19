const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController');
const {adminValidation,verifyToken}=require("../jwt");


router

.post("/register",userController.register)

.post("/login",userController.login)

.get('/listAllprofiles',userController.listAllProfiles)

.get("/profiles",verifyToken,userController.getProfileDetails)

.put('/profiles',verifyToken,userController.updateProfile)

.delete('/deleteProfile',verifyToken,userController.deleteProfile)

module.exports=router;
