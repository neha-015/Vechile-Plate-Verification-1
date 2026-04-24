const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

// API for OCR + validation
app.post("/verify", upload.single("image"), async (req, res) => {
  try {
    const result = await Tesseract.recognize(req.file.path, "eng");
    let text = result.data.text.replace(/\s/g, "").toUpperCase();

    const pattern = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

    if (pattern.test(text)) {
      res.json({ success: true, plate: text });
    } else {
      res.json({ success: false, plate: text });
    }
  } catch (err) {
    res.json({ error: "Processing failed" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
