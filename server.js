const express=require('express');
const app=express();
const connection = require("./connection");
require('dotenv').config();
const user=require('./routes/user');
const cors = require('cors')
app.use(express.json());
app.use(cors());

// If you want to support URL-encoded bodies (optional)
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api', user);

const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`app listen successfully  ${port}`);
})


