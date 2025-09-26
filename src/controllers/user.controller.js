import User from "../models/user.model.js";

export const getAllCustomers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const customers = await User.find({ role: "customer" })
      .select("_id names email phone")
      .skip(skip)
      .limit(limit);
    
      const total = await User.countDocuments({ role: "customer" });

    res.send({
      page,
      limit,
      totalPages: Math.ceil(total/limit),
      totalCustomers: total,
      customers
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error fetching paginated customers" });
  }
}

export const update = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const userUpdated = await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    });

    if (!userUpdated) return res.status(404).send({ error: "User not found!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error is happened to update user" });
  }

  res.send({ message: `User updated with id: ${id} succcessfully!` });
}

export const deleteById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    
    if(!deletedUser) return res.status(404).send({ error: "User not found!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error is happened to save user" });
  }

  res.send({ message: `User deleted with id: ${id} successfully!` });
}
