const express = require("express");
const categoryModal = require("../models/category");

const router = express.Router();

router.get("/category", async (req, res) => {
  try {
    const categories = await categoryModal.find({});

    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/category", async (req, res) => {
  const id = (await categoryModal.find({}).count()) + 1;
  const category = new categoryModal({ ...req.body, id });

  try {
    const save = await category.save();

    res.status(201).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/category/:id", async (req, res) => {
  try {
    if (!req.params.id) res.status(500).send("Id is necessary");

    const category = await categoryModal.findOne({ id: req.params.id });
    if (!category) res.status(404).send("No item found");

    for (let [key, val] of Object.entries(req.body)) {
      category[key] = val;
    }

    const save = await category.save();
    return res.status(204).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
