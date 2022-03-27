const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const articleRouter = require("./routers/article");

const url = "mongodb://localhost:27017/PersonalWeb";
const corsOptions = {
  origin: ["http://www.example.com", "http://localhost:8000"],
};

const app = express();

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("connected...");
});

app.use(cors(corsOptions));
app.use(express.json());

app.use(articleRouter);

app.listen(9000, () => {
  console.log("Server started");
});
