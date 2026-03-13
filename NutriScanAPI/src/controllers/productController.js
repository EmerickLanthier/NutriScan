const Product = require('../models/Product');
const History = require('../models/History');

exports.handleScan = async (req, res) => {
    console.log("--- Route /handleScan appelée ---");
    console.log("Body reçu :", req.body);
    try {

        const productData = req.body;

        await Product.findOneAndUpdate(
            { barcode: productData.barcode },
            { $set: { ...productData, last_updated: Date.now() } },
            { upsert: true, returnDocument: 'after' }
        );


        await History.findOneAndUpdate(
            { barcode: productData.barcode },
            {
                $set: {
                    ...productData, last_updated: Date.now()
                }
            },
            { upsert: true, returnDocument: 'after' }
        );

        res.status(201).json({
            success: true,
            message: "Produit mis à jour dans le cache et l'historique"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await History.find().sort({ scannedAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};