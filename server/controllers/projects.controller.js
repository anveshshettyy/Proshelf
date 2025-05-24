const { cloudinary } = require('../lib/cloudinary')
const Category = require('../models/category');
const Projects = require('../models/projects');

exports.createProject = async( req, res ) => {
    try {
        const { title, description, source } = req.body;
        const  categoryId = req.params.id;

        if(!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        if(!categoryId) {
            return res.status(400).json({ message: "category Id is required" });
        }

        const uploadImageUrls = [];
        const uploadVideoUrl = null;

        if(req.files?.images) {
            const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

            for(const image of imageFiles) {
                const uploadResponse = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: 'project_images',
                });
                uploadImageUrls.push(uploadResponse.secure_url);
            }
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
            images: uploadedImageUrls,
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
        

    } catch(error) {
        console.error("Error in createProject:", error.message);
        res.status(500).json({ message: "Internal Server Error", error });
    }   
    

}


