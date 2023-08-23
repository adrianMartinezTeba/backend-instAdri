const Message = require("../models/Message");

const MessageController = {
  async createMessage(req, res, next) {
    try {
      const message = await Message.create(req.body);
      res.status(201).send({ message: "Mensaje creado con éxito", message });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async getMessages(req, res) {
    try {
      const messages = await Message.find();
      res.send(messages);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getMessageById(req, res) {
    try {
      const message = await Message.findById(req.params.id);
      res.send(message);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async updateMessage(req, res) {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.send({ message: "Mensaje actualizado con éxito", message: updatedMessage });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async deleteMessage(req, res) {
    try {
      await Message.findByIdAndDelete(req.params.id);
      res.send({ message: "Mensaje eliminado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
};

module.exports = MessageController;
