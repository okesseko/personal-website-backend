const express = require("express");
const userModal = require("../models/user");
const CryptoJS = require("crypto-js");

const router = express.Router();

router.get("/user", async (req, res) => {
  try {
    const { limit, page, ...filterCondition } = req.query;
    const filter = filterCondition;

    const users = await userModal.find(filter, null, {
      limit: limit,
      skip: page - 1,
    });

    const totalSize = await userModal.find(filter).count();

    res.status(200).send({ users, totalSize });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/user", async (req, res) => {
  const { account, password } = req.body;
  const id =
    parseInt((await userModal.findOne().sort({ createTime: -1 }))?.id || "0") +
    1;

  const encodePsw = CryptoJS.AES.encrypt(
    password,
    process.env.PASSWORD_SECRET
  ).toString();

  const user = new userModal({ id, account, password: encodePsw });

  try {
    const save = await user.save();

    res.status(201).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { account, password } = req.body;

  const user = await userModal.findOne({ account });
  if (!user) res.status(500).send("No account");
  else {
    try {
      const encodePsw = CryptoJS.AES.encrypt(
        password,
        process.env.PASSWORD_SECRET
      ).toString();

      if (encodePsw === user.password) res.status(200).send({ token: "" });
      else throw "wrong password";
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

router.patch("/user/:id", async (req, res) => {
  try {
    if (!req.params.id) res.status(500).send("Id is necessary");

    const user = await userModal.findOne({ id: req.params.id });
    if (!user) res.status(404).send("No item found");

    for (let [key, val] of Object.entries(req.body)) {
      user[key] = val;
    }

    const save = await user.save();
    return res.status(204).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    if (!req.params.id) res.status(500).send("Id is necessary");

    await userModal.deleteOne({ id: req.params.id });

    return res.status(200).send("");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
