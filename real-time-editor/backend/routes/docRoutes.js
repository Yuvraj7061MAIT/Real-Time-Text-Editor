const express = require("express");
const router = express.Router();
const Document = require("../models/Document");

// Create a new document
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (typeof content !== "string") {
      return res.status(400).json({ message: "Invalid content format" });
    }

    const doc = new Document({ content });
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Fetch a document by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: "Error fetching document", error: error.message });
  }
});

// Update document content
router.patch("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: "Error updating document", error: error.message });
  }
});

module.exports = router;
