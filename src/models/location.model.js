import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  schedule: {
    type: String,
    required: true,
    trim: true
  },
  manager: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  employees: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  pictureUrl: {
    type: String,
    trim: true
  },
  appointments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Appointments" }
  ]
});

export default mongoose.model("Location", locationSchema)