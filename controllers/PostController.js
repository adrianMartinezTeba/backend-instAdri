const Post = require("../models/Post");

const PostController = {
  async create(req, res,next) {
    try {
      const imgPath = req.file.path;
      // añadir author:req.user._id
      const post = await Post.create({...req.body,image:imgPath})
      // await User.findByIdAndUpdate(
      //   req.user._id,
      //   {$push:{postIds:post._id}}
      //   )
        res.status(201).send({message:'Post creado correctamente',post})


    } catch (error) {
      console.error(error)
      res.status(500).send({ message: 'Ha habido un problema al crear el post' })
      next(error);
    }
  },

  async getPosts(req, res) {
    try {
      const posts = await Post.find();
      res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getPostById(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async updatePost(req, res) {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params._id,
        req.body,
        { new: true }
      );
      res.send({ message: "Post actualizado con éxito", post: updatedPost });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async deletePost(req, res) {
    try {
      await Post.findByIdAndDelete(req.params._id);
      res.send({ message: "Post eliminado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
};

module.exports = PostController;