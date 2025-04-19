import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  post: [{ type: String, required: true }],
  description: { type: String, required: true },
  
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref: "Users", //matching the User model name
    required: true
  }
});

export default mongoose.models.Posts || mongoose.model("Posts", postSchema);


