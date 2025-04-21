
import express from "express"

import { signUp,logIn , getUser, editUser,sendotp,verifyotp,pass_reset} from "../controller/user_controller.js"

import { addPost,loadPosts, getPost,deleteProfile, likePost, sdel} from "../controller/post_controller.js"

import auth from "../middlewares/auth.js"

const insta = express.Router()

insta.post("/signUp",signUp)

insta.post("/logIn",logIn)

insta.post("/addPost/:id",addPost)


insta.get("/loadPosts",auth,loadPosts)

insta.get("/getUser/:id",getUser)

//get one user uploaded posts data
insta.get("/getPost/:id",getPost)

//edit user details
insta.post("/editUser/:id",editUser)

//delete user
insta.get('/deleteProfile/:id',deleteProfile)

insta.post('/sendotp',sendotp)

insta.post('/verifyotp',verifyotp)

insta.post('/pass_reset',pass_reset)
// insta.get("/zx",zx)

insta.post('/like/:postId',auth, likePost)

insta.post('/sdel/:postId', auth, sdel);
export default insta


