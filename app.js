//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});
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
    const password = req.body.password
    console.log(user);
    console.log(password);
    User.findOne({email:user}, function(err, foundUser){
      if(err){
        console.log(err);
        console.log("no user found");
      }
      else{
        if(foundUser){
          if(foundUser.password === password){
            res.render("secrets");
          }
          else {console.log("wrong password");}
        }
      }
    })
  });

app.route("/register")
  .get(function(req, res){
  res.render("register")
})
  .post(function(req, res){
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
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
