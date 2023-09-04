const Post = require("../models/Post");
const User = require("../models/User");

const PostController = {
  async create(req, res){
    try {
      const upFile = req.file
      console.log(upFile);
      const author = await User.findById(req.user._id);
      
      if (!author) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
      }
      
      const post = await Post.create({
       name:req.body.name,
       description: req.body.description,
        image: req.file.filename, // Usar req.file.filename en lugar de req.file.fieldname
        author: author._id, // Asegurarse de usar _id para el author
      });
      
      // Agregar el ID del nuevo post al usuario
      author.posts.push(post._id);
      await author.save();
      
      res.status(201).send({ message: 'Post creado correctamente', post,author });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ha habido un problema al crear el post' });
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