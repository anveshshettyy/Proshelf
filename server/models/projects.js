const mongoose = require('mongoose');

const projectsSchema  = new mongoose.Schema ({
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    video: { type: String },
    source: { type: String },
    liveDemo: { type: String },
    technologies: [{ type: String }],
    categoryId: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
})

const Projects = mongoose.model("projects", projectsSchema);
module.exports = Projects;