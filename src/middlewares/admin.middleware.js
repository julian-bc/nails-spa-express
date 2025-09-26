export const adminMiddleware = (req, res, next) => {
  const role = req.user.role;

  if (role !== "admin") {
    return res.status(403).send({ error: "Access denied, you don't have sufficient privileges to perform this action!" });
  }

  next();
}
