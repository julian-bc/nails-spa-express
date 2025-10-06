import mongoose from "mongoose";

const appointmentsSchema = mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId, ref: "Service",
    required: true,
    trim: true
  },
  employee: { 
    type: mongoose.Schema.Types.ObjectId, ref: "User" 
  },
  location: {
    type: mongoose.Schema.Types.ObjectId, ref: "Location",
    required: true,
    trim: true
  },
   schedule: {
    date: { type: String, required: true }, // Fecha en formato YYYY-MM-DD
    start: { type: String, required: true }, // Hora de inicio en formato HH:mm
    end: { type: String, required: true }    // Hora de fin en formato HH:mm
  },
  additionalDescription: {
    type: String,
    required: true,
    trim: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, ref: "User" 
},
cancelled: {
    type: Boolean,
    trim: true
  }
  
  
});

export default mongoose.model("Appointments", appointmentsSchema)