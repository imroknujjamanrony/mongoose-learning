// Required Modules
const express = require("express");
const mongoose = require("mongoose");

// App Initialization
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection Function
const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Optional: exit the app if DB connection fails
  }
};

//schema making as it is mongoose schema
const blogSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Model Creation
const Blog = mongoose.model("Blog", blogSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/blog", async (req, res) => {
  try {
    const { title, price, description } = req.body;

    // Check for missing fields
    if (!title || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBlog = new Blog({ title, price, description });
    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Server Listener
app.listen(port, async () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
  await connectToMongoDB();
});
