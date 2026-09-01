import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Attendance from "./attendance.js";

const app = express();
const PORT = 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ==========================================
// MONGODB CONNECTION
// ==========================================

const MONGO_URI =
  "mongodb://jacobnitika06_db_user:9JXmwlw4mwoshTnr@ac-cnlwskm-shard-00-00.37pjixk.mongodb.net:27017,ac-cnlwskm-shard-00-01.37pjixk.mongodb.net:27017,ac-cnlwskm-shard-00-02.37pjixk.mongodb.net:27017/rset_admin?ssl=true&replicaSet=atlas-x741na-shard-0&authSource=admin&appName=Cluster0";

// ==========================================
// STUDENT SCHEMA
// ==========================================

const studentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    rollNo: {
      type: String,
      required: true,
    },

    initials: {
      type: String,
      required: true,
    },

    avatarBg: {
      type: String,
      default: "bg-[#000f27] text-white",
    },

    avatar: {
      type: String,
      default: "",
    },

    // NOTE:
    // This is kept for compatibility with your existing
    // students collection.
    // Attendance records are now stored separately
    // in the attendance collection.
    status: {
      type: String,
      enum: ["P", "A"],
      default: "A",
    },

    attendanceRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// STUDENT MODEL
// ==========================================

const Student = mongoose.model(
  "Student",
  studentSchema,
  "students"
);

// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("======================================");
    console.log("MongoDB connected successfully");
    console.log("Database: rset_admin");
    console.log("======================================");

    const count = await Student.countDocuments();

    console.log("Students in database: " + count);

    if (count === 0) {
      console.log(
        "WARNING: students collection is empty."
      );
    }
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working!",
  });
});

// ==========================================
// GET ALL STUDENTS
// ==========================================

app.get("/api/students", async (req, res) => {
  try {
    console.log("Loading students from MongoDB...");

    const students = await Student.find({})
      .sort({ rollNo: 1 })
      .lean();

    console.log(
      "Found " + students.length + " students."
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
});

// ==========================================
// GET ONE STUDENT
// ==========================================

app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findOne({
      id: req.params.id,
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
});

// ==========================================
// ADD STUDENT
// ==========================================

app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);

    const savedStudent = await student.save();

    console.log(
      "Student added: " + savedStudent.name
    );

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Error adding student:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE STUDENT
// ==========================================

app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent =
      await Student.findOneAndUpdate(
        {
          id: req.params.id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log(
      "Student updated: " + updatedStudent.name
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE STUDENT
// ==========================================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent =
      await Student.findOneAndDelete({
        id: req.params.id,
      });

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log(
      "Student deleted: " + deletedStudent.name
    );

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    console.error("Error deleting student:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
});

// ==========================================
// GET ATTENDANCE FOR SUBJECT + DATE
// ==========================================

app.get("/api/attendance", async (req, res) => {
  try {
    const { subjectId, date } = req.query;

    if (!subjectId || !date) {
      return res.status(400).json({
        success: false,
        message: "subjectId and date are required",
      });
    }

    console.log("======================================");
    console.log("Loading attendance...");
    console.log("Subject ID:", subjectId);
    console.log("Date:", date);

    const attendance = await Attendance.find({
      subjectId,
      date,
    }).lean();

    console.log(
      "Attendance records found: " +
        attendance.length
    );

    console.log("======================================");

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
});

// ==========================================
// SAVE / UPDATE ATTENDANCE
// ==========================================

app.post("/api/attendance", async (req, res) => {
  try {
    const {
      studentId,
      subjectId,
      subjectName,
      date,
      status,
    } = req.body;

    // ==========================================
    // VALIDATE REQUEST
    // ==========================================

    if (
      !studentId ||
      !subjectId ||
      !subjectName ||
      !date ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required attendance information.",
      });
    }

    if (!["P", "A"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Attendance status must be P or A.",
      });
    }

    // ==========================================
    // SAVE OR UPDATE
    // ==========================================

    const attendance =
      await Attendance.findOneAndUpdate(
        {
          studentId,
          subjectId,
          date,
        },
        {
          studentId,
          subjectId,
          subjectName,
          date,
          status,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    console.log("======================================");
    console.log("Attendance saved successfully");
    console.log("Student:", studentId);
    console.log("Subject:", subjectName);
    console.log("Date:", date);
    console.log("Status:", status);
    console.log("======================================");

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error saving attendance:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save attendance.",
      error: error.message,
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log("");
  console.log("======================================");
  console.log("RSET Admin Backend Started");
  console.log("======================================");
  console.log(
    "Server: http://localhost:" + PORT
  );
  console.log(
    "Test: http://localhost:" +
      PORT +
      "/api/test"
  );
  console.log(
    "Students: http://localhost:" +
      PORT +
      "/api/students"
  );
  console.log(
    "Attendance: http://localhost:" +
      PORT +
      "/api/attendance"
  );
  console.log("======================================");
  console.log("");
});