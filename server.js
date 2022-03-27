const express = require("express");
const mongoose = require("mongoose");
const articleRouter = require("./routers/article");

const url = "mongodb://localhost:27017/PersonalWeb";

const app = express();

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());

app.use(articleRouter);

app.listen(9000, () => {
  console.log("Server started");
});
