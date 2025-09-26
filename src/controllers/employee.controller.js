import config from "../config/config.js";
import bcrypt from "bcrypt";

export const saveEmployee = async (req, res) => {
  const employee = req.body;

  const passwordHashed = await bcrypt.hash(employee.password, config.salt);
  employee.password = passwordHashed;

  // db save logic
  console.log("Employee saved:", employee);

  res.status(201).send({ message: "employee register successfully!" });
}
