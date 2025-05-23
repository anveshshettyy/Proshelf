const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    projectsId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Projects"
        }
    ]
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;