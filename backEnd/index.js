const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser=require('body-parser');
const mongoose = require('mongoose')
const app = express();
dotenv.config({path:'./config.env'});


app.use(cors());
app.use(bodyParser());
app.use(express.urlencoded({extended:true,limit:'14kb'}));
app.use(cookieParser());

const userRouter = require('./Routes/userRoutes')
app.use('/api/v1/user', userRouter)
// app.use()
const DB = process.env.MONGO_URL 
mongoose.connect(DB).then(()=>{console.log('mongoDB is connected')}).catch(err=>{console.log(err)})
const PORT= process.env.PORT || 8000;
app.listen(PORT,()=>{console.log(`server is runing on ${PORT}`)})