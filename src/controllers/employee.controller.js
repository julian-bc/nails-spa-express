import config from "../config/config.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const getAllEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const employees = await User.find({ role: "employee" })
        .select("_id names email salary phone locations")
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
      role: "employee",
      locations: employee.locations
    });

  try {
    await newUser.save();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error ocurred saving the employee" });
  }

  res.status(201).send({ message: "employee register successfully!" , body: newUser });
}

export const addLocationsToUser = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const { locations } = req.body; // Array de IDs de sedes

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $addToSet: { locations: { $each: locations } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al añadir sedes al usuario" });
  }
};
