//jshint esversion:6

const express = require('express');

const bodyParser = require('body-parser');

const ejs = require('ejs');

const mongoose = require('mongoose');



const app = express();

app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({

  extended: true

}));

app.use(express.static('public'));



mongoose.connect('mongodb://localhost:27017/WikiDB', {

  useNewUrlParser: true,

  useUnifiedTopology: true

});



const articleSchema = {

  title: String,

  content: String

};


const Article = mongoose.model('Article', articleSchema);


/////////////////////////All Articles///////////////////////////////////

app.route("/articles")

  .get(function (req, res) {

    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }


    });

  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("successfully added new article!");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////////Individual Articles///////////////////////////////////


app.route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function (err, foundArticles) {
      if (foundArticles) {
        res.send(foundArticles);
      } else {
        res.send("No article match found!")
      }
    });
  })

  .put(function (req, res) {
    Article.updateOne({
        title: req.params.articleTitle}, 
        {title: req.body.title,
        content: req.body.content},
      function (err) {
        if (!err) {
          res.send("Successfully updated the content of the selected article.");
        } else {
          res.send(err);
        }
      });
  })

  .patch(function (req, res) {
    Article.updateOne({
        title: req.params.articleTitle}, 
        {$set: req.body},function (err) {
        if (!err) {
          res.send("Successfully updated!");
        } else {
          res.send(err);
        }
      });
  })
  .delete(function (req, res) {
    Article.deleteOne({
      title: req.params.articleTitle}, function (err) {
      if (!err) {
        res.send("Successfully deleted!");
      } else {
        res.send(err)
      }
    });
  });





app.listen(3000, function (req, res) {

  console.log("Server started on port 3000");

});