const mongoose = require('mongoose');
require('dotenv').config();

// Remplacez par votre chaîne de connexion Atlas
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => console.log("Connecté à MongoDB Atlas !"))
    .catch(err => console.error("Erreur de connexion :", err));