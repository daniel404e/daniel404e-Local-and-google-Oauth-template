//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')


 

const app = express();


app.use(express.static("public"));

app.set('view engine',"ejs");

app.use(session({
             secret: "kk",
             resave: false,
             saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userdb",{useNewUrlParser: true});
 


const userschema = new mongoose.Schema({
    email: String,
    password: String,
    googleid: String,
    secret: String
}); 

userschema.plugin(passportlocalmongoose);
userschema.plugin(findOrCreate);

 
const usermodel = new mongoose.model("user",userschema);

passport.use(usermodel.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id); 
   // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    usermodel.findById(id, function(err, user) {
        done(err, user);
    });
});
////////////////////

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      usermodel.findOrCreate({ googleid: profile.id , username: profile._json.email}, function (err, user) {
      return cb(err, user);
    });
     
  }
));


app.use(bodyparser.urlencoded({extended: true}));

app.get("/",function(req,res){

res.render("home");

});

app.get("/",function(req,res){

    res.render("home.ejs");
    
    });

    app.get('/auth/google',
  passport.authenticate('google', { scope: ["email" , "profile"] }));

  app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });


    app.get("/secrets",function(req,res){
       
        usermodel.find({"secret": {$ne: null}},function(err, foundusrs){
                
            if(foundusrs)
            {
                console.log(foundusrs);
                res.render("secrets",{usersandsecrets: foundusrs});
            }
            else
            {
                res.render("secrets");
            }
  

        });


        
     
         
        
        });

    app.get("/login",function(req,res){
        err2 = 0;

        if(req.isAuthenticated())
        {
        res.redirect("secrets");
        }
        else
        {
              
         
             if(req.session.messages)
             {
                arrt  = [] ;
                arrt = JSON.parse(JSON.stringify(req.session.messages));
                
                console.log(arrt);
               err2 = arrt[arrt.length-1];
             }
             else
             {
                 err2 = 0;
             }
            res.render("login" , {err1: err2});
        }
        
        
        });

        app.get("/submit",function(req,res){

            if(req.isAuthenticated())
            {
                res.render("submit");
            }
            else
            {
                res.render("register", {err1: 0} );
            }
          

        });
        app.get("/logout",function(req,res){

           req.logout();

           res.redirect("/");

            
            });

        app.get("/register",function(req,res){


            if(req.isAuthenticated())
            {
            res.redirect("secrets");
            }
            else
            {
                res.render("register", {err1: 0} );
            }

            
            
            });


            app.post("/submit",function(req,res){ 


                const secrt = req.body.secret ;
                
                console.log(req.user.id);

                usermodel.findById(req.user.id, function(err, founduser){
                         
                    if(err)
                    {
                          console.log(err);
                    }
                    else{
                         
                        if(founduser)
                        {
                            founduser.secret = secrt;
                            founduser.save(function(){
                               
                                res.redirect("/secrets");

                            })

                        }
                        


                    }



                })
                
                
                
            });

            app.post("/register",function(req,res){ 

                    
                    usermodel.register({username: req.body.username} , req.body.password , function(err , user){

                         
                        if(err)
                        {
                                          console.log(err);
                                         
                                          res.render("register", {err1: err});
                        }
                        else{

                            passport.authenticate("local")(req,res , function(){
                                      res.redirect("/secrets");


                            })

                        }
                        


                    } )
                
                
                });


                app.post("/login",function(req,res){

                    
                       
                        const user = new usermodel({
                          
                            username: req.body.username,
                            password: req.body.password

                        });
 
                    
                       req.login(user , function(err){
                           if(err)
                           {
                                 console.log(err);
                               res.render("login", {err1: err});
                           }
                           else{
                               passport.authenticate("local",{ failureRedirect: '/login' , failureMessage: true } )(req , res , function (err2){
                                                 
                                if(err)
                                {
                                    console.log(err);
                                    res.render("login", {err1: err});
                                }

                                else
                                {
                                    res.redirect("/secrets");
                                }
                               


                               })
                           }

                       })

                 
                
                });


                 


app.listen(3000,function(){console.log("server @ 3k");});