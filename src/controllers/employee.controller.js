import config from "../config/config.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const getAllEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const employees = await User.find({ role: "employee" })
        .select("_id names email salary phone")
        .skip(skip)
        .limit(limit);
      
        const total = await User.countDocuments({ role: "employee" });
  
      res.send({
        page,
        limit,
        totalPages: Math.ceil(total/limit),
        totalEmployees: total,
        employees
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Error fetching paginated customers" });
    }
}

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
