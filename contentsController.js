import express from "express"
import mongoose from "mongoose"

import dotenv from "dotenv"
import cloudinary from "cloudinary"
dotenv.config({
    path: './config/config.env'
})

const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

import ContentsModel from "../models/contentsModel.js" //exclude {validator}
// import validate from "../middleware/validate"
// import isValidObjectId from "../middleware/isValidObjectId"

//all contents
export const getContents = async (req, res) => {
    const {
        page
    } = req.query; //nauva
    try {
        const LIMIT = 12;
        const startIndex = (Number(page) - 1) * LIMIT; //nauva
        const total = await ContentsModel.countDocuments({}); //nauva

        const contents = await ContentsModel.find().sort({
            _id: -1
        }).limit(LIMIT).skip(startIndex); // nauva

        // console.log(contents)

        // res.status(200).json({ data: contents, currentPage: Number(page), NumberOfPages: Math.ceil(total / LIMIT)}); // nauva
        res.json({
            data: contents,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / LIMIT)
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

// 1 content
export const getContent = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const post = await ContentsModel.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}


//add content
export const createContent = async (req, res) => {
    try {
        const thumbnail = req.files["thumbnail"][0];
        const uploadThunbnail = await cloudinary.v2.uploader.upload(thumbnail.path, {resource_type: "image"})

        const video = req.files["video"][0];
        const uploadVideo = await cloudinary.v2.uploader.upload(video.path, {resource_type: "video"})
        
        const body = {
            ...req.body
        };
        delete body.thumbnail;
        delete body.video;

        
        const newPost = new ContentsModel({
            ...body,
            createdAt: new Date().toISOString(),
            thumbnail: uploadThunbnail.secure_url,
            video: uploadVideo.secure_url
        }) 

        await newPost.save();
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
    }
}


//update content
export const updateContent = async (req, res) => {
    const {
        id: _id
    } = req.params
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No content with that id")

    const updateContent = await ContentsModel.findByIdAndUpdate(_id, {
        ...post,
        _id
    }, {
        new: true
    })

    res.json(updateContent)

}

//delete content
export const deleteContent = async (req, res) => {
    const {
        id
    } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No content with that id")

    await ContentsModel.findByIdAndRemove(id)

    // console.log("DELETE")

    res.json({
        message: "Content deleted successfully"
    })

}

//like content
export const likeContent = async (req, res) => {
    const {
        id
    } = req.params

    if (!req.user) return res.json({
        message: 'Unauthenticated'
    })

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No content with that id")

    const post = await ContentsModel.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.user));
    if (index === -1) {
        post.likes.push(req.user)
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.user))
    }

    const updatedPost = await ContentsModel.findByIdAndUpdate(id, post, {
        new: true
    })

    res.json(updatedPost)
}

//search content
export const getContentsBySearch = async (req, res) => {
    // note :
    // QUERY -> /contents?page=1 -> page = 1   <- search
    // PARAMS -> /contents/123 -> id = 123     <- get spesific data

    const {
        searchQuery,
        categories
    } = req.query;

    try {
        const title = new RegExp(searchQuery, 'i'); // ignore case LIKE,Like -> like

        const contents = await ContentsModel.find({
            $or: [{
                    title
                },
                // { categories} // : { $in: categories.split(',') } 
            ]
        });

        res.json({
            data: contents
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

//comment content
export const commentContent = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        value
    } = req.body;

    const content = await ContentsModel.findById(id);

    content.comments.push(value);

    const updatedContent = await ContentsModel.findByIdAndUpdate(id, content, {
        new: true
    });

    res.json(updateContent)



}
