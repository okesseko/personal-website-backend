const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  previewImg: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  releaseTime: {
    type: Date,
  },
  emotionIcon: {
    type: String,
  },
  emotionNumber: {
    type: Number,
  },
  status: {
    type: Number,
    required: true,
    default: 1,
  },
});

module.exports = mongoose.model("article", ArticleSchema);
