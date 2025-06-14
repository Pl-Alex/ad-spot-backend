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

    const users = [
      {
        fullName: "Anna Kowalska",
        email: "anna.kowalska@example.com",
        passwordHash,
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b332c5db?w=150&h=150&fit=crop&crop=face",
      },
      {
        fullName: "Piotr Nowak",
        email: "piotr.nowak@example.com",
        passwordHash,
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      {
        fullName: "Maria Wiśniewska",
        email: "maria.wisniewska@example.com",
        passwordHash,
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
      {
        fullName: "Jakub Wójcik",
        email: "jakub.wojcik@example.com",
        passwordHash,
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      {
        fullName: "Katarzyna Kowalczyk",
        email: "katarzyna.kowalczyk@example.com",
        passwordHash,
        avatarUrl:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
      },
      {
        fullName: "Michał Lewandowski",
        email: "michal.lewandowski@example.com",
        passwordHash,
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      {
        fullName: "Agnieszka Dąbrowska",
        email: "agnieszka.dabrowska@example.com",
        passwordHash,
        avatarUrl:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      },
    ];

    const insertedUsers = await User.insertMany(users);

    console.log("Seeded ${insertedUsers.length} users (password: ${password})");
    process.exit();
  } catch (err) {
    console.error("Error seeding users:", err.message);
    process.exit(1);
  }
};

seedUsers();
