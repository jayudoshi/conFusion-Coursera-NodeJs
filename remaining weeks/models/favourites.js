const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const favouritesSchema = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true,
        unique: true,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Dish'
    }]
},{
    timestamps: true
})

const Favourites = mongoose.model("Favourite",favouritesSchema)

module.exports = Favourites;