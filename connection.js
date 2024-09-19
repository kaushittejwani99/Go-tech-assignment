const mongoose=require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));;

   