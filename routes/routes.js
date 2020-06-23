var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");


router.get("/", function (req, res) {

    db.Article.find({}).limit(100)
        .then(function (scrapedArticles) {
            var hbsObject = { articles: scrapedArticles };
            res.render("index", hbsObject);
        });
});


router.get("/scrape", function (req, res) {

    axios.get("https://dotesports.com").then(function (response) {

        var $ = cheerio.load(response.data);

        $("article.post").each(function (i, element) {

            var result = {};

            result.title = $(element).find("h3").text().trim();
            result.link = $(element).find("a").attr("href");
            result.image = $(element).find("a").find("img").attr("src");

            let rawTime = $(element).find("time").attr("datetime");
            let newTime = new Date(Date.parse(rawTime));

            result.date = newTime;

            db.Article.create(result)
                .then(function (dbArticle) {
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        $("#numArticles").text(response.count);
        console.log("Scrape Complete");
    });
});


router.get("/favorites", function (req, res) {

    db.Article.find({}).limit(100)
        .then(function (savedArticles) {
            var hbsObject = { articles: savedArticles };
            res.render("saved", hbsObject);
        });
});


router.put("/save/:id", function (req, res) {

    db.Article.update(
        { _id: req.params.id },
        { saved: true }
    )
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {

            res.json(error);
        });
});


router.put("/unsave/:id", function (req, res) {

    db.Article.update(
        { _id: req.params.id },
        { saved: false }
    )
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {

            res.json(error);
        });
});


router.get("/find-note/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            console.log(dbArticle)
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


router.post("/create-note/:id", function (req, res) {

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


router.post("/update-note/:id", function (req, res) {
    db.Note.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, body: req.body.body }, { new: true })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            res.json(error);
        });
});


router.delete("/delete-note/:id", function (req, res) {
    db.Note.remove({ _id: req.params.id })
        .then(function (dbNote) {
            res.json(dbNote);
        })
        .catch(function (error) {
            res.json(error);
        });
});


module.exports = router;