const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("users", LoginSchema);
