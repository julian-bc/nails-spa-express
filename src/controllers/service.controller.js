import Service from "../models/service.model.js";

export const getAllServices = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const services = await Service.find()
      .populate("staffCapable", "names email") // 👈 Aquí
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments();

    res.send({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalServices: total,
      services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error fetching paginated services" });
  }
};


export const addStaffToService = async (req, res) => {
  const { id } = req.params;
  const { staffCapable } = req.body; 

  try {
    const service = await Service.findByIdAndUpdate(
      id,
      { $addToSet: { staffCapable: { $each: staffCapable } } }, 
      { new: true }
    );

    if (!service) {
      return res.status(404).send({ error: "Service not found" });
    }

    res.send(service);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error adding staff to service" });
  }
};