const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const articleRouter = require("./routers/article");
const categoryRouter = require("./routers/category");

const url = "mongodb://localhost:27017/PersonalWeb";
const corsOptions = {
  origin: [
    "http://www.example.com",
    "http://localhost:8000",
    "http://localhost:3000",
  ],
};

const app = express();

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("connected...");
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(cors(corsOptions));
app.use(express.json());

app.use(articleRouter);
app.use(categoryRouter);

app.listen(9000, () => {
  console.log("Server started");
});
