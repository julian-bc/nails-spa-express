import bcrypt from "bcrypt";
import config from "../config/config.js";
import { generateTokenAccess, validateTokenAccess } from "../utils/jwt.util.js";
import User from "../models/user.model.js";

export const register = async(req, res) => {
  let userSaved = undefined;
  const user = req.body;

  console.log(`Register user with email: ${user.email}`);
  const passwordHashed = await bcrypt.hash(user.password, config.salt);
  user.password = passwordHashed;

  const newUser = new User({
    names: user.names,
    email: user.email,
    password: passwordHashed,
    phone: user.phone
  });

  try {
    userSaved = await User.findOne({ email: newUser.email })
    if (userSaved) {
      return res.status(409).send({ error: `Usuario con email: ${newUser.email} se encuentra asociado a una cuenta, intente registrarse con otro email` });
    }
    
    await newUser.save();
  } catch (err) {
    return res.status(500).send({ 
      error: "Ocurrio un error al guardar el usuario",
      ...(config.nodeEnv !== "production" && { stack: err.stack })
    });
  }

  res.status(201).send({ message: "Registro exitoso" });
}

export const login = async(req, res) => {
  let userSaved = undefined;
  const user = req.body;

  try {
    userSaved = await User.findOne({ email: user.email });

    if (!userSaved) return res.status(404).send(`Usuario no encontrado con el correo electrónico: ${user.email}`);

    const isMatch = await bcrypt.compare(user.password, userSaved.password);

    if (!isMatch) return res.status(401).send({ error: "Contraseña incorrecta" });
    
    userSaved.recoveryCode = null;
    await userSaved.save();
  } catch (err) {
    return res.status(500).send({ 
      error: "Ocurrio un error al iniciar sesión",
      ...(config.nodeEnv !== "production" && { stack: err.stack })
    });
  }

  const token = generateTokenAccess(userSaved);
  
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  });
  res.cookie("role", userSaved.role, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  });
  res.cookie("userId", userSaved._id, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  });

  res.send({ message: "Inicio de sesión exitoso" });
}

export const logout = (_req, res) => {
  res.clearCookie("token");
  res.clearCookie("role");
  res.clearCookie("userId");
  res.send({ message: "Cierre de sesión exitoso" });
}

export const check = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ authenticated: false, error: 'Token no encontrado' });
  }

  try {
    const userData = validateTokenAccess(token)
    return res.send({ authenticated: true,  role: userData.role });
  } catch (error) {
    return res.status(401).send({ authenticated: false, error: 'Token inválido o expirado' });
  }
}