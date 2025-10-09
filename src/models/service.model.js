import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  staffCapable: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
  ],
  duration: {
    type: Number, // duración va a ser en minutos
    required: true
  },
  pictureUrl: {
      type: String,
      trim: true
    }
  });
  
  export default mongoose.model("Service", serviceSchema)