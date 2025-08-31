import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const user = new User({ name, email, password});
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};


