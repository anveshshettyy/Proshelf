const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  slug: { type: String, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  projectsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects"
    }
  ]
});


categorySchema.pre("save", async function (next) {
  console.log("🔥 Generating slug for:", this.title); 
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


mongoose.models.Category && delete mongoose.models.Category;

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
