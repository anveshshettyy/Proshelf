const Category = require('../models/category');
const User = require('../models/user');

exports.createCategory = async(req, res) => {
    const { title, description } = req.body;
    const userId = req.params.id;

    if(!title) {
        return res.json(400).json({messsage : "Title is required"});
    }

    try {
        const newCategory = new Category({
        title,
        description,
        userId,
    });

    const saveCategory = await newCategory.save();

    await User.findByIdAndUpdate(
        userId,
        { $push: { categoryId: saveCategory._id } },
        { new: true }
    );

    res.status(201).json(saveCategory);
    } catch(error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.renameCategory = async( req, res ) => {
    const categoryId = req.params.categoryId;
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: "New title is required" });
    }

    try{
        const updateData = { title };
        if(description !== undefined) {
            updateData.description = description;
        }


        const updateCategory = await Category.findByIdAndUpdate(
            categoryId,
            { $set: updateData },
            { new: true }
        );

        if(!updateCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category renamed successfully", category: updateCategory });
    } catch (error) {
        console.error("Error renaming category:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

exports.deleteCategory = async(req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const category = await Category.findById(categoryId);
        if(!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const userId = category.userId;

        await Category.findByIdAndDelete(categoryId);

        await User.findByIdAndUpdate(
            userId,
            { $pull: { categoryId: categoryId } },
            { new: true }
        );

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Server error", error });
    }
}