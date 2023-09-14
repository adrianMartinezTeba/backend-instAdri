const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/nodemailer");
require("dotenv").config();
const UserController = {
  async register(req, res) {
    try {
      const { file, body: { username, password, email, bio } } = req;

      console.log(file);
      const filename = req.file ? req.file.filename : undefined;
      console.log(filename);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        bio,
        password: hashedPassword,
        profileImage: filename
      });

      const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '48h' });
      const url = `https://back-inst-adri.vercel.app/users/confirmRegister/${emailToken}`;

      await transporter.sendMail({
        to: email,
        subject: "Confirme su registro",
        html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
        <a href="${url}"> Click para confirmar tu registro</a> 
        Confirme su correo en 48 horas`,
      });

      console.log("Usuario registrado con exito", user);
      res.status(201).send({ message: "Usuario registrado con exito", user });
    } catch (error) {
      console.error(error);
    }
  },
  async confirm(req, res) {
    try {
      const token = req.params.emailToken;

      const payload = jwt.verify(token, process.env.JWT_SECRET); // Usar process.env.JWT_SECRET

      await User.findOneAndUpdate({ email: payload.email }, { confirmed: true });
      res.status(201).send("Usuario confirmado con éxito");
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async searchByName(req, res) {
    try {
      const name = req.params.name;
      const users = await User.find({ username: { $regex: name, $options: "i" } });
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Ha habido un problema al buscar usuarios por nombre" });
    }
  },
  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      })
      if (!user) {
        return res.status(400).send({ message: "Usuario o contraseña incorrectos" })
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Usuario o contraseña incorrectos" })
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: "Bienvenid@ " + user.username, user, token });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);


    }
  },
  async logout(req, res) {
    try {
      // borrar todas las sesiones
      // await User.findByIdAndUpdate(req.user._id, {
      //     tokens: [] ,
      //   });
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: "Desconectado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al intentar desconectar al usuario",
      });
    }
  },
  async getInfoById(req, res) {
    try {
      const user = await User.findById(req.user._id).populate('posts').populate('followers').populate('following');
      res.send(user);
    } catch (error) {
      console.error(error);
    }
  },
  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.send(users);
    } catch (error) {
      console.error(error);
    }
  },
  async recoverPassword(req, res) {
    try {
      const recoverToken = jwt.sign({ email: req.params.email }, process.env.JWT_SECRET, {
        expiresIn: "48h",
      });
      const url = 'https://back-inst-adri.vercel.app' + "/users/resetPassword/" + recoverToken;
      await transporter.sendMail({
        to: req.params.email,
        subject: "Recuperar contraseña",
        html: `<h3> Recuperar contraseña </h3>
    <a href="${url}">Recuperar contraseña</a>
    El enlace expirará en 48 horas
    `,
      });
      res.send({
        message: "Un correo de recuperación se envio a tu dirección de correo",
      });
    } catch (error) {
      console.error(error);
    }
  },
  async resetPassword(req, res) {
    try {
      const recoverToken = req.params.recoverToken;
      const payload = jwt.verify(recoverToken, process.env.JWT_SECRET);
      await User.findOneAndUpdate(
        { email: payload.email },
        { password: req.body.password }
      );
      res.send({ message: "contraseña cambiada con éxito" });
    } catch (error) {
      console.error(error);
    }
  },
  async followUser(req, res) {
    const userId = req.params._id;
    const loggedInUserId = req.user._id; // Suponiendo que tienes un middleware para autenticar al usuario
    try {
      // Agrega el usuario seguido a la lista de following del usuario logueado
      const userWhoFollowed = await User.findByIdAndUpdate(
        loggedInUserId,
        { $addToSet: { following: userId } },
        { new: true }
      );
      // Agrega el usuario logueado a la lista de followers del usuario seguido
      const userFollowed = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { followers: loggedInUserId } },
        { new: true }
        );
      return res.send({ message: 'Usuario seguido exitosamente', userFollowed, userWhoFollowed });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al seguir al usuario' });
    }
  },
  async unFollow(req, res) {
    const userId = req.params._id;
    const loggedInUserId = req.user._id;

    try {
      const userWhoUnFollow = await User.findByIdAndUpdate(
        loggedInUserId,
        { $pull: { following: userId } },
        { new: true }
      );

      const userUnfollowed = await User.findByIdAndUpdate(
        userId,
        { $pull: { followers: loggedInUserId } },
        { new: true }
      );

      return res.json({ message: 'Dejaste de seguir al usuario exitosamente', userUnfollowed, userWhoUnFollow });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al dejar de seguir al usuario' });
    }
  },
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params._id).populate('posts');
      res.send({ message: "Usuario encontrado", user });
    } catch (error) {
      console.error(error);
    }
  },
  async checkIfFollows(req, res) {
    try {
      const userLogged = await User.findById(req.user._id);
      const user = await User.findById(req.params._id);
  
      if (!userLogged || !user) {
        return res.status(404).json({ error: 'Uno o ambos usuarios no existen' });
      }
  
      // Comprueba si el primer usuario sigue al segundo
      const isUserLoggedFollowingUser = userLogged.following.includes(user._id);
      return res.json({ isUserLoggedFollowingUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al verificar si los usuarios se siguen mutuamente' });
    }
  }

};



module.exports = UserController;
