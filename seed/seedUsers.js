import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});

    const password = "password123";
    const passwordHash = await bcrypt.hash(password, 10);

    const demoUsers = [
      {
        fullName: "Łukasz 123",
        email: "łukasz123@example.com",
        passwordHash,
      },
      {
        fullName: "Test User",
        email: "testqwerty@gmail.com",
        passwordHash,
      },
    ];

    const insertedUsers = await User.insertMany(demoUsers);

    console.log("Sample seeded:");
    insertedUsers.forEach((u) =>
      console.log(`- ${u.fullName} | email: ${u.email} | password: ${password}`)
    );

    process.exit();
  } catch (err) {
    console.error("Error seeding", err.message);
    process.exit(1);
  }
};

seedUsers();
