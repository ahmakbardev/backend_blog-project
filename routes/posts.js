const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middlewares/auth");

// Create Post
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id: author_id } = req.user;

    const [id] = await db("posts").insert({ title, content, author_id });

    const post = await db("posts").where({ id }).first();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all posts
router.get("/", async (req, res) => {
  try {
    const posts = await db("posts")
      .join("users", "posts.author_id", "users.id")
      .select(
        "posts.id",
        "posts.title",
        "posts.content",
        "users.username as author"
      );

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Post by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db("posts").where({ id }).first();

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Post
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    await db("posts")
      .where({ id })
      .update({ title, content, updated_at: db.fn.now() });

    const post = await db("posts").where({ id }).first();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Post
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    await db("posts").where({ id }).del();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
