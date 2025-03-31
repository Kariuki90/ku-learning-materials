import express from "express";
import { Material } from "../models/Material";
import { auth, adminAuth } from "../middleware/auth";
import { uploadToCloudinary } from "../utils/cloudinary";

const router = express.Router();

// Upload material
router.post("/upload", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      faculty,
      department,
      courseCode,
      courseName,
      year,
      semester,
      fileUrl,
      fileType,
      tags
    } = req.body;

    const material = new Material({
      title,
      description,
      fileUrl,
      fileType,
      faculty,
      department,
      courseCode,
      courseName,
      year,
      semester,
      uploadedBy: req.user._id,
      tags
    });

    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: "Error uploading material" });
  }
});

// Get all materials with filters
router.get("/", async (req, res) => {
  try {
    const {
      faculty,
      department,
      courseCode,
      year,
      semester,
      search
    } = req.query;

    const query: any = { status: "approved" };

    if (faculty) query.faculty = faculty;
    if (department) query.department = department;
    if (courseCode) query.courseCode = courseCode;
    if (year) query.year = year;
    if (semester) query.semester = semester;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { courseName: { $regex: search, $options: "i" } }
      ];
    }

    const materials = await Material.find(query)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    res.status(400).json({ error: "Error fetching materials" });
  }
});

// Get material by ID
router.get("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("uploadedBy", "name")
      .populate("comments.userId", "name");

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    res.json(material);
  } catch (error) {
    res.status(400).json({ error: "Error fetching material" });
  }
});

// Update material
router.patch("/:id", auth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    if (material.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    Object.assign(material, req.body);
    await material.save();

    res.json(material);
  } catch (error) {
    res.status(400).json({ error: "Error updating material" });
  }
});

// Delete material
router.delete("/:id", auth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    if (material.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await material.remove();
    res.json({ message: "Material deleted" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting material" });
  }
});

// Add comment to material
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    material.comments.push({
      userId: req.user._id,
      text: req.body.text
    });

    await material.save();
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: "Error adding comment" });
  }
});

// Rate material
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    const existingRating = material.ratings.find(
      (rating) => rating.userId.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = req.body.rating;
    } else {
      material.ratings.push({
        userId: req.user._id,
        rating: req.body.rating
      });
    }

    await material.save();
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: "Error rating material" });
  }
});

// Approve material (admin only)
router.patch("/:id/approve", auth, adminAuth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    material.status = "approved";
    await material.save();

    res.json(material);
  } catch (error) {
    res.status(400).json({ error: "Error approving material" });
  }
});

export default router;
