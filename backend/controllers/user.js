const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { mailTransport } = require("../utils/mail");

exports.createUser = async (req, res) => {

  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user)
    return res.json({
      success: false,
      message: "email is already exits",
    });

  const newUser = new User({
    name,
    email,
    password,
  });

  const token = jwt.sign({ user: newUser }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  try {
    const link = `http://localhost:3000/verify?token=${token}`;
    console.log(link)
    mailTransport().sendMail({
      from: "allexamss24@gmail.com",
      to: newUser.email,
      subject: " Verify your Account",
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Quizzze</a>
        </div>
        <p style="font-size:1.1em">Hi,${newUser.name}</p>
        <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
        <Button style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${link}</button>
        <p style="font-size:0.9em;">Regards,<br />Quizzze</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>YQuizzze.Inc</p>
          <p>1600 Amphitheatre Parkway</p>
          <p>California</p>
        </div>
      </div>
    </div>`,
    });
  } catch (error) {
    console.log(error);
  }

  await newUser.save();

  res.json({
    success: true,
    newUser,
  });
};

exports.verify = async (req, res) => {
  const token = req.query.token;

  if (!token)
    return res.json({
      success: false,
      message: "token is expried",
    });

  try {
    const { user } = await jwt.verify(token, process.env.JWT_SECRET);
    const newUser = await User.findById(user._id);

    if (newUser.verified === true)
      return res.json({
        success: false,
        message: "Email is already verifyed",
      });

    newUser.verified = true;
    await newUser.save();
    res.json({
      success: true,
      message: "Email is verifyed",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.json({
      success: false,
      message: "fill all fields",
    });

  const user = await User.findOne({ email });


  if (!user)
    return res.json({
      success: false,
      message: "Email not found",
    });

 

  const isMatched = await user.comparePassword(password);
  if (!isMatched)
    return res.json({
      success: false,
      message: "Email and password dont matched",
    });
    
    if(user.verified===false)
    return res.json({
      success: false,
      message: "please verify email first",
    });

  const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie('token', token, { expires: new Date(Date.now() + 900000)})
  res.json({
    success: true,
    message: "you are logged in",
    token:token
  });
};

exports.profile = (req, res) => {
  res.json({
    success: true,
    user: {
      id: res.user._id,
      name: res.user.name,
      email: res.user.email,
    },
  });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        success: false,
        message: "email not found",
      });

    const token = jwt.sign({ token: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    try {
      const link = `http://localhost:4000/forget?token=${token}`;
      mailTransport().sendMail({
        from: "allexamss24@gmail.com",
        to: user.email,
        subject: " Verify your Account",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Quizzze</a>
          </div>
          <p style="font-size:1.1em">Hi,${user.name}</p>
          <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
          <a style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${link}</a>
          <p style="font-size:0.9em;">Regards,<br />Quizzze</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>YQuizzze.Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      </div>`,
      });
      res.json({
        success: true,
        message: `Like is sent to your email ${user.email} `,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};


exports.resetPassword =async(req,res)=>{
  const token = req.query.token;
  const {password} = req.body
  if (!token)
  return res.json({
    success: false,
    message: "token is expried",
  });
try {
  const id = await jwt.verify(token, process.env.JWT_SECRET);
  
  const newUser = await User.findById(id.token);

 newUser.password=password 
 await newUser.save()
 res.json({
  success:true,
  user: {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  },
  
 })
  
} catch (error) {
  res.json({
    success: false,
    message: error.message,
  });
} 
}