const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
  {
    productName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    img: { type: String, default:"-"},
    categories: { type: Array, default:[] },
    color: { type: Array},
    size: { type: Array, default:[]},
    price: {type: Number, required:true},
    stock: {type: Number, default:0},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
