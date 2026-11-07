const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    
    department: { type: String, trim: true }, // Removed single index (handled by compound below)

    location: { lat: Number, lng: Number },
    image: String,

    status: {
      type: String,
      enum: ["Reported", "Assigned", "In Progress", "Resolved"],
      default: "Reported",
      index: true // Keeps getIssueStats() lightning fast
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      index: true // Keeps getIssuesByPriority() lightning fast
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
      // Removed single index because it's covered by the compound index below!
    }
  },
  {
    timestamps: true // This automatically manages createdAt and updatedAt fields
  }
);

// ==========================================
// PERFECTED COMPOUND INDEXES
// ==========================================

// 1. FIXES YOUR MAIN dashboard 'getIssues' bottleneck (Filters department, sorts by newest)
issueSchema.index({ department: 1, createdAt: -1 });

// 2. OPTIMIZES 'getAssignedIssues' (Filters by official, sorts by newest)
issueSchema.index({ assignedTo: 1, createdAt: -1 });

// Note: { createdAt: -1 } is built-in implicitly by the compound indexes above 
// when searching, but you can keep it if you query completely unfiltered global timelines.

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;