const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../lib/utils");
const cloudinary = require("../lib/cloudinary");
const Projects = require("../models/projects");
const Category = require("../models/category");
const streamifier = require("streamifier");

exports.signup = async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    username = username.toLowerCase();

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username can only contain lowercase letters, numbers, and underscores with no spaces.",
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
    }).select("+password googleId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: user.googleId
          ? "This Google account has no password. Please sign in with Google."
          : "Password not set for this account.",
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Old password is incorrect' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
}

exports.createPassword = async (req, res) => {
  const { newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user.password) {
    return res.status(400).json({ message: 'You already have a password' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: 'Password created successfully' });
}

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password"); // select password for checking

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObj = user.toObject();

    delete userObj.password;

    userObj.hasPassword = !!user.password;

    res.json({ user: userObj });
  } catch (err) {
    console.error("Error in /me:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getData = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      {
        path: "categoryId",
        populate: {
          path: "projectsId",
          model: "projects",
        },
      }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    const pieChartData = user.categoryId.map((cat) => ({
      id: cat.title,
      label: cat.title,
      value: cat.projectsId.length,
    }));

    res.json({ user, pieChartData });
  } catch (err) {
    console.error("❌ Error fetching user by username:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      {
        path: "categoryId",
        populate: {
          path: "projectsId",
          model: "projects",
        },
      }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    const collections = user.categoryId.map((category) => ({
      _id: category._id,
      title: category.title,
      description: category.description,
      projectCount: category.projectsId.length,
      slug: category.slug,
    }));

    res.json({ user, collections });
  } catch (err) {
    console.error("❌ Error fetching collections:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProjectsList = async (req, res) => {
  const { username, collectionSlug } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const category = await Category.findOne({
      userId: user._id,
      slug: collectionSlug,
    }).populate({
      path: "projectsId",
      model: "projects", 
    });

    if (!category) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        profile: user.profile,
      },
      collection: {
        _id: category._id,
        title: category.title,
        description: category.description,
        projects: category.projectsId,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching project list:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProject = async (req, res) => {
  const { username, collectionSlug, projectSlug } = req.params;

  try {
    // 1️⃣ Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Find the category (collection) by slug and userId
    const category = await Category.findOne({
      slug: collectionSlug,
      userId: user._id,
    });
    if (!category) return res.status(404).json({ message: "Collection not found" });

    // 3️⃣ Find the project by slug and categoryId
    const project = await Projects.findOne({
      slug: projectSlug,
      categoryId: category._id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    // ✅ Success
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        profile: user.profile,
      },
      collection: {
        _id: category._id,
        title: category.title,
        slug: category.slug,
      },
      project,
    });

  } catch (error) {
    console.error("❌ Error fetching single project:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, username } = req.body;

    const updatedFields = {};
    if (username) {
      const usernameLower = username.toLowerCase();
      const usernameRegex = /^[a-z0-9._]+$/;
      if (!usernameRegex.test(usernameLower)) {
        return res.status(400).json({
          message:
            "Username can only contain lowercase letters, numbers, and underscores with no spaces.",
        });
      }
      updatedFields.username = usernameLower;
    }

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators: true, context: "query" }
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

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        message: `The ${duplicateField} "${error.keyValue[duplicateField]}" is already taken.`,
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(" ") });
    }

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

    // Create upload stream
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profiles",
            resource_type: "auto", // for image/video support
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    // Upload using buffer
    const result = await streamUpload(file.data);

    // Save to DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      profileImage: result.secure_url,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const updateData = {
      bio: req.body.bio,
      location: req.body.location,
      phone: req.body.phone,
      website: req.body.website,

      linkedin: req.body.linkedin,
      github: req.body.github,
      figma: req.body.figma,
      portfolio: req.body.portfolio,
      dribbble: req.body.dribbble,
      behance: req.body.behance,
      youtube: req.body.youtube,

      isAvailableForWork: req.body.isAvailableForWork === "true",
    };

    // 🎯 Parse skills (array / comma / JSON string)
    if (req.body.skills) {
      updateData.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.includes("[")
        ? JSON.parse(req.body.skills)
        : req.body.skills.split(",").map((s) => s.trim());
    }

    // 🗑️ Delete resume if requested
    if (req.body.deleteResume === "true" && user.resume?.public_id) {
      await cloudinary.uploader.destroy(user.resume.public_id, {});
      updateData.resume = undefined;
    }

    // 📤 Upload new resume
    if (req.files?.resume) {
      const resumeFile = req.files.resume;

      if (resumeFile.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Resume must be a PDF file" });
      }

      // Delete old resume if exists
      if (user.resume?.public_id) {
        await cloudinary.uploader.destroy(user.resume.public_id, {});
      }

      // 🧼 Clean filename
      const cleanFileName = resumeFile.name
        .replace(/\s+/g, "_")
        .replace(/[()]/g, "")
        .replace(/\.pdf$/i, "");

      // 🚀 Upload PDF buffer using stream
      const uploadResume = (buffer) =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "resumes",

              public_id: `${userId}_${cleanFileName}`,
              overwrite: true,
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(uploadStream);
        });

      const uploaded = await uploadResume(resumeFile.data);

      updateData.resume = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    // 🔄 Final DB update
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🧹 Delete user profile picture from Cloudinary if hosted there
    if (user.profile?.includes("res.cloudinary.com")) {
      const profileUrlParts = user.profile.split("/");
      const fileNameWithExt = profileUrlParts.pop();
      const publicId = fileNameWithExt.split(".")[0];
      await cloudinary.uploader.destroy(`profiles/${publicId}`);
    }

    // 📂 Find all projects by user
    const projects = await Projects.find({ user: userId });

    for (const project of projects) {
      // 🖼️ Delete all images from Cloudinary
      for (const image of project.images || []) {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }

      // 📽️ Delete video if present
      if (project.video?.public_id) {
        await cloudinary.uploader.destroy(project.video.public_id, {
          resource_type: "video",
        });
      }

      // 📄 Delete PDF if present
      if (project.pdf?.public_id) {
        await cloudinary.uploader.destroy(project.pdf.public_id, {});
      }

      // 🧼 Remove project reference from category
      if (project.categoryId) {
        await Category.findByIdAndUpdate(project.categoryId, {
          $pull: { projectsId: project._id },
        });
      }

      // ❌ Delete project document
      await Projects.findByIdAndDelete(project._id);
    }

    // ❌ Delete all categories belonging to user
    await Category.deleteMany({ user: userId });

    // ❌ Finally delete user
    await User.findByIdAndDelete(userId);

    // 🧹 Clear JWT cookie and respond
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
