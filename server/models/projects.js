const mongoose = require('mongoose');

const projectsSchema  = new mongoose.Schema ({
    title: { type: String, required: true },
    description: { type: String },
    images: { type: String },
    videos: { type: String },
    source: { type: String },
    categoryId: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
        }
    ],
})

const Projects = mongoose.model("projects", projectsSchema);
module.exports = Projects;