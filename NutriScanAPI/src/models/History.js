const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    barcode: {
        type: String,
        required: true
    },
    name: {type: String, required: true},
    image: {type: String},
    nutriscore: {type: String, lowercase: true},
    favorite: {type: Boolean, default: false},
    last_updated: {
        type: Date,
        default: Date.now()
    }
});

historySchema.index({userId: 1, barcode: 1}, {unique: true});

module.exports = mongoose.model('History', historySchema);