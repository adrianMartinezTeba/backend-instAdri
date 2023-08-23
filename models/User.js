const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Por favor rellena tu nombre de usuario"],
    },
    email: {
      type: String,
      unique: true,
      // required: [true, "Por favor rellena tu correo electrónico"],
      // match: [/.+\@.+\..+/, "Este correo no es válido"],
    },
    password: {
      type: String,
      required: [true, "Por favor rellena tu contraseña"],
    },
    profileImage: {
      type: String, // Puedes almacenar la URL de la imagen de perfil
      default: "default-profile-image.jpg", // URL por defecto
    },
    bio: {
      type: String,
      default: "", // Descripción del usuario
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    posts: [{ type: ObjectId, ref: "Post" }],
    likedPosts: [{ type: ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
