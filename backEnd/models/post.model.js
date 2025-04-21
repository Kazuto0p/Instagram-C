import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  post: [{ type: String, required: true }],
  description: { type: String, required: true },
  likes:[{type:mongoose.Schema.Types.ObjectId,ref:"Users"}],
  // likeCount:[{type: Number,default:0}],
  likeCount: { type: Number, default: 0 }, // Changed to single Number
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // Matching the User model name
    required: true
  }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

export default mongoose.models.Posts || mongoose.model("Posts", postSchema);