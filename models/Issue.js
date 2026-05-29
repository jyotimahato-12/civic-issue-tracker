const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({

  title: { 
    type: String, 
    required: true 
  },

  description: { 
    type: String, 
    required: true 
  },

  department: String,

  location: {
    lat: Number,
    lng: Number
  },

  image: String,

  status: {
    type: String,
    enum: ["Reported", "Assigned", "In Progress", "Resolved"],
    default: "Reported"
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }

}, { timestamps: true });

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;