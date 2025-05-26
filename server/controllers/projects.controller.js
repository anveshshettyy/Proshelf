const cloudinary = require('../lib/cloudinary');
const Category = require('../models/category');
const Projects = require('../models/projects');

exports.createProject = async (req, res) => {
    try {
        const { title, description, source } = req.body;
        const categoryId = req.params.id;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const uploadImageUrls = [];

        if (req.files?.images) {
            const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

            const imageUploadPromises = imageFiles.map(image =>
                cloudinary.uploader.upload(image.tempFilePath, {
                    folder: 'project_images',
                })
            );

            const imageUploadResponses = await Promise.all(imageUploadPromises);
            uploadImageUrls.push(...imageUploadResponses.map(resp => resp.secure_url));
        }

        let uploadedVideo = '';
        if (req.files?.video) {
            const videoFile = req.files.video;
            const uploadResponse = await cloudinary.uploader.upload(videoFile.tempFilePath, {
                resource_type: 'video',
                folder: 'project_videos',
            });
            uploadedVideo = uploadResponse.secure_url;
        }

        const newProject = new Projects({
            title,
            description,
            images: uploadImageUrls,
            video: uploadedVideo,
            source,
            categoryId
        });

        const savedProject = await newProject.save();

        await Category.findByIdAndUpdate(categoryId, {
            $push: { projectsId: savedProject._id }
        });

        res.status(201).json({
            message: "Project created and uploaded successfully",
            project: savedProject
        });

    } catch (error) {
        console.error("Error in createProject:", error.message);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

exports.addProjectImage = async (req, res) => {
    try {
        const projectId = req.params.id;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        if (!req.files || !req.files.images) {
            return res.status(400).json({ message: "No images provided" });
        }

        const imageFiles = Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images];

        const uploadedUrls = [];

        for (const image of imageFiles) {
            const uploadResponse = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: 'project_images',
            });
            uploadedUrls.push(uploadResponse.secure_url);
        }

        const updatedProject = await Projects.findByIdAndUpdate(
            projectId,
            { $push: { images: { $each: uploadedUrls } } },
            { new: true }
        );

        res.status(200).json({
            message: "Images added successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Error in addProjectImage:", error.message);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

exports.addProjectVideo = async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!projectId) {
      return res.status(400).json({ message: "Project Id is required" });
    }

    if (!req.files?.video) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const videoFile = req.files.video;
    const uploadResponse = await cloudinary.uploader.upload(videoFile.tempFilePath, {
      resource_type: "video",
      folder: "project_videos",
    });

    const updatedProject = await Projects.findByIdAndUpdate(
      projectId,
      { video: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Video added successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error in addProjectVideo:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.removeProjectVideo = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Projects.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!project.video) {
            return res.status(400).json({ message: "No video to remove" });
        }

        const publicId = project.video.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`project_videos/${publicId}`, {
            resource_type: 'video'
        });

        project.video = '';
        await project.save();

        res.status(200).json({ message: "Video removed successfully" });

    } catch (error) {
        console.error("Error in removeProjectVideo:", error.message);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

exports.removeProjectImage = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        const project = await Projects.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.images = project.images.filter(img => img !== imageUrl);
        await project.save();

        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`project_images/${publicId}`);

        res.status(200).json({ message: "Image removed successfully", images: project.images });

    } catch (error) {
        console.error("Error in removeProjectImage:", error.message);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const project = await Projects.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await Projects.findByIdAndDelete(projectId);

        await Category.findByIdAndUpdate(project.categoryId, {
            $pull: { projectsId: projectId }
        });

        res.status(200).json({ message: "Project deleted successfully" });

    } catch (error) {
        console.error("Error in deleteProject:", error.message);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
