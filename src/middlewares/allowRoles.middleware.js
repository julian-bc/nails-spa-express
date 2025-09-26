export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).send({ error: "Access denied, you don't have sufficient privileges to perform this action!" });
    }
    
    next();
  }
}
