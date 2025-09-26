import config from "../config/config.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const saveEmployee = async (req, res) => {
  const employee = req.body;

  const passwordHashed = await bcrypt.hash(employee.password, config.salt);
  employee.password = passwordHashed;

  const newUser = new User({
      names: employee.names,
      email: employee.email,
      password: passwordHashed,
      salary: employee.salary,
      phone: employee.phone,
      role: "employee"
    });

  try {
    await newUser.save();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error is happened to save employee" });
  }

  res.status(201).send({ message: "employee register successfully!" });
}
