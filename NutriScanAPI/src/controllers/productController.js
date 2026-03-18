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
                    ...productData, scannedAt: Date.now()
                }
            },
            { upsert: true, returnDocument: 'after' }
        );

        res.status(201).json({
            success: true,
            message: "Produit mis à jour dans l'historique"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { sortBy, order, search } = req.query;

        let sortQuery = { scannedAt: -1 };
        let filterQuery = {};

        if (sortBy) {
            const sortDirection = order === 'asc' ? 1 : -1;

            if (sortBy === 'nutriscore') {
                sortQuery = { nutriscore: sortDirection };
            } else if (sortBy === 'scannedAt') {
                sortQuery = { scannedAt: sortDirection };
            }
        }

        if (search) {
            filterQuery.name = { $regex: search, $options: 'i' };
        }

        const history = await History.find(filterQuery).sort(sortQuery);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteFromHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await History.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Produit non trouvé" });
        }

        res.status(200).json({ success: true, message: "Produit supprimé de l'historique" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};