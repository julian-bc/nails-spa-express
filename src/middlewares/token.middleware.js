import { validateTokenAccess } from "../utils/jwt.util.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send({ error: "Token not provided!" });

  try {
    req.user = validateTokenAccess(token);
    console.log(req.user);
    next();
  } catch (error) {
    res.status(403).send({ error: "Invalid Token!" });
  }
}
