import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  names: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salary: Number,
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'employee'],
    default: 'customer'
  }
});

export default mongoose.model("User", userSchema)
