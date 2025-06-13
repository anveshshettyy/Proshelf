const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  about: { type: String },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  video: {
    url: { type: String },
    public_id: { type: String },
  },
  source: { type: String },
  liveDemo: { type: String },
  technologies: [{ type: String }],
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const Projects = mongoose.model("projects", projectsSchema);
module.exports = Projects;
