/*const User = require("../models/User");

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
};*/


const User = require("../models/User");
const CryptoJS = require("crypto-js");

module.exports = {
  // UPDATE USER
  updateUser: async (req, res) => {
    // Encrypt the password if provided
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET
      ).toString();
    }

    try {
      // Check if user ID exists
      if (!req.user.id) {
        return res.status(400).json("User ID is required");
      }

      // Update the user in the database
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id, // The user ID from the request after authorization
        {
          $set: req.body, // Update the fields in the request body
        },
        { new: true } // Return the updated user data
      );

      // If no user was updated, send a 404 error
      if (!updatedUser) {
        return res.status(404).json("Cannot update user");
      }

      // Exclude sensitive fields (password, __v, createdAt) from the response
      const { password, __v, createdAt, ...others } = updatedUser._doc;

      // Send the updated user data back to the client
      return res.status(200).json({ ...others });
    } catch (err) {
      // Catch any errors and send a 500 response
      return res.status(500).json(err);
    }
  },

  // DELETE USER
  deleteUser: async (req, res) => {
    try {
      // Check if user ID exists
      if (!req.user.id) {
        return res.status(400).json("User ID is required");
      }

      // Delete the user from the database
      await User.findByIdAndDelete(req.user.id);

      // Send a success response
      return res.status(200).json("Successfully Deleted");
    } catch (error) {
      // Catch any errors and send a 500 response
      return res.status(500).json(error);
    }
  },

  // GET USER
  getUser: async (req, res) => {
    try {
      // Check if user ID exists
      if (!req.user.id) {
        return res.status(400).json("User ID is required");
      }

      // Find the user in the database by their ID
      const user = await User.findById(req.user.id);

      // If no user is found, send a 404 error
      if (!user) {
        return res.status(404).json("Cannot find user");
      }

      // Exclude sensitive fields (password, __v, createdAt) from the response
      const { password, __v, createdAt, ...userdata } = user._doc;

      // Send the user data back to the client
      return res.status(200).json(userdata);
    } catch (error) {
      // Catch any errors and send a 500 response
      return res.status(500).json(error);
    }
  },

  // GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      // Get all users from the database
      const allUser = await User.find();

      // If no users are found, send a 404 error
      if (!allUser) {
        return res.status(404).json("Cannot find users");
      }

      // Send all user data back to the client
      return res.status(200).json(allUser);
    } catch (error) {
      // Catch any errors and send a 500 response
      return res.status(500).json(error);
    }
  },

  // GET SWIPED USER (Uncomment and modify if needed)
  // getSwipedUser: async (req, res) => {
  //   try {
  //     if (!req.user.id) {
  //       return res.status(400).json("User ID is required");
  //     }
  //     const user = await User.findById(req.user.id);
  //     if (!user) {
  //       return res.status(404).json("Cannot find user");
  //     }
  //     const { name, profile, location, skills } = user._doc;
  //     if (!name || !profile || !location || !skills) {
  //       return res.status(404).json("Cannot find user");
  //     }
  //     return res.status(200).json({ name, profile, location, skills });
  //   } catch (error) {
  //     return res.status(500).json(error);
  //   }
  // },
};
