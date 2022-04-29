const express = require("express");
const articleModal = require("../models/article");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/article", async (req, res) => {
  try {
    const { search, limit, page, order, getPrev, getNext, ...filterCondition } =
      req.query;
    const filter = filterCondition;

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
      const curTime = articles[0].releaseTime;
     
      if (getPrev) {
        if (order === "desc") {
          prevArticle = await articleModal
            .findOne({ releaseTime: { $gt: curTime } })
            .sort({ releaseTime: "asc" });
        } else {
          prevArticle = await articleModal
            .findOne({ releaseTime: { $lt: curTime } })
            .sort({ releaseTime: "desc" });
        }
      }

      if (getNext) {
        if (order === "desc") {
          nextArticle = await articleModal
            .findOne({ releaseTime: { $lt: curTime } })
            .sort({ releaseTime: "desc" });
        } else {
          nextArticle = await articleModal
            .findOne({ releaseTime: { $gt: curTime } })
            .sort({ releaseTime: "asc" });
        }
      }
    }

    res.status(200).send({ articles, totalSize, prevArticle, nextArticle });
  } catch (err) {
    res.status(500).send(err);
  }
});

// all api need verify

router.post("/article", authMiddleware, async (req, res) => {
  const id =
    parseInt(
      (await articleModal.findOne().sort({ createTime: -1 }))?.id || "0"
    ) + 1;
  const article = new articleModal({ ...req.body, id });

  try {
    const save = await article.save();

    res.status(201).send(save);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/article/:id", authMiddleware, async (req, res) => {
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

router.delete("/article/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.params.id) res.status(500).send("Id is necessary");

    await articleModal.deleteOne({ id: req.params.id });

    return res.status(200).send("");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
