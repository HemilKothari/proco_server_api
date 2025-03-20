const User = require("../models/User");

module.exports = {
  updateUser: async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET
      ).toString();
    }
    try {
      if (req.user.id) {
        res.status(400).json("User Id is required");
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!updatedUser) {
        res.status(404).json("Cannot update user");
      }
      const { password, __v, createdAt, ...others } = updatedUser._doc;

      res.status(200).json({ ...others });
      // res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      if (req.user.id) {
        res.status(400).json("User Id is required");
      }
      await User.findByIdAndDelete(req.user.id);

      res.status(200).json("Successfully Deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getUser: async (req, res) => {
    try {
      if (!req.user.id) {
        // Fix: Ensure req.user.id is checked properly
        return res.status(400).json("User Id is required");
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        // Fix: Corrected condition to check if user does not exist
        return res.status(404).json("Cannot find user");
      }

      const { password, __v, createdAt, ...userdata } = user._doc;

      return res.status(200).json(userdata); // Fix: Removed unnecessary userdata check
    } catch (error) {
      return res.status(500).json(error); // Fix: Ensured all responses return
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const allUser = await User.find();
      if (!allUser) {
        res.status(404).json("Cannot find user");
      }

      res.status(200).json(allUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // getSwipedUser: async (req, res) => {
  //   try {
  //     if (req.user.id) {
  //       res.status(400).json("User Id is required");
  //     }
  //     const user = await User.findById(req.user.id);
  //     if (!user) {
  //       res.status(404).json("Cannot find user");
  //     }
  //     const { name, profile, location, skills } = user._doc;
  //     if (!name || !profile || !location || !skills) {
  //       res.status(404).json("Cannot find user");
  //     }
  //     res.status(200).json({ name, profile, location, skills });
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // },
};
