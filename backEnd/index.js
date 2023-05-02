const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser=require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser());
app.use(express.urlencoded({extended:true,limit:'14kb'}));
app.use(cookieParser());

const userRouter = require('./Routes/userRoutes')
app.use('/api/v1/user', userRouter)
// app.use()
const PORT=8000;
app.listen(PORT,()=>{console.log(`server is runing on ${PORT}`)})