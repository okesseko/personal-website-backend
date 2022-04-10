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
  releaseTime: {
    type: Date,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("article", ArticleSchema);
