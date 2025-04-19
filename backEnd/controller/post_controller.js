import postSchema from "../models/post.model.js"

import userSchema from "../models/user.model.js"


export const addPost = async function addPost(req, res) {
  try {
    const userId = req.params.id;
    const { post, description } = req.body;

    if (!post || !Array.isArray(post) || post.length === 0 || !description || !userId) {
      return res.status(400).json({ message: "Please provide at least one image and a description" });
    }

    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = await postSchema.create({
      post, // Array of Base64 strings
      description,
      user: userId,
    });

    res.status(201).json({
      message: "Post created successfully",
      post: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
};


// export const addPost = async function addPost(req, res) {
//     try {
//         // Extract the post and description from the request body
//         const { post, description } = req.body;

//         // Ensure all necessary fields are provided
//         if (!post || !description) {
//             return res.status(400).json({ message: "Please fill all the fields" });
//         }

//         // Extract the token from the Authorization header
//         const token = req.headers.authorization?.split(' ')[1]; // Extract token after "Bearer"

//         // If the token is missing, return error
//         if (!token) {
//             return res.status(403).json({ message: "No token provided" });
//         }

//         // Verify the token to get the user ID
//         const decoded = jwt.verify(token, process.env.JWT_KEY); // process.env.JWT_KEY should be your JWT secret
//         const userId = decoded.id; // Extracted user ID from the token

//         // Fetch user from the database to ensure the user exists
//         const user = await userSchema.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Create the post and save to database with user reference
//         const newPost = new postSchema({
//             post, // Base64 encoded image
//             description,
//             user: userId, // Store the user ID in the post schema
//         });

//         // Save the post in the database
//         const savedPost = await newPost.save();

//         // Respond with the saved post data
//         res.status(201).json({
//             message: "Post uploaded successfully",
//             post: savedPost // Send back the saved post as part of the response
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "Error uploading post", error: err.message });
//     }
// };





// export const loadPosts = async function loadPosts(req, res) {

//     console.log("Inside Load posts")
//     try {
//         const userData = await userSchema.findOne({ _id: req.user })
//         if (!userData) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         // ✅ Populate posts with user information (username, profile_pic)
//         const posts = await postSchema
//             .find()
//             .populate("user", "username profile_pic"); // populate the user field

//         res.status(200).json({
//             message: "Posts loaded successfully",
//             posts, // returns the populated posts with user data
//             userData, // returns the logged-in user's info
//         });


//         const data = await postSchema.find()
//         res.status(200).send({ data, userData })
//     }

//     catch (err) {

//         res.status(500).send({ error: err })
//     }




// }


export const loadPosts = async function loadPosts(req, res) {
    console.log("Inside Load posts");
  
    try {
      // Ensure the user is authenticated
      const userData = await userSchema.findOne({ _id: req.user });

    //   console.log(userData);
      
  
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Query the posts and populate the user field (with username and profile_pic)
      const posts = await postSchema
      .find()
      .populate("user", "username profile_pic");
    

    // const posts = await postSchema.find()

    console.log(posts,"this is posts");
    
      // Send response with posts and user data
      return res.status(200).json({
        message: "Posts loaded successfully",
        posts,
        userData,
      });
  
    } catch (err) {
      // If there's an error, send an error message as a response
      console.error("Error loading posts:", err);
      // Ensure only one response is sent
      if (!res.headersSent) {
        return res.status(500).json({ message: "Error loading posts", error: err.message });
      }
    }
  };


  export const getPost = async function getPost(req,res){


    try{

        
        console.log("Inside get posts")
        
        let user = req.params.id
        
        console.log("userd",user)
        
        const userData = await postSchema.find({user})

        res.status(200).send(userData)
        
    }
    
    catch(err){


        console.log(err)
        res.status(500).json({message:err})
    }
   
}


export const deleteProfile = async function deleteProfile(req, res) {

    try {

      const id = req.params.id;
  
      // Delete all posts of user
      const post_delete = await postSchema.deleteMany({ userid: id });
  
      // delete the user
      const user_delete = await userSchema.findByIdAndDelete(id);
  
      if (!user_delete) {
        return res.status(404).json({ message: "User not found" });
      }
  

      res.status(200).json({message:"User Deleted Successfully"})



    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  };