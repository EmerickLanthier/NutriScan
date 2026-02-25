require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log("Connecté à MongoDB Atlas !"))
    .catch(err => console.error("Erreur de connexion :", err));

const authRoutes = require('../src/routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API NutriScan en ligne !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré et en écoute sur le port ${PORT}`);
});