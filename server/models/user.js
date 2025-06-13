const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    select: false,
  },
  profile: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],

  bio: { type: String },
  location: { type: String },
  phone: { type: String },
  website: { type: String },

  linkedin: { type: String },
  github: { type: String },
  twitter: { type: String },
  portfolio: { type: String },
  dribbble: { type: String },
  behance: { type: String },
  youtube: { type: String },

  skills: [{ type: String }],
  resume: {
    url: { type: String },
    public_id: { type: String },
  },
  isAvailableForWork: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
