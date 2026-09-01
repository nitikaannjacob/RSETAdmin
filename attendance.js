import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },

    subjectId: {
      type: String,
      required: true,
    },

    subjectName: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["P", "A"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for the same student,
// subject and date
attendanceSchema.index(
  {
    studentId: 1,
    subjectId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

const Attendance = mongoose.model(
  "Attendance",
  attendanceSchema,
  "attendance"
);

export default Attendance;