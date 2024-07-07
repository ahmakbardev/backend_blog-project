const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middlewares/auth"); // Import middleware

// Like a Post
router.post("/posts/:post_id", authenticate, async (req, res) => {
  try {
    const { post_id } = req.params;
    const { id: user_id } = req.user;

    await db("likes").insert({ post_id, user_id });

    res.status(201).json({ message: "Post liked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Likes Count for a Post
router.get("/posts/:post_id/count", async (req, res) => {
  try {
    const { post_id } = req.params;
    const count = await db("likes").where({ post_id }).count("* as total");

    res.json(count[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
