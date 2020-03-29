//loading modules
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

const admin = require('./routes/admin');

require("./models/Post");
require("./models/Categorie");
const Post = mongoose.model("posts");
const Categorie = mongoose.model("categories");
//config
    //session
    app.use(session( {
        secret: "cursodenode", 
        resave: true,
        saveUninitialized: true
    } ));

    //flash
    app.use(flash());

    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");

        next();
    });

    //body-parser   
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

    //handlebars
    app.engine('handlebars', handlebars({defaultLayout:'main'}));
    app.set('view engine', 'handlebars');

    //mongoose
        const MONGO_PORT = 27017;
        mongoose.connect('mongodb://localhost:27017/blogapp', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log("Connected to MongoDB at mongodb://localhost:"+ MONGO_PORT);
        } ).catch((err) => {
            console.log("Error while connecting: "+err);
        })

    //public
    app.use(express.static(path.join(__dirname,'public')));

//routes
const urlencodedParse = bodyParser.urlencoded({extended:false});
app.use('/admin', urlencodedParse, admin);   

app.get('/', (req, res) => {
    Post.find().populate("category").sort({date:'desc'}).then((posts) => {
        res.render('index', {posts:posts});
    }).catch((err) => {
        req.flash("error_msg", "Error while loading posts");
        res.render('index');
    })
    
});

//main
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Server running at http://localhost:"+PORT);
});