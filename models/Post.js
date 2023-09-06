const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    name:{  
     type: String,
      required: [true, "Por favor rellena tu nombre"]
    },
    image: String,
    description: String,
    author: { type: ObjectId, ref: 'User', required: true }, // Nuevo campo para el autor del post
    likes: [{ type: ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
