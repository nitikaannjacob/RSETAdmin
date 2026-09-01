import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

const students = [
  {
    id: "U2403201",
    name: "Aarav Jain",
    rollNo: "1",
    initials: "AJ",
    avatarBg: "bg-[#0b2447] text-white",
    status: "P",
    attendanceRate: 94
  },
  {
    id: "U2403202",
    name: "Sarah Mehta",
    rollNo: "2",
    initials: "SM",
    avatarBg: "bg-[#212527] text-white",
    status: "P",
    attendanceRate: 88
  },
  {
    id: "U2403203",
    name: "Rohan Kumar",
    rollNo: "3",
    initials: "RK",
    avatarBg: "bg-[#e1e3e4] text-[#191c1d]",
    status: "A",
    attendanceRate: 68
  },
  {
    id: "U2403204",
    name: "Priya Sharma",
    rollNo: "4",
    initials: "PS",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    avatarBg: "bg-[#d6e3ff] text-[#011b3e]",
    status: "P",
    attendanceRate: 91
  },
  {
    id: "U2403205",
    name: "Vikram Kapoor",
    rollNo: "5",
    initials: "VK",
    avatarBg: "bg-[#0b2447] text-white",
    status: "P",
    attendanceRate: 82
  },
  {
    id: "U2403206",
    name: "Ananya Rao",
    rollNo: "6",
    initials: "AR",
    avatarBg: "bg-[#e1e3e4] text-[#191c1d]",
    status: "P",
    attendanceRate: 95
  },
  {
    id: "U2403207",
    name: "Karthik Nair",
    rollNo: "7",
    initials: "KN",
    avatarBg: "bg-[#212527] text-white",
    status: "P",
    attendanceRate: 84
  },
  {
    id: "U2403208",
    name: "Meera Patel",
    rollNo: "8",
    initials: "MP",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    avatarBg: "bg-[#d6e3ff] text-[#011b3e]",
    status: "P",
    attendanceRate: 90
  },
  {
    id: "U2403209",
    name: "Aditya Verma",
    rollNo: "9",
    initials: "AV",
    avatarBg: "bg-[#0b2447] text-white",
    status: "A",
    attendanceRate: 71
  },
  {
    id: "U2403210",
    name: "Diya Sengupta",
    rollNo: "10",
    initials: "DS",
    avatarBg: "bg-[#e1e3e4] text-[#191c1d]",
    status: "P",
    attendanceRate: 86
  },
  {
    id: "U2403211",
    name: "Arjun Menon",
    rollNo: "11",
    initials: "AM",
    avatarBg: "bg-[#0b2447] text-white",
    status: "P",
    attendanceRate: 89
  },
  {
    id: "U2403212",
    name: "Nisha Thomas",
    rollNo: "12",
    initials: "NT",
    avatarBg: "bg-[#212527] text-white",
    status: "P",
    attendanceRate: 93
  },
  {
    id: "U2403213",
    name: "Rahul Nair",
    rollNo: "13",
    initials: "RN",
    avatarBg: "bg-[#e1e3e4] text-[#191c1d]",
    status: "A",
    attendanceRate: 72
  },
  {
    id: "U2403214",
    name: "Isha Joseph",
    rollNo: "14",
    initials: "IJ",
    avatarBg: "bg-[#d6e3ff] text-[#011b3e]",
    status: "P",
    attendanceRate: 96
  },
  {
    id: "U2403215",
    name: "Adarsh Kumar",
    rollNo: "15",
    initials: "AK",
    avatarBg: "bg-[#0b2447] text-white",
    status: "P",
    attendanceRate: 87
  },
  {
    id: "U2403216",
    name: "Neha George",
    rollNo: "16",
    initials: "NG",
    avatarBg: "bg-[#212527] text-white",
    status: "P",
    attendanceRate: 91
  },
  {
    id: "U2403217",
    name: "Joel Mathew",
    rollNo: "17",
    initials: "JM",
    avatarBg: "bg-[#e1e3e4] text-[#191c1d]",
    status: "P",
    attendanceRate: 85
  }
];

async function seedStudents() {
  try {
    await client.connect();

    const db = client.db("rset_admin");
    const collection = db.collection("students");

    // Remove old student records
    await collection.deleteMany({});

    // Insert new students
    const result = await collection.insertMany(students);

    console.log(
      `✅ ${result.insertedCount} students inserted into MongoDB!`
    );

  } catch (error) {
    console.error("❌ Error inserting students:", error);

  } finally {
    await client.close();
  }
}

seedStudents();