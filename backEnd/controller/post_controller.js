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

    // console.log(posts,"this is posts");

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


export const getPost = async function getPost(req, res) {


  try {


    console.log("Inside get posts")

    let user = req.params.id

    // console.log("userd",user)

    const userData = await postSchema.find({ user })

    res.status(200).send(userData)

  }

  catch (err) {


    console.log(err)
    res.status(500).json({ message: err })
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


    res.status(200).json({ message: "User Deleted Successfully" })



  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};


export const likePost = async function likePost(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user;

    const post = await postSchema.findById(postId);
    if (!post) {
      return res.status(404).json({ message: " Post not Found " })
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      post.likeCount = Math.max(0, post.likeCount - 1); // Decrement like count
    } else {
      // Like: Add user ID to likes array
      post.likes.push(userId);
      post.likeCount += 1; // Increment like count
    }

    await post.save();

    res.status(200).json({
      message: isLiked ? "Unliked" : "Liked",
      likes: post.likes,
      likeCount: post.likeCount,
    });

  } catch (error) {
    console.error("Error liking/unliking post:", err);
    res.status(500).json({ message: "Error liking/unliking post", error: err.message });
  }

}


export const sdel = async function sdel(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.user; // From auth middleware

    const deluser = await postSchema.findOneAndDelete({
      _id: postId,
      user: userId, // Changed from userId to user to match schema
    });

    if (!deluser) {
      return res.status(404).json({ message: "Post not found or not authorized" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};