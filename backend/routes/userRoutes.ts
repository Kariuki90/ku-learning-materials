import express from "express";
import { User } from "../models/User";
import { auth } from "../middleware/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department, yearOfStudy } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      department,
      yearOfStudy
    });

    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: "Error creating user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: "Error logging in" });
  }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Error fetching profile" });
  }
});

export default router;
