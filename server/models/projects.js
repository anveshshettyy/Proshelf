const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  slug: { type: String, unique: true },
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

projectsSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const baseSlug = this.title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")         
    .replace(/[^\w\-]+/g, "");     

  let slug = baseSlug;
  let counter = 1;

  while (await this.constructor.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;
  next();
});

const Projects = mongoose.model("projects", projectsSchema);
module.exports = Projects;
