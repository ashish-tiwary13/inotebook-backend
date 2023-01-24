const mongoose = require('mongoose');

// const {MOGOURI} = require('./config/keys')
const MOGOURI="mongodb+srv://ashishtiwary1326:Ashish%401326@cluster0.7dvvz93.mongodb.net/inotebook";

const connectTOMongo = ()=> {
    mongoose.connect(MOGOURI,()=>{
        console.log("connected to Mongo successfuly")
    })
}
module.exports = connectTOMongo;