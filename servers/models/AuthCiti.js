const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique:true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false
    },

    role: {
      type: String,
      enum: ["citizen", "worker", "manager", "admin"],
      default: "citizen"
    },

    department: {
      type: String,
      enum: [
        "water",
        "electricity",
        "roads",
        "sanitation",
        "global",
        "none"
      ],
      default: "none",

      validate: {
        validator: function (value) {
          // Worker, Manager and Admin must belong to a department
          if (["worker", "manager", "admin"].includes(this.role)) {
            return value !== "none";
          }

          return true;
        },
        message:
          "Worker, Manager and Admin accounts must have a valid department."
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema); ///how auto disabled and how it works