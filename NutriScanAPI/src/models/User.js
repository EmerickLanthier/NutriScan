const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password_hash: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    favorite_products: [{type: String, ref: 'Product'}],
    favorite_recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
    reset_token: {type: String, default: null}
});

module.exports = mongoose.model('User', userSchema);