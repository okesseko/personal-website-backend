const express = require("express");
const categoryModal = require("../models/category");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/category", async (req, res) => {
  try {
    const { isGetAll, limit, page, order, ...filterCondition } = req.query;

    const filter = filterCondition;

    let categories;
    let totalSize;

    if (isGetAll) {
      categories = await categoryModal.find();
      totalSize = await categoryModal.count();
    } else {
      // use reg search
      if (filter.name) {
        const nameReg = new RegExp(filter.name, "gmi");
        filter.name = { $regex: nameReg };
      }
      if (filter.value) {
        const valueReg = new RegExp(filter.value, "gmi");
        filter.value = { $regex: valueReg };
      }

      categories = await categoryModal.find(filter, null, {
        limit: limit,
        skip: (page - 1) * limit,
      });
      totalSize = await categoryModal.find(filter).count();
    }

    res.status(200).send({ categories, totalSize });
  } catch (err) {
    res.status(500).send(err);
  }
});

// all api need verify

router.post("/category", authMiddleware, async (req, res) => {
  const id =
    parseInt(
      (await categoryModal.findOne().sort({ createTime: -1 }))?.id || "0"
    ) + 1;
  const category = new categoryModal({ ...req.body, id });

  try {
    const save = await category.save();

    res.status(201).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/category/:id", authMiddleware, async (req, res) => {
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

router.delete("/category/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.params.id) res.status(500).send("Id is necessary");

    await categoryModal.deleteOne({ id: req.params.id });

    return res.status(200).send("");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
