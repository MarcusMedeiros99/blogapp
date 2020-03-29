const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categorie');
require('../models/Post');
const Category = mongoose.model("categories");
const Post = mongoose.model('posts');

router.get('/', (req, res) => {
    res.render('admin/index.handlebars')
});

router.get('/categories', (req, res) => {
    Category.find().sort({date: 'desc'}).then( (categories) => {
        res.render("admin/categories", {categories:categories});
    } ).catch((err) => {
        console.log("Error:"+err);
        req.flash("error_msg", "Error ocurred listing categories");
        res.redirect('/admin');
    })
    
});

router.post('/categories/new', (req, res) => {

    var errors = [];
    
    if (!req.body.name || typeof(req.body.name) == undefined || req.body.name == null) {
        errors.push({text : "Invalid name"});
    }
    if (!req.body.slug || typeof(req.body.slug) == undefined || req.body.slug == null) {
        errors.push({text: "Invalid slug"});
    }
    if (req.body.name.length < 2) {
        errors.push({text: "Name must have length greater than 2"});
    }
    if (errors.length > 0) {
        res.render('admin/add_categories', {errors:errors});
    }
    else {
        const newCategory = {
            slug: req.body.slug,
            name: req.body.name  
        };
        console.log(newCategory);
    
        new Category(newCategory).save().then(() => {
            console.log("Category added successfully!");
            req.flash("success_msg", "Category added successfully!"); 
            res.redirect('/admin/categories')
        }).catch((err) => {
            console.log("Failed to add category: "+err);
        });
    }

    
});

router.post('/categories/edit/:id', (req, res) => {
    Category.findOne({_id: req.params.id}).then( (category) => {
        res.render("admin/edit_categories", {category:category});
        //console.log(category);
    }).catch( (err) => {
        req.flash("error_msg", "Category not found");
        res.redirect("admin/categories");
    });

    //res.render("admin/edit_categories");
    console.log("Editing page " + req.params.id);
});

router.post("/categories/edit", (req, res) => {

    var errors = [];
    
    if (!req.body.name || typeof(req.body.name) == undefined || req.body.name == null) {
        errors.push({text : "Invalid name"});
    }
    if (!req.body.slug || typeof(req.body.slug) == undefined || req.body.slug == null) {
        errors.push({text: "Invalid slug"});
    }
    if (req.body.name.length < 2) {
        errors.push({text: "Name must have length greater than 2"});
    }
    if (errors.length > 0) {
        Category.find().sort({date: 'desc'}).then( (categories) => {
            res.render("admin/categories", {categories:categories, errors:errors});
        } ).catch((err) => {
            console.log("Error:"+err);
            req.flash("error_msg", "Error ocurred listing categories");
            res.redirect('/admin');
        })
        
    }
    else {
        Category.findByIdAndUpdate(req.body.id, {name : req.body.name, slug : req.body.slug}).then(() => {
            req.flash("success_msg", "Category edited");
            res.redirect("/admin/categories");
        }).catch((err) => {
            req.flash("error_msg", "Failed to edit category");
            res.redirect("/admin/categories");
        });
    }
});

router.post("/categories/delete/:id", (req, res) => {
    Category.remove({_id:req.params.id}).then( () => {
        req.flash("success_msg", "Category deleted");
        res.redirect("/admin/categories");
    }).catch( (err) => {
        req.flash("error_msg", "Failed to delet category");
        res.redirect("/admin/categories");
    } );
})

router.get('/add_categories', (req, res) => {
    res.render("admin/add_categories");
});

router.get('/posts', (req, res) => {
    Post.find().populate("category").sort({date:'desc'}).then((posts) => {
        res.render("admin/posts", {posts:posts});
    }).catch((err) => {
        req.flash("error_msg", "Error while saving post");
        res.redirect("admin/posts");
    })
});

router.get("/posts/add", (req, res) => {
    Category.find().sort({name: 'asc'}).then( (categories) => {
        res.render("admin/add_post", {categories:categories});    
    }).catch((err) => {
        req.flash("error_msg",  "Error while loading form");
    });
    
});

router.post("/posts/new", (req, res) => {
    var errors = [];

    if (req.body.category == "0") {
        errors.push({text:"Invalid category"});
    }
    if (errors.length > 0 ) {
        res.render("admin/add_post", {errors:errors});
    }
    else {
        const newPost = {
            title: req.body.title, 
            description: req.body.description,
            slug: req.body.slug,
            content: req.body.content,
            category: req.body.category
        };

        new Post(newPost).save().then( () => {
            req.flash("success_msg", "Posted successfully");
            res.redirect("/admin/posts");
        }).catch((err) => {
            req.flash("error_msg", "Failed to post");
            res.redirect("/admin/posts");
        })
    }
});

router.post("/posts/delete/:id", (req, res) => {
    Post.findByIdAndDelete(req.params.id).then( () => {
        req.flash("success_msg", "Post deleted successfully");
        res.redirect("/admin/posts");
    }).catch( (err) => {
        req.flash("error_msg", "Failed to delete post");
        res.redirect("/admin/posts");
    })
});

router.post('/posts/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).then( (post) => {
        Category.find().sort({name:'asc'}).then( (categories) => {
            res.render("admin/edit_posts", {post:post, categories:categories});
        }).catch( (err) => {
            req.flash("error_msg", "Error while listing categories");
            res.redirect("/admin/posts");
        })
        //console.log(category);
    }).catch( (err) => {
        req.flash("error_msg", "Post not found");
        res.redirect("admin/posts");
    });

    //res.render("admin/edit_categories");
    //console.log("Editing page " + req.params.id);
});

router.post("/posts/edit", (req, res) => {

    var errors = [];
    
    if (!req.body.title || typeof(req.body.title) == undefined || req.body.title == null) {
        errors.push({text : "Invalid name"});
    }
    if (!req.body.slug || typeof(req.body.slug) == undefined || req.body.slug == null) {
        errors.push({text: "Invalid slug"});
    }
    if (req.body.title.length < 2) {
        errors.push({text: "Name must have length greater than 2"});
    }
    if (errors.length > 0) {
        Post.find().sort({date: 'desc'}).then( (posts) => {
            res.render("admin/posts", {posts:posts, errors:errors});
        } ).catch((err) => {
            console.log("Error:"+err);
            req.flash("error_msg", "Error ocurred listing categories");
            res.redirect('/admin/posts');
        })
        
    }
    else {
        Post.findByIdAndUpdate(req.body.id, {title : req.body.title,
                                                slug : req.body.slug,
                                                content : req.body.content, 
                                                category: req.body.category, 
                                                description:req.body.description}).then(() => {
            req.flash("success_msg", "Category edited");
            res.redirect("/admin/posts");
        }).catch((err) => {
            req.flash("error_msg", "Failed to edit category");
            res.redirect("/admin/posts");
        });
    }
});

module.exports = router;