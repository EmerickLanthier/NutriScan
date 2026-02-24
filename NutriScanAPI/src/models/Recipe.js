import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
instructions: { type: String, required: true },
image_url: { type: String },

ingredient_tags: [{ type: String, index: true }],
});

module.exports = mongoose.model('Recipe', recipeSchema);