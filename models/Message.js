const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: ObjectId, ref: "User", required: true }, // Usuario que envía el mensaje
    receiver: { type: ObjectId, ref: "User", required: true }, // Usuario que recibe el mensaje
    content: { type: String, required: true }, // Contenido del mensaje
    isRead: { type: Boolean, default: false }, // Si el mensaje ha sido leído
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
