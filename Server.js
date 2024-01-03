const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Image = require("./imageModel");
const cors = require("cors"); // Import the cors middleware
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Amazon_Clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads"); // Ensure this path is correct
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });


  app.use('/uploads', express.static('uploads'));


// Handle image and text data upload
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const { originalname, buffer, mimetype } = req.file;

    const newImage = new Image({
      title: title,
      description: description,
      price: price,
      imageData: {
        name: originalname,
        data: buffer,
        contentType: mimetype,
      },
    });

    await newImage.save();

    res.status(201).json({ message: "Image and data uploaded successfully" });
  } catch (error) {
    console.error("Error uploading image and data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






// app.post("/api/uploadd", upload.fields([
//     { name: "profileImage" }
    
//   ]), async (req, res) => {
//     const {
//       title,
//       description,
//       price,
//       selectedDegree,
//     } = req.body;
  
//     try {
//       const user = new Image({
//         title,
//         description,
//         price,
//         selectedDegree,
//         profileImage: req.files["profileImage"][0].filename,
//       });
  
//       await user.save();
//       res.status(201).json({ message: "Success Mock" });
//     } catch (error) {
//       console.error(error); // Log the actual error for debugging
//       res.status(500).json({ error: "An Error Occurred" });
//     }
//   });
  


app.post("/api/uploadd", upload.fields([{ name: "profileImage" }]), async (req, res) => {
    const { title, description, price, category } = req.body;
  
    try {
      const user = new Image({
        title,
        description,
        price,
        category,
        imageData: req.files["profileImage"][0].filename, // Save only the file name
      });
  
      await user.save();
      res.status(201).json({ message: "Success Mock" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An Error Occurred" });
    }
  });

  

  app.get("/api/makeup-products", async (req, res) => {
    try {
      const makeupProducts = await Image.find({ category: 'Makeup' }, { title: 1, description: 1, price: 1, imageData: 1, category: 1 });
      console.log("Fetched makeup products:", makeupProducts);
      res.status(200).json(makeupProducts);
    } catch (error) {
      console.error("Error fetching makeup products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.get("/api/fashion-products", async (req, res) => {
    try {
      const makeupProducts = await Image.find({ category: 'B' }, { title: 1, description: 1, price: 1, imageData: 1, category: 1 });
      console.log("Fetched makeup products:", makeupProducts);
      res.status(200).json(makeupProducts);
    } catch (error) {
      console.error("Error fetching makeup products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  app.get("/api/search-results", async (req, res) => {
    const { query } = req.query;
  
    try {
      // Implement logic to search the database based on the query
      // For example, you might use a regular expression to search for matching titles or descriptions
      const searchResults = await Image.find({
        $or: [
          { title: { $regex: query, $options: "i" } }, // Case-insensitive search
          { description: { $regex: query, $options: "i" } },
        ],
      });
  
      res.status(200).json(searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
