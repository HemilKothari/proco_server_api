const User = require("../models/User");
const CryptoJS = require("crypto-js");

// ======================== UPDATE USER ========================
const updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET
    ).toString();
  }

  try {
    if (!req.user.id) {
      return res.status(400).json("User ID is required");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json("Cannot update user");
    }

    const { password, __v, createdAt, ...others } = updatedUser._doc;
    return res.status(200).json({ ...others });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// ======================== DELETE USER ========================
const deleteUser = async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(400).json("User ID is required");
    }

    await User.findByIdAndDelete(req.user.id);
    return res.status(200).json("Successfully Deleted");
  } catch (error) {
    return res.status(500).json(error);
  }
};

// ======================== GET USER ========================
const getUser = async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(400).json("User ID is required");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json("Cannot find user");
    }

    const { password, __v, createdAt, ...userdata } = user._doc;
    return res.status(200).json(userdata);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// ======================== GET ALL USERS ========================
const getAllUsers = async (req, res) => {
  try {
    const allUser = await User.find();

    if (!allUser) {
      return res.status(404).json("Cannot find users");
    }

    return res.status(200).json(allUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// ======================== EXPORTS ========================
export  {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
};
