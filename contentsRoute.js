import multer from "multer"
import express from "express"

import {
  protect,
  auth,
  isNotVerified
} from '../middleware/auth.js'
import {
  commentContent,
  getContentsBySearch,
  getContents,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  likeContent
} from "../controllers/contentsController.js"

// import {validator} from "../models/contentsModel.js"
// import validate from "../middleware/validate.js"

const router = express.Router()

const storage = multer({storage: multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
})});

//search
router.get('/search', getContentsBySearch)
//semua konten
router.get('/', auth, getContents)
//add konten
const createContentMulter = storage.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }])
router.post('/', createContentMulter, createContent) //exclude validate(validator)
// get 1 konten
router.get('/:id', protect, getContent)
//update konten
router.patch('/:id', auth, updateContent)
//delete konten
router.delete('/:id', auth, deleteContent)
//like
router.patch('/:id/likeContent', auth, likeContent)
//comment
router.post('/:id/commentContent', auth, commentContent)


export default router
