//jshint esversion:6

const express = require("express");
// const ejs = require("ejs");
const mongoose = require('mongoose');
var cors = require('cors')

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/mylocaldb", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.status(201).send(newArticle);
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/articles/:id")

.get(function(req, res){

  Article.findOne({_id: req.params.id}, function(err, foundArticle){
    if (foundArticle) {
      res.status(200).send(foundArticle);
    } else {
      res.status(404).send("Not Found");
    }
  });
})

.put(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
