import Appointments from "../models/citas.model.js";
import Service from "../models/service.model.js"; 
import Location from "../models/location.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import {
  buildAppointmentFilter,
  parsePagination,
  buildPaginationMeta,
} from "../utils/appointmentsQueryHelpers.js";

const baseQuery = (filter, skip, limit) =>
  Promise.all([
    Appointments.countDocuments(filter),
    Appointments.find(filter)
      .sort({ "schedule.date": 1, "schedule.start": 1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "service", select: "name price" })
      .populate({ path: "employee", select: "names phone" })
      .populate({ path: "location", select: "name address" })
      .populate({ path: "user", select: "names" }),
  ]);

// GET - Obtener todas las citas
export const getAppointments = async (req, res) => {
  try {
    const { date, from, to, cancelled, page, limit } = req.query;

    const { _page, _limit, skip } = parsePagination({ page, limit });
    const filter = buildAppointmentFilter({ date, from, to, cancelled });

    const [total, items] = await baseQuery(filter, skip, _limit);
    const meta = buildPaginationMeta(total, _page, _limit);

    res.status(200).json({ meta, filter, data: items });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Error al obtener citas." });
  }
};

// GET - Obtener citas por empleado
export const getAppointmentsByEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, from, to, cancelled, page, limit } = req.query;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "ID de empleado inválido." });

    const { _page, _limit, skip } = parsePagination({ page, limit });
    const filter = { employee: new mongoose.Types.ObjectId(id), ...buildAppointmentFilter({ date, from, to, cancelled }) };

    const [total, items] = await baseQuery(filter, skip, _limit);
    const meta = buildPaginationMeta(total, _page, _limit);

    res.status(200).json({ meta, filter, data: items });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Error al obtener citas por empleado." });
  }
};

// GET - Obtener citas por usuario
export const getAppointmentsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, from, to, cancelled, page, limit } = req.query;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "ID de usuario inválido." });

    const { _page, _limit, skip } = parsePagination({ page, limit });
    const filter = { user: new mongoose.Types.ObjectId(id), ...buildAppointmentFilter({ date, from, to, cancelled }) };

    const [total, items] = await baseQuery(filter, skip, _limit);
    const meta = buildPaginationMeta(total, _page, _limit);

    res.status(200).json({ meta, filter, data: items });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Error al obtener citas por usuario." });
  }
};


//Guardar la cita
//Funcion que se encarga meramente de guardar la cita en la base de datos
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


//Insertar la cita a la sede
//Esto nos ayuda a tener claro la disponibilidad de citas
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


// Obtener disponibilidad de citas para un servicio en una sede específica
export const getAvailabilityForServiceInLocation = async (req, res) => {
  try {
    const { idLocation, idService, date } = req.body;

    if (!mongoose.isValidObjectId(idLocation) || !mongoose.isValidObjectId(idService)) {
      return res.status(400).json({ message: "IDs inválidos." });
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Fecha inválida. Formato esperado: YYYY-MM-DD." });
    }

    const service = await Service.findById(idService).select("staffCapable duration");
    const location = await Location.findById(idLocation).select("employees appointments");

    if (!service || !location) {
      return res.status(404).json({ message: "Servicio o sede no encontrados." });
    }

    const availableStaffIds = location.employees.filter(emp =>
      service.staffCapable.map(id => id.toString()).includes(emp.toString())
    );

    if (availableStaffIds.length === 0) {
      return res.status(200).json({ message: "No hay empleados disponibles para este servicio en esta sede." });
    }

    
const staffObjectIds = availableStaffIds.map(id => new mongoose.Types.ObjectId(id));

const appointments = await Appointments.find({
  location: idLocation,
  "schedule.date": date,
  employee: { $in: staffObjectIds }
}).select("employee schedule");


    // Excluir horario de almuerzo
    const lunchBreak = generateTimeSlots("12:00", "14:00", 30);
    const fullDaySlots = generateTimeSlots("08:00", "18:00", 30).filter(slot => !lunchBreak.includes(slot));

    const availabilityMap = {};
    availableStaffIds.forEach(empId => {
      availabilityMap[empId] = [...fullDaySlots];
    });

    appointments.forEach(appointment => {
      const empId = appointment.employee.toString();
      const { start, end } = appointment.schedule;
      const occupiedSlots = generateTimeSlots(start, end, 30);
      availabilityMap[empId] = availabilityMap[empId]?.filter(slot => !occupiedSlots.includes(slot));
      console.log("Cita encontrada:", {
  empId,
  date: appointment.schedule.date,
  start: appointment.schedule.start,
  end: appointment.schedule.end,
  occupiedSlots
});
    });

  

    const populatedEmployees = await User.find({ _id: { $in: availableStaffIds } }).select("names");

    const response = populatedEmployees.map(emp => {
      const empId = emp._id.toString();
      const rawSlots = availabilityMap[empId] || [];
      const validSlots = getAvailableSlotsWithDuration(rawSlots, service.duration);

      return {
        employeeId: emp._id,
        employeeName: emp.names,
        availableSlots: validSlots
      };
    });

    return res.status(200).json({
      date,
      location: idLocation,
      service: idService,
      serviceDuration: service.duration,
      availability: response
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al calcular disponibilidad." });
  }
};


//Esta función encargada de generar los bloques de tiempo
//Entre una hora de inicio y una hora de fin con un intervalo dado (en minutos)
function generateTimeSlots(startTime, endTime, intervalMinutes) {
  const slots = [];
  let [startHour, startMin] = startTime.split(":").map(Number);
  let [endHour, endMin] = endTime.split(":").map(Number);

  let current = new Date(0, 0, 0, startHour, startMin);
  const end = new Date(0, 0, 0, endHour, endMin);

  while (current < end) {
    const hours = current.getHours().toString().padStart(2, "0");
    const minutes = current.getMinutes().toString().padStart(2, "0");
    slots.push(`${hours}:${minutes}`);
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return slots;
}

// Filtrar bloques disponibles que permiten realizar el servicio completo
//Usando la duración del servicio aproximado
function getAvailableSlotsWithDuration(slots, durationMinutes, intervalMinutes = 30) {
  const requiredBlocks = Math.ceil(durationMinutes / intervalMinutes);
  const available = [];

  for (let i = 0; i <= slots.length - requiredBlocks; i++) {
    const chunk = slots.slice(i, i + requiredBlocks);
    const expectedNext = (time) => {
      const [h, m] = time.split(":").map(Number);
      const next = new Date(0, 0, 0, h, m);
      next.setMinutes(next.getMinutes() + intervalMinutes);
      return `${next.getHours().toString().padStart(2, "0")}:${next.getMinutes().toString().padStart(2, "0")}`;
    };

    let isContinuous = true;
    for (let j = 0; j < chunk.length - 1; j++) {
      if (chunk[j + 1] !== expectedNext(chunk[j])) {
        isContinuous = false;
        break;
      }
    }

    if (isContinuous) {
      available.push(chunk[0]); // solo el inicio del bloque válido
    }
  }

  return available;
}