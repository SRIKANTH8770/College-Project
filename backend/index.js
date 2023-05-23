require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors")
const morgan = require('morgan')

const app = express()
require('./db')
PORT=process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }));
 const userRouter = require('./routers/user');

 app.use("/api", userRouter);

 
app.get('/', function (req, res) {
  res.send('Hello World')
 
})

app.listen(PORT,()=>{
    console.log(`server is running on localhost:${PORT}`)
})