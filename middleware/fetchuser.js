const jwt = require('jsonwebtoken');


const {JWT_SECRET}= require('../config/keys')

const fetchuser = (req,res,next)=>{
    // get the user from the jwt token and add id to req object
    const authToken = req.header('auth-token');
    // const authToken = localStorage.getItem('token');
    // const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM2MmU1ODczNzE3Y2Q3N2M1MDU4NDlmIn0sImlhdCI6MTY2NzQyNzc4Mn0.IROuJuUht5YuzD5fNQwliEYHlckKPEoVyg0MyU8hiIo";
    if(!authToken){
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const decoded = jwt.verify(authToken, JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    //Catch errors
    catch (err) {
        (err=> {console.log(err)
        res.json({error: "plz enter valid email",message:err.message})})
    }
}

module.exports = fetchuser;