const express =require('express');
const router =express.Router();
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const {JWT_SECRET}= require('../config/keys')
//  ROUTE 1: create  a user using : POST "/api/auth/createUser". Donesn't reqiure Login
router.post('/createUser',
[
    body('name',"Enter atleast 3 characters").isLength({ min: 3 }),
    body('email',"Enter correect email").isEmail(),
    body('password',"Enter atleast 5 characters").isLength({ min: 5 }),
],
async (req,res)=>{
    console.log(`email:${req.body.email}`);
    let success= false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exist already
    try {
    let user = await User.findOne({email: req.body.email});
    let msg="";
    if(user){
        msg="Sorry a use with this email already exist";
        return res.status(400).json({error: "Sorry a use with this email already exist",user})
    }
    const salt = await bcrypt.genSalt(10);
    const secPassword =await bcrypt.hash(req.body.password,salt);
    // Create new User
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPassword,
    })
    const data = {
        user:{
            id: user.id
        }
    }
    success=true;
    const authToken = jwt.sign(data , JWT_SECRET);
    res.json({success,authToken,msg});
    // console.log({authToken});
    //Catch errors
    } catch (err) {
        (err=> {console.log(err)
        res.json({error: "plz enter valid email",message:err.message})})
    }
    
})

// ROUTE 2: Login user using : POST "/api/auth/login". Donesn't reqiure Login
router.post('/login',[
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password must not be black").exists(),
],async (req,res)=>{
    let success= false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {email,password} = req.body;
        // email verification
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Plz enter valid credentials"})
        }
        // password check
        const comparePassword = await bcrypt.compare(req.body.password,user.password);
        if(!comparePassword){
            success=false
            return res.status(400).json({error: "Plz enter valid credentials"})
        }
        // return token to the user
        const data = {
            user:{
                id: user.id
            }
        }
        const username = user.name;
        success=true;
        const authToken = jwt.sign(data , JWT_SECRET);
        res.json({success,authToken,username});
    //Catch errors
    } catch (err) {
        (err=> {console.log(err)
        res.json({error: "plz enter valid email",message:err.message})})
    }

})


// ROUTE 3: Get loggedin user details : POST "/api/auth/getuser".  Login required...
router.post('/getuser', fetchuser , async (req,res)=>{
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json({user});
        
            //Catch errors
    } catch (err) {
        (err=> {console.log(err)
        res.json({error: "plz enter valid email",message:err.message})})
    }

})



    module.exports = router;
    
    


