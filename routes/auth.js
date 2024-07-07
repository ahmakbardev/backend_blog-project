const express = require("express");
const router = express.Router();
const db = require("../db");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/auth");
const authenticate = require("../middlewares/auth");

// Register Endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, pic, bio, tgl_lahir } = req.body;
    const hashedPassword = await hashPassword(password);

    const [id] = await db("users").insert({
      username,
      email,
      password: hashedPassword,
      pic: pic || "",
      bio: bio || "",
      tgl_lahir: tgl_lahir || null,
    });

    const user = await db("users").where({ id }).first();

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      pic: user.pic,
      bio: user.bio,
      tgl_lahir: user.tgl_lahir,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db("users").where({ email }).first();

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        pic: user.pic,
        bio: user.bio,
        tgl_lahir: user.tgl_lahir,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await db("users").where({ id: req.user.id }).first();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout Endpoint
router.post("/logout", authenticate, (req, res) => {
  res.json({ message: "Logout successful" });
});

module.exports = router;
