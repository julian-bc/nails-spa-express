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
  pictureUrl: {
      type: String,
      trim: true
    }
  });
  
  export default mongoose.model("Service", serviceSchema)