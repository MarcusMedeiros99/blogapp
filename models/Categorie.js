const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Categorie = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }, 
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }

})

mongoose.model('categories', Categorie);