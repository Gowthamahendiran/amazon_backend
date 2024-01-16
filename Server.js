const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Image = require("./imageModel");
const cors = require("cors"); // Import the cors middleware
const app = express();
const PORT = 5000;
const CartItem = require("./cartModel");


app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Amazon_Clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
});


const User = mongoose.model("User", userSchema);



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



  app.post("/api/signup", async (req, res) => {
    const { name, number, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      const newUser = new User({
        name,
        number,
        email,
        password,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred during signup" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Check if the password is correct
      if (password !== user.password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred during login" });
    }
  });
  


  app.post("/api/checkout", async (req, res) => {
    const { productId, image, price, quantity, description, title } = req.body;
  
    try {
      // Assuming you don't need to associate with a specific user
      const cartItem = new CartItem({
        productId,
        image,
        price,
        quantity,
        description,
        title
      });
  
      await cartItem.save();
  
      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred during checkout" });
    }
  });
  

  // Add this to your server.js
app.get("/api/cart", async (req, res) => {
  try {
    // Fetch cart items from the database
    // Replace 'CartItem' with your actual cart item model
    const cartItems = await CartItem.find();
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update your server.js or a separate route file
app.delete("/api/cart/:itemId", async (req, res) => {
  const { itemId } = req.params;

  try {
    const deletedCartItem = await CartItem.findByIdAndDelete(itemId);

    if (!deletedCartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



app.post("/api/uploadd", upload.fields([{ name: "profileImage" }]), async (req, res) => {
    const { title, description, price, category,rating , rated, used, prime, delivery, originalPrice, offerOneDescription, offerOneTitle, offerTwoDescription, offerTwoTitle} = req.body;
  
    try {
      const user = new Image({
        title,
        description,
        price,
        category,
        rating,
        rated,
        used,
        prime,
        delivery,
        originalPrice,
        offerOneDescription,
        offerOneTitle,
        offerTwoDescription,
        offerTwoTitle,
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
      const makeupProducts = await Image.find({ category: 'Makeup' }, { title: 1, description: 1, price: 1, imageData: 1, category: 1 , rating: 1, rated: 1, used: 1, prime: 1, delivery: 1, originalPrice: 1, offerOneDescription:1 , offerOneTitle: 1, offerTwoDescription:1 , offerTwoTitle: 1});
      console.log("Fetched makeup products:", makeupProducts);
      res.status(200).json(makeupProducts);
    } catch (error) {
      console.error("Error fetching makeup products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  app.get("/api/makeup-products/:productId", async (req, res) => {
    const { productId } = req.params;
  
    try {
      const makeupProduct = await Image.findById(productId, {
        title: 1,
        description: 1,
        price: 1,
        imageData: 1,
        category: 1,
        rating: 1,
        rated: 1, 
        used: 1,
        prime: 1,
        delivery: 1,
        originalPrice: 1,
        offerOneDescription:1 ,
        offerOneTitle: 1,
        offerTwoDescription:1 ,
        offerTwoTitle: 1,
      });
  
      if (!makeupProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json(makeupProduct);
    } catch (error) {
      console.error("Error fetching makeup product by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  

  app.get("/api/fashion-products", async (req, res) => {
    try {
      const makeupProducts = await Image.find({ category: 'Home_Ess' }, { title: 1, description: 1, price: 1, imageData: 1, category: 1 , rating: 1, rated: 1, used: 1, prime: 1, delivery: 1, originalPrice: 1, offerOneDescription:1 , offerOneTitle: 1, offerTwoDescription:1 , offerTwoTitle: 1});
      console.log("Fetched makeup products:", makeupProducts);
      res.status(200).json(makeupProducts);
    } catch (error) {
      console.error("Error fetching makeup products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  app.get("/api/fashion-products/:productId", async (req, res) => {
    const { productId } = req.params;
  
    try {
      const makeupProduct = await Image.findById(productId, {
        title: 1,
        description: 1,
        price: 1,
        imageData: 1,
        category: 1,
        rating: 1,
        rated: 1, 
        used: 1,
        prime: 1,
        delivery: 1,
        originalPrice: 1,
        offerOneDescription:1 ,
        offerOneTitle: 1,
        offerTwoDescription:1 ,
        offerTwoTitle: 1,
      });
  
      if (!makeupProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json(makeupProduct);
    } catch (error) {
      console.error("Error fetching makeup product by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  app.get("/api/smart-gadgets", async (req, res) => {
    try {
      const makeupProducts = await Image.find({ category: 'smart' }, { title: 1, description: 1, price: 1, imageData: 1, category: 1 , rating: 1, rated: 1, used: 1, prime: 1, delivery: 1, originalPrice: 1, offerOneDescription:1 , offerOneTitle: 1, offerTwoDescription:1 , offerTwoTitle: 1});
      console.log("Fetched makeup products:", makeupProducts);
      res.status(200).json(makeupProducts);
    } catch (error) {
      console.error("Error fetching makeup products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.get("/api/smart-gadgets/:productId", async (req, res) => {
    const { productId } = req.params;
  
    try {
      const makeupProduct = await Image.findById(productId, {
        title: 1,
        description: 1,
        price: 1,
        imageData: 1,
        category: 1,
        rating: 1,
        rated: 1, 
        used: 1,
        prime: 1,
        delivery: 1,
        originalPrice: 1,
        offerOneDescription:1 ,
        offerOneTitle: 1,
        offerTwoDescription:1 ,
        offerTwoTitle: 1,
      });
  
      if (!makeupProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json(makeupProduct);
    } catch (error) {
      console.error("Error fetching makeup product by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  
  app.get("/api/value-bazaar", async (req, res) => {
    try {
      const makeupProducts = await Image.find({ category: 'value' }, { title: 1, description: 1, price: 1, imageData: 1, category: 1 , rating: 1, rated: 1, used: 1, prime: 1, delivery: 1, originalPrice: 1, offerOneDescription:1 , offerOneTitle: 1, offerTwoDescription:1 , offerTwoTitle: 1});
      console.log("Fetched makeup products:", makeupProducts);
      res.status(200).json(makeupProducts);
    } catch (error) {
      console.error("Error fetching makeup products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.get("/api/value-bazaar/:productId", async (req, res) => {
    const { productId } = req.params;
  
    try {
      const makeupProduct = await Image.findById(productId, {
        title: 1,
        description: 1,
        price: 1,
        imageData: 1,
        category: 1,
        rating: 1,
        rated: 1, 
        used: 1,
        prime: 1,
        delivery: 1,
        originalPrice: 1,
        offerOneDescription:1 ,
        offerOneTitle: 1,
        offerTwoDescription:1 ,
        offerTwoTitle: 1,
      });
  
      if (!makeupProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json(makeupProduct);
    } catch (error) {
      console.error("Error fetching makeup product by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  
  app.get("/api/Dress", async (req, res) => {
    try {
      const makeupProducts = await Image.find({ category: 'Dress' }, { title: 1, description: 1, price: 1, imageData: 1, category: 1 , rating: 1, rated: 1, used: 1, prime: 1, delivery: 1, originalPrice: 1, offerOneDescription:1 , offerOneTitle: 1, offerTwoDescription:1 , offerTwoTitle: 1});
      console.log("Fetched makeup products:", makeupProducts);
      res.status(200).json(makeupProducts);
    } catch (error) {
      console.error("Error fetching makeup products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.get("/api/Dress/:productId", async (req, res) => {
    const { productId } = req.params;
  
    try {
      const makeupProduct = await Image.findById(productId, {
        title: 1,
        description: 1,
        price: 1,
        imageData: 1,
        category: 1,
        rating: 1,
        rated: 1, 
        used: 1,
        prime: 1,
        delivery: 1,
        originalPrice: 1,
        offerOneDescription:1 ,
        offerOneTitle: 1,
        offerTwoDescription:1 ,
        offerTwoTitle: 1,
      });
  
      if (!makeupProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json(makeupProduct);
    } catch (error) {
      console.error("Error fetching makeup product by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });







  app.get("/api/search-results", async (req, res) => {
    const { query } = req.query;
  
    try {
      const searchResults = await Image.find(
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
        { title: 1, description: 1, price: 1, imageData: 1, rating: 1, originalPrice: 1 }
      );
  
      res.status(200).json(searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

  


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
