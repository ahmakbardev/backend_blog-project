const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middlewares/auth");

// Record View
router.post("/posts/:post_id", authenticate, async (req, res) => {
  try {
    const { post_id } = req.params;
    const { id: user_id } = req.user;

    await db("views").insert({ post_id, user_id });

    res.status(201).json({ message: "View recorded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Views Count for a Post
router.get("/posts/:post_id/count", async (req, res) => {
  try {
    const { post_id } = req.params;
    const count = await db("views").where({ post_id }).count("* as total");

    res.json(count[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
