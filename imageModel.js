const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageData: String, // Store only the file name
    category: String,
  });
  
  const Image = mongoose.model("Image", imageSchema);
  
  module.exports = Image;
  
