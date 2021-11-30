import  express  from "express"
import  mongoose  from "mongoose"
import parser from "../utils/cloudinary.js"
import ContentsModel from "../models/contentsModel.js" //exclude {validator}
// import validate from "../middleware/validate"
// import isValidObjectId from "../middleware/isValidObjectId"

export const getContents = async (req, res) => {
    try {
        const contents = await ContentsModel.find()

        // console.log(contents)

        res.status(200).json(contents)

    } catch (error) {
        res.status(404).json({message : error.message})
    }
}

// 1 konten
export const getContent = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await ContentsModel.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const createContent = async (req, res) => {
    const post = req.body;
    // req.body.thumbnail = result.secure_url;
    // console.log(result.secure_url)
    
    // req.body.thumbnailID = result.public_id;
        const newPost = new ContentsModel({...post, createdAt: new Date().toISOString(), thumbnail: req.file.path}
        
        )
        
        try {
            
            await newPost.save();
        //   await ImageContent.save();
          res.status(201).json(newPost);
        } catch (error) {
          return res.status(400).json({
            message: `image upload failed, check to see the ${error}`,
            status: "error",
          });
        }};


export const updateContent = async (req, res) => {
    const {id: _id} = req.params
    const post = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No content with that id")

    const updateContent = await ContentsModel.findByIdAndUpdate(_id, {...post, _id}, {new: true})

    res.json(updateContent)

}

export const deleteContent = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No content with that id")

    await ContentsModel.findByIdAndRemove(id)

    // console.log("DELETE")

    res.json({message : "Content deleted successfully"})

}

export const likeContent = async (req,res) => {
    const {id} =  req.params

    if(!req.user) return res.json({message:'Unauthenticated'})

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No content with that id")

    const post = await ContentsModel.findById(id)

    const index = post.likes.findIndex((id)=> id === String(req.user));
    if (index === -1){
        post.likes.push(req.user)
    } else {
        post.likes = post.likes.filter((id)=> id !== String(req.user))
    }

    const updatedPost = await ContentsModel.findByIdAndUpdate(id, post, {new: true})

    res.json(updatedPost)
}

