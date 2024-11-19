const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async (req, res) => {
    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({status: false, message: "Invalid email format"});
    }
  
    // Validate password length
    const minPasswordLength = 8; // You can adjust the minimum length
    if (req.body.password.length < minPasswordLength) {
      return res.status(400).json({status: false, message: "Password should be at least " + minPasswordLength + " characters long"});
    }
  
    // Check if email already exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).json({status: false, message: "Email already exists"});
    }
  
    // If email doesn't exist, proceed with creating the new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET
      ).toString(),
    });
  
    try {
      await newUser.save();
      res.status(201).json({status: true, message: "User created successfully"});
    } catch (error) {
      console.log(error);
      res.status(500).json({status: false, message:error.message});
    }
  },
  

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if(!user){
        return res.status(401).json({status: false, message: 'Wrong Email Address' });
      }

      const decrytedpass = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const depassword = decrytedpass.toString(CryptoJS.enc.Utf8);

      if(depassword !== req.body.password){
        return res.status(401).json({status: false, message: 'Provide a correct password' });
      }
      

      const userToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
          isAgent: user.isAgent,
        },
        process.env.JWT_SEC,
        { expiresIn: '21d' }
      );

      const { password, __v, createdAt, ...others } = user._doc;

      res.status(200).json({ ...others, userToken });
    } catch (error) {
      res.status({status: false, error: error.message});
    }
  },
};
