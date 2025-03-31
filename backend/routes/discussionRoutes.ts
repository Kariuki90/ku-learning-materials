import express from "express";
import { Discussion } from "../models/Discussion";
import { auth } from "../middleware/auth";

const router = express.Router();

// Create discussion
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, courseCode, tags } = req.body;

    const discussion = new Discussion({
      title,
      content,
      author: req.user._id,
      courseCode,
      tags
    });

    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ error: "Error creating discussion" });
  }
});

// Get all discussions with filters
router.get("/", async (req, res) => {
  try {
    const { courseCode, search } = req.query;
    const query: any = {};

    if (courseCode) query.courseCode = courseCode;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const discussions = await Discussion.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(discussions);
  } catch (error) {
    res.status(400).json({ error: "Error fetching discussions" });
  }
});

// Get discussion by ID
router.get("/:id", async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate("author", "name")
      .populate("replies.author", "name");

    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    res.json(discussion);
  } catch (error) {
    res.status(400).json({ error: "Error fetching discussion" });
  }
});

// Add reply to discussion
router.post("/:id/replies", auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    discussion.replies.push({
      author: req.user._id,
      content: req.body.content
    });

    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(400).json({ error: "Error adding reply" });
  }
});

// Like/unlike discussion
router.post("/:id/like", auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    const likeIndex = discussion.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      discussion.likes.push(req.user._id);
    } else {
      discussion.likes.splice(likeIndex, 1);
    }

    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(400).json({ error: "Error updating likes" });
  }
});

// Like/unlike reply
router.post("/:id/replies/:replyId/like", auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    const reply = discussion.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    const likeIndex = reply.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      reply.likes.push(req.user._id);
    } else {
      reply.likes.splice(likeIndex, 1);
    }

    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(400).json({ error: "Error updating reply likes" });
  }
});

export default router;
