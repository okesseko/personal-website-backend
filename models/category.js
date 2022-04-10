const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("category", CategorySchema);
