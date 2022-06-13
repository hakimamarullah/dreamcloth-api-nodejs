const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
  {
    prductName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    img: { type: String },
    categories: { type: Array },
    color: { type: String},
    size: { type: String},
    price: {type: Number, required:true},
    stock: {type: Number, default:0},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
