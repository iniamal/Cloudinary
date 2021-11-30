import express from "express"
import {getContents,getContent, createContent, updateContent, deleteContent, likeContent} from "../controllers/contentsController.js"
// import {validator} from "../models/contentsModel.js"
// import validate from "../middleware/validate.js"
import parser from "../utils/cloudinary.js"

import {protect, auth} from '../middleware/auth.js'


const router = express.Router()

//semua konten
router.get('/', auth,  getContents)
//add konten
router.post('/',parser.single("thumbnail"), createContent) //exclude validate(validator)
// get 1 konten
router.get('/:id', protect, getContent)
//update konten
router.patch('/:id', auth, updateContent)
//delete konten
router.delete('/:id', auth, deleteContent)
//like
router.patch('/:id/likeContent', auth, likeContent)

export default router