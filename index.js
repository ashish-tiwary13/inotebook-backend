const connectTOMongo = require('./db')
connectTOMongo();

const express = require('express')
const app = express()
const path= require('path');
const {PORT} = require('./config/keys')
//  cors policy
var cors = require('cors')
app.use(cors())
// 

//
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))


// deployment

__dirname = path.resolve();
if(process.env.NODE_ENV ==='production'){
  app.use(express.static(path.join(__dirname,"/frontend/build")));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'frontend','build',"index.html"));
  });
}else{
  app.get("/",(req,res)=>{
    res.send("API is running..");
  });
}
//

app.listen(PORT, () => {
  console.log(`iNotebook app listening on port http://localhost:${PORT}`)
})


