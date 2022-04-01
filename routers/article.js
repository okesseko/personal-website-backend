const express = require("express");
const articleModal = require("../models/article");

const router = express.Router();

router.get("/article", async (req, res) => {
  try {
    const { search, limit, page, order, getPrev, getNext, ...filterCondition } =
      req.query;
    const filter = { status: 1, ...filterCondition };

    if (search) {
      const searchReg = new RegExp(search, "gmi");
      filter["$or"] = [
        { title: { $regex: searchReg } },
        { content: { $regex: searchReg } },
      ];
    }

    const articles = await articleModal.find(filter, null, {
      limit: limit,
      skip: page - 1,
      sort: { releaseTime: order },
    });

    const totalSize = await articleModal.find(filter).count();

    let prevArticle = null;
    let nextArticle = null;
    if (articles.length) {
      const curId = articles[0]._id;

      if (getPrev)
        prevArticle = await articleModal
          .findOne({ _id: { $lt: curId } })
          .sort({ _id: -1 })
          .limit(1);

      if (getNext)
        nextArticle = await articleModal
          .findOne({ _id: { $gt: curId } })
          .sort({ _id: 1 })
          .limit(1);
    }

    res.status(200).send({ articles, totalSize, prevArticle, nextArticle });
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
