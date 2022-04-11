const express = require("express");
const loginModal = require("../models/login");

const router = express.Router();

router.get("/login", async (req, res) => {
  try {
    const { limit, page, ...filterCondition } = req.query;
    const filter = filterCondition;

    const logins = await loginModal.find(filter, null, {
      limit: limit,
      skip: page - 1,
    });

    const totalSize = await loginModal.find(filter).count();

    res.status(200).send({ logins, totalSize });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const id =
    parseInt((await loginModal.findOne().sort({ createTime: -1 }))?.id || "0") +
    1;
  const login = new loginModal({ ...req.body, id });

  try {
    const save = await login.save();

    res.status(201).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/login/:id", async (req, res) => {
  try {
    if (!req.params.id) res.status(500).send("Id is necessary");

    const login = await loginModal.findOne({ id: req.params.id });
    if (!login) res.status(404).send("No item found");

    for (let [key, val] of Object.entries(req.body)) {
      login[key] = val;
    }

    const save = await login.save();
    return res.status(204).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/login/:id", async (req, res) => {
  try {
    if (!req.params.id) res.status(500).send("Id is necessary");

    await loginModal.deleteOne({ id: req.params.id });

    return res.status(200).send("");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
