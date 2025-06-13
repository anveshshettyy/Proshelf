const cloudinary = require("../lib/cloudinary");
const Category = require("../models/category");
const Projects = require("../models/projects");
const MAX_VIDEO_SIZE_MB = 25;
const streamifier = require("streamifier");

exports.createProject = async (req, res) => {
  try {
    const { title, description, about, source, liveDemo, technologies } =
      req.body;
    const categoryId = req.params.id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const uploadImageToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "project_images" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const uploadVideoToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "project_videos" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const uploadImageUrls = [];

    if (req.files?.images) {
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const imageUploadResponses = await Promise.all(
        imageFiles.map((image) => uploadImageToCloudinary(image.data))
      );

      uploadImageUrls.push(
        ...imageUploadResponses.map((resp) => ({
          url: resp.secure_url,
          public_id: resp.public_id,
        }))
      );
    }

    let uploadedVideo = null;

    if (req.files?.video) {
      const videoFile = req.files.video;

      const sizeInMB = videoFile.size / (1024 * 1024);

      if (sizeInMB > MAX_VIDEO_SIZE_MB) {
        return res.status(400).json({
          message: `Video size should be less than ${MAX_VIDEO_SIZE_MB} MB`,
        });
      }

      const videoUploadResponse = await uploadVideoToCloudinary(videoFile.data);

      uploadedVideo = {
        url: videoUploadResponse.secure_url,
        public_id: videoUploadResponse.public_id,
      };
    }

    const newProject = new Projects({
      title,
      description,
      about,
      images: uploadImageUrls,
      video: uploadedVideo,
      source,
      liveDemo,
      technologies: Array.isArray(technologies)
        ? technologies.map((t) => t.trim())
        : typeof technologies === "string"
        ? technologies.split(",").map((t) => t.trim())
        : [],
      categoryId,
    });

    const savedProject = await newProject.save();

    await Category.findByIdAndUpdate(categoryId, {
      $push: { projectsId: savedProject._id },
    });

    res.status(201).json({
      message: "Project created and uploaded successfully",
      project: savedProject,
    });
  } catch (error) {
    console.error("Error in createProject:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, about, source, liveDemo, technologies } =
      req.body;

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (about !== undefined) updateData.about = about;
    if (source !== undefined) updateData.source = source;
    if (liveDemo !== undefined) updateData.liveDemo = liveDemo;

    if (technologies !== undefined) {
      updateData.technologies = Array.isArray(technologies)
        ? technologies.map((t) => t.trim())
        : technologies.split(",").map((t) => t.trim());
    }

    // ---------- IMAGE UPLOAD ----------
    const uploadImageToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "project_images" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    if (req.files?.images) {
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const imageUploadResponses = await Promise.all(
        imageFiles.map((image) => uploadImageToCloudinary(image.data))
      );

      updateData.images = imageUploadResponses.map((resp) => ({
        url: resp.secure_url,
        public_id: resp.public_id,
      }));
    }

    // ---------- VIDEO UPLOAD ----------
    const uploadVideoToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "project_videos" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    if (req.files?.video) {
      const videoFile = req.files.video;
      const sizeInMB = videoFile.size / (1024 * 1024);
      const MAX_VIDEO_SIZE_MB = 95;

      if (sizeInMB > MAX_VIDEO_SIZE_MB) {
        return res.status(400).json({
          message: `Video size should be less than ${MAX_VIDEO_SIZE_MB} MB`,
        });
      }

      const uploadResponse = await uploadVideoToCloudinary(videoFile.data);

      updateData.video = {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      };
    }

    // ---------- UPDATE DATABASE ----------
    const updatedProject = await Projects.findByIdAndUpdate(
      projectId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error in updateProject:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.getSingleProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Projects.findById(projectId).populate("categoryId"); // optional populate

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching single project:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.getCategoryWithProjects = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const projects = await Projects.find({ categoryId: req.params.id }).select(
      "title description"
    );

    res.status(200).json({ category, projects });
  } catch (error) {
    console.error("Error in getCategoryWithProjects:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addProjectImage = async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!req.files?.images) {
      return res.status(400).json({ message: "No images provided" });
    }

    const imageFiles = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    const uploadImageToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "project_images" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const uploadedImages = await Promise.all(
      imageFiles.map((image) => uploadImageToCloudinary(image.data))
    );

    const imageData = uploadedImages.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

    const updatedProject = await Projects.findByIdAndUpdate(
      projectId,
      { $push: { images: { $each: imageData } } },
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

    if (!req.files?.video) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const videoFile = req.files.video;
    const sizeInMB = videoFile.size / (1024 * 1024);
    if (sizeInMB > 95) {
      return res.status(400).json({ message: "Video must be under 95MB" });
    }

    // Upload using streamifier
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "project_videos",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(videoFile.data).pipe(stream);
      });
    };

    const uploadRes = await streamUpload();

    const updatedProject = await Projects.findByIdAndUpdate(
      projectId,
      { video: { url: uploadRes.secure_url, public_id: uploadRes.public_id } },
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
    if (!project || !project.video?.public_id) {
      return res.status(404).json({ message: "No video to remove" });
    }

    await cloudinary.uploader.destroy(project.video.public_id, {
      resource_type: "video",
    });

    project.video = undefined;
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
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "public_id is required" });
    }

    const project = await Projects.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove image from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Remove from DB
    project.images = project.images.filter(
      (img) => img.public_id !== public_id
    );
    await project.save();

    res.status(200).json({
      message: "Image removed successfully",
      images: project.images,
    });
  } catch (error) {
    console.error("Error in removeProjectImage:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Projects.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    for (const image of project.images || []) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    if (project.video?.public_id) {
      await cloudinary.uploader.destroy(project.video.public_id, {
        resource_type: "video",
      });
    }

    await Projects.findByIdAndDelete(projectId);

    await Category.findByIdAndUpdate(project.categoryId, {
      $pull: { projectsId: projectId },
    });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProject:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
