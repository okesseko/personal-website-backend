require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const articleRouter = require("./routers/article");
const categoryRouter = require("./routers/category");
const userRouter = require("./routers/user");

const corsOptions = {
  origin: [
    "http://www.example.com",
    "http://localhost:8000",
    "http://localhost:3000",
  ],
};

const app = express();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
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
app.use(userRouter);

app.listen(process.env.port || 9000, () => {
  console.log("Server started");
});
