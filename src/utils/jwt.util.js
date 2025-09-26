import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateTokenAccess = (user) => {
  const payload = {
    email: user.email,
    role: user.role,
  }

  return jwt.sign(
    payload,
    config.tokenSecret,
    { expiresIn: "1h" }
  );
}

export const validateTokenAccess = (token) => {
  return jwt.verify(token, config.tokenSecret);
}
