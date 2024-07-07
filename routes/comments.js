const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middlewares/auth");

// Create Comment
router.post("/", authenticate, async (req, res) => {
  try {
    const { post_id, content } = req.body;
    const { id: author_id } = req.user;

    const [id] = await db("comments").insert({ post_id, content, author_id });

    const comment = await db("comments").where({ id }).first();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Comments for a Post
router.get("/posts/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const comments = await db("comments").where({ post_id });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Comment
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    await db("comments")
      .where({ id })
      .update({ content, updated_at: db.fn.now() });

    const comment = await db("comments").where({ id }).first();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Comment
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    await db("comments").where({ id }).del();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
