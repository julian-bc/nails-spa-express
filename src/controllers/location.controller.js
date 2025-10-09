import Location from "../models/location.model.js";

export const getAllLocations = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const locations = await Location.find()
      .populate("employees", "names email")
      .populate("appointments", "schedule service")
      .skip(skip)
      .limit(limit);

    const total = await Location.countDocuments();

    res.send({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalLocations: total,
      locations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error fetching paginated locations" });
  }
};

export const getLocationById = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id)
      .populate("employees", "names email")
      .populate("appointments", "schedule service");
    if (!location) {
      return res.status(404).send({ error: "Location not found" });
    }
    res.send(location);
  } catch (error) { 
    console.error(error);
    res.status(500).send({ error: "Error fetching location by ID" });
  }
}

export const addEmployeesToLocation = async (req, res) => {
  const { id } = req.params; 
  const { employees } = req.body;

  try {
    const location = await Location.findByIdAndUpdate(
      id,
      { $addToSet: { employees: { $each: employees } } },
      { new: true }
    ).populate("employees", "names email");

    if (!location) {
      return res.status(404).send({ error: "Location not found" });
    }

    res.send(location);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error adding employees to location" });
  }
};
