const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../lib/utils");
const cloudinary = require("../lib/cloudinary");

exports.signup = async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res
        .status(400)
        .json({
          message:
            "Username can only contain letters, numbers, and underscores with no spaces.",
        });
    }

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
      profile:
        "https://res.cloudinary.com/de9pvcubx/image/upload/v1738393305/xfhzforud0tetphajvrr.png",
    });

    await newUser.save();
    generateTokens(newUser._id, res);

    res.status(201).json({
      message: "Signup successful",
      _id: newUser._id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      profile: newUser.profile,
      
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('+password googleId'); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({
        message:
          "This account uses Google sign-in. Please login with Google instead.",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Password not set for this user. Please reset your password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateTokens(user._id, res);

    res.status(200).json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    const { name, email, username } = req.body;

    if (!name && !email && !username) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const updatedFields = {};

    if (username) {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return res
          .status(400)
          .json({
            message:
              "Username can only contain letters, numbers, and underscores with no spaces.",
          });
      }
      updatedFields.username = username;
    }
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User data updated successfully",
      user: updatedUser,
    });
    
  } catch (error) {
    console.error("Error in updateUserData:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.files || !req.files.profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const file = req.files.profilePic;

    const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "profiles",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated user:", updatedUser.username);

    res.status(200).json({
      message: "Profile picture updated successfully",
      profileImage: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
