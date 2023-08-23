const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor rellena tu nombre"],
    },
    description: String,
    likes: [{ type: ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;