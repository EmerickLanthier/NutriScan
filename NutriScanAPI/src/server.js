const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connecté à MongoDB Atlas (nutriscan_db)'))
    .catch((err) => console.error('Erreur de connexion MongoDB:', err));


app.use('/api/product', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API NutriScan en ligne !');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});