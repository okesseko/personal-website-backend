const express = require("express");
const articleModal = require("../models/article");

const router = express.Router();

router.get("/article", async (req, res) => {
  try {
    const filter = { status: 1 };
    if (req.query.id) filter.id = req.query.id;

    const articles = await articleModal.find(filter, null, {
      limit: req.query.limit,
      skip: req.query.page - 1,
      sort: { releaseTime: req.query.order },
    });
    
    res.status(200).send(articles);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/article", async (req, res) => {
  const id = (await articleModal.find({}).count()) + 1;
  const article = new articleModal({ ...req.body, id });

  try {
    const save = await article.save();

    res.status(201).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/article/:id", async (req, res) => {
  try {
    if (!req.params.id) res.status(500).send("Id is necessary");

    const article = await articleModal.findOne({ id: req.params.id });
    if (!article) res.status(404).send("No item found");

    for (let [key, val] of Object.entries(req.body)) {
      article[key] = val;
    }

    const save = await article.save();
    return res.status(204).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

// router.delete("/article/:id", async (req, res) => {
//   try {
//     if (req.params.id) res.status(500).send("Id is necessary");

//     const article = await articleModal.findOne({ id: req.params.id });
//     if (!article) res.status(404).send("No item found");

//     article.status = 0;
//     await article.save();

//     res.json(article);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

module.exports = router;
