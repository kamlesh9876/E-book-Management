const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded files as static

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bookManagement", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the Book schema without the quantity field
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  date: String,
  pdfPath: String, // To store the PDF file path
});

const Book = mongoose.model("Book", bookSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Route to add a new book
app.post("/add-book", upload.single("bookFile"), async (req, res) => {
  try {
    // Log the incoming data for debugging
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    // Extract data from the request body
    const { title, author, date } = req.body;
    const pdfPath = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if all required fields are present
    if (!title || !author || !date || !pdfPath) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new Book document
    const newBook = new Book({
      title,
      author,
      date,
      pdfPath,
    });

    // Save the new book to the database
    await newBook.save();
    console.log("Book saved successfully");
    res.status(201).json({ message: "Book saved successfully" });
  } catch (error) {
    console.error("Error saving book:", error);
    res.status(500).json({ message: "Failed to save book" });
  }
});

// Route to get all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
