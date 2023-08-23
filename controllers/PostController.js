const Post = require("../models/Post");

const PostController = {
  async createRoutine(req, res, next) {
    try {
      const post = await Post.create(req.body);
      res.status(201).send({ message: "Post creado con éxito", post });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async getRoutines(req, res) {
    try {
      const posts = await Post.find();
      res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getRoutineById(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async updateRoutine(req, res) {
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

  async deleteRoutine(req, res) {
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