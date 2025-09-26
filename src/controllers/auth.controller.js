import bcrypt from "bcrypt";
import config from "../config/config.js";
import { generateTokenAccess } from "../utils/jwt.util.js";

export const register = async (req, res) => {
  const user = req.body;

  const passwordHashed = await bcrypt.hash(user.password, config.salt);
  user.password = passwordHashed;

  // db save logic
  console.log("User saved:", user);

  res.status(201).send({ message: "register successfully!" });
}

export const login = (req, res) => {
  const user = req.body;

  // db verify email logic
  console.log(`User try access with email:${user.email} pass:${user.password}`);
  // bcrypt verify password logic

  const token = generateTokenAccess(user);
  
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 //1h
  });

  res.send({ message: "login successfully!" });
}

export const logout = (req, res) => {
  res.clearCookie("token");
  res.send({ message: "logout successfully!" });
}
