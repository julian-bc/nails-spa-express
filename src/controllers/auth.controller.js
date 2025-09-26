import bcrypt from "bcrypt";
import config from "../config/config.js";
import { generateTokenAccess } from "../utils/jwt.util.js";
import User from "../models/user.model.js";

export const register = async (req, res) => {
  const user = req.body;

  const passwordHashed = await bcrypt.hash(user.password, config.salt);
  user.password = passwordHashed;

  const newUser = new User({
    names: user.names,
    email: user.email,
    password: passwordHashed,
    salary: null,
    phone: user.phone
  });

  try {
    await newUser.save();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error is happened to save user"} );
  }

  res.status(201).send({ message: "register successfully!" });
}

export const login = async (req, res) => {
  let userSaved = undefined;
  const user = req.body;

  console.log(`User try access with email:${user.email} pass:${user.password}`);
  
  try {
    userSaved = await User.findOne({ email: user.email });

    if (!userSaved) return res.status(404).send(`User not founded with email: ${user.email}`);

    const isMatch = await bcrypt.compare(user.password, userSaved.password);

    if (!isMatch) return res.status(401).send({ error: "Incorrect password!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error is happened to login!" });
  }

  const token = generateTokenAccess(userSaved);
  
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 //1h
  });
  res.cookie("role", userSaved.role, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1h
  });

  res.send({ message: "login successfully!" });
}

export const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("role");
  res.send({ message: "logout successfully!" });
}
