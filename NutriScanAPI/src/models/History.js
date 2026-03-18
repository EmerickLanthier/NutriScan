const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
   //-----TODO : "Link" le userid avec le produit scanné pour que chaque personne ai un historique personnel
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false //----TODO: Ne pas oublier de changer à true après l'implémentation de l'authentification
    },
    barcode: {
        type: String,
        required: true
    },
    name: { type: String, required: true },
    image: { type: String },
    nutriscore: { type: String, lowercase: true },
    last_updated: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('History', historySchema);