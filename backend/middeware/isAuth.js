const jwt = require("jsonwebtoken")
const User = require("../models/user")

exports.isAuth =async(req,res,next)=>{
    const token = req.cookies.token
    if(!token)
    return res.json({
        success: false,
        message: "login first",
      });

   try {
    const { user } = await jwt.verify(token, process.env.JWT_SECRET);  
     
    const newUser =await User.findOne({email:user.email})

    res.user=newUser
    next()
   } catch (error) {
    console.log(error.message)
   }
}