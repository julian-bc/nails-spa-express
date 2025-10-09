import Appointments from "../models/citas.model.js";
import Location from "../models/location.model.js";
import mongoose from "mongoose";

export const createAppointment = async (req, res) => {
  try {
    const { service, employee, location, schedule, additionalDescription, user } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!service || !location || !schedule || !schedule.start || !schedule.end || !additionalDescription || !user) {
      return res.status(400).json({ message: "Todos los campos requeridos deben ser proporcionados." });
    }

    // Validar que la hora de inicio sea anterior a la hora de fin
    if (schedule.start >= schedule.end) {
      return res.status(400).json({ message: "La hora de inicio debe ser anterior a la hora de fin." });
    }

    // Validar y convertir IDs a ObjectId
    if (!mongoose.isValidObjectId(service) || !mongoose.isValidObjectId(location) || !mongoose.isValidObjectId(user)) {
      return res.status(400).json({ message: "Uno o más IDs proporcionados no son válidos." });
    }
    if (employee && !mongoose.isValidObjectId(employee)) {
      return res.status(400).json({ message: "El ID del empleado no es válido." });
    }

    const serviceId = new mongoose.Types.ObjectId(service);
    const locationId = new mongoose.Types.ObjectId(location);
    const userId = new mongoose.Types.ObjectId(user);
    const employeeId = employee ? new mongoose.Types.ObjectId(employee) : null;

    // Crear la cita
    const newAppointment = new Appointments({
      service: serviceId,
      employee: employeeId,
      location: locationId,
      schedule,
      additionalDescription,
      user: userId,
      cancelled: false // Por defecto, la cita no está cancelada
    });

    // Guardar en la base de datos
    const savedAppointment = await newAppointment.save();

    // Añadir la cita a la sede correspondiente
    const addToLocationResult = await addAppointmentToLocation(locationId, savedAppointment._id, res);

    // Realizar populate para obtener las propiedades necesarias
    const populatedAppointment = addToLocationResult && await Appointments.findById(savedAppointment._id)
      .populate({ path: 'service', select: 'name price' })
      .populate({ path: 'employee', select: 'names phone' })
      .populate({ path: 'location', select: 'name address' })
      .populate({ path: 'user', select: 'names' });

    return res.status(201).json({
      message: "Cita creada exitosamente.",
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear la cita." });
  }
};

const addAppointmentToLocation = async (idSede, idCita, res) => {
 
  try {
    const location = await Location.findByIdAndUpdate(
      idSede,
      { $addToSet: { appointments:idCita } },
      { new: true }
    );

    if (!location) {
      return "Sede no encontrada";
    }

    return true;
  } catch (error) {
    throw error;
  }
};