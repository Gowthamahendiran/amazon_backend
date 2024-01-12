const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Image", required: true },
  image: { type: String }, // Assuming you want to store the image URL
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
