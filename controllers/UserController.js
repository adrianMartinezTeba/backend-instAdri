const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/nodemailer");
require("dotenv").config();
const UserController = {
  async register(req, res) {
    try {
      const password = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({ ...req.body, password })
      const emailToken = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '48h' })//incriptado email
      const url = 'https://back-rutin-adri.vercel.app/users/confirmRegister/' + emailToken
      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme su registro",
        html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
    <a href="${url}"> Click para confirmar tu registro</a> 
    Confirme su correo en 48 horas`,
      }); res.status(201).send({ message: "Usuario registrado con exito", user });
    } catch (error) {
      console.error(error);

    }
  },
  async confirm(req, res) {
    try {
      const token = req.params.emailToken;
  
      const payload = jwt.verify(token, process.env.JWT_SECRET); // Usar process.env.JWT_SECRET
  
      await User.findOneAndUpdate({ email: payload.email }, { confirmed: true });
      res.status(201).send("Usuario confirmado con éxito" );
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
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
      res.send({ message: "Bienvenid@ " + user.name,user, token });
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
      const user = await User.findById(req.user._id)
      res.send(user);
    } catch (error) {
      console.error(error);
    }
  },
  async recoverPassword(req, res) {
    try {
      const recoverToken = jwt.sign({ email: req.params.email }, process.env.JWT_SECRET, {
        expiresIn: "48h",
      });
      const url = 'https://back-rutin-adri.vercel.app' + "/users/resetPassword/" + recoverToken;
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

};

module.exports = UserController;
