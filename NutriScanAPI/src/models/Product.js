const mongoose = require('mongoose');

const nutritionRowSchema = new mongoose.Schema({
    label: String,
    value: String,
    unit: String,
    bold: Boolean,
    subItem: Boolean,
    level: String
}, {_id: false});

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {type: String, required: true},
    image: {type: String},
    brands: {type: String},
    quantity: {type: String},
    labels: [{type: String}],
    nutriscore: {
        type: String,
        lowercase: true,
        enum: ['a', 'b', 'c', 'd', 'e']
    },
    nutritionRows: [nutritionRowSchema],

    categoryTags: [{type: String}],
    last_updated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', productSchema);