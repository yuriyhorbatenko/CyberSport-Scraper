var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");


router.get("/", function (req, res) {
    res.render("index");
});


router.get("/scrape", function (req, res) {

    axios.get("https://dotesports.com/dota-2").then(function (response) {

        var $ = cheerio.load(response.data);

        $("article.post").each(function (i, element) {

            var result = {};
            result.title = $(element).find("h3").text().trim();
            result.link = $(element).find("a").attr("href");
            result.image = $(element).find("a").find("img").attr("src");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.send("Scrape Complete");

    });
});


router.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


router.get("/articles/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


router.get("/delete", function (req, res) {

    db.Article.remove({})
        .catch(function (err) {
            res.json(err);
        });

    db.Note.remove({})
        .catch(function (err) {
            res.json(err);
        });

});


router.post("/articles/:id", function (req, res) {

    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


module.exports = router;