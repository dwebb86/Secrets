//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home")
});
app.route("/login")
  .get(function(req, res){
  res.render("login")
})
  .post(function(req,res){
    const user = req.body.username;
    const password = req.body.password;
    User.findOne({email:user}, function(err, foundUser){
      if(err){
        console.log(err);
        console.log("Something went wrong.");
      }
      else{
        if(foundUser){
          let compare = bcrypt.compareSync(password, foundUser.password);
          console.log(compare);
          if(compare === true){
            res.render("secrets");
          }
          else {console.log("wrong password");
        res.send("Wrong password.")}
        }
        else {console.log("User not found.");
      res.send("Username not found.")}
      }
    })
  });

app.route("/register")
  .get(function(req, res){
  res.render("register")
})
  .post(function(req, res){
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      } else res.render("secrets")
    })
  });




app.listen(3000, function(){
  console.log("App up and running at full speed captain!");
});
