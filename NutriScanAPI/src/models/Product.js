const mongoose = require('mongoose');

const nutritionRowSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String, required: false }
}, { _id: false });

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: { type: String, required: true },
    image: { type: String },
    brands: { type: String },
    quantity: { type: String },
    labels: [{ type: String }],
    nutriscore: {
        type: String,
        lowercase: true,
        enum: ['a', 'b', 'c', 'd', 'e']
    },
    nutritionRows: [nutritionRowSchema],

    main_category_tag: { type: String, index: true },
    last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);