const Product = require('../models/Product');
const History = require('../models/History');

exports.handleScan = async (req, res) => {
    console.log("--- Route /handleScan appelée ---");
    console.log("Body reçu :", req.body);

    try {

        const productData = req.body;
        const userId = req.user.id;

        await Product.findOneAndUpdate(
            { barcode: productData.barcode },
            { $set: { ...productData, last_updated: Date.now() } },
            { upsert: true, returnDocument: `after` }
        );


        await History.findOneAndUpdate(
            { barcode: productData.barcode, userId: userId },
            {
                $set: {
                    ...productData,
                    userId: userId,
                    last_updated: Date.now()
                }
            },
            { upsert: true,  returnDocument: `after` }
        );

        res.status(201).json({
            success: true,
            message: "Produit mis à jour dans l'historique"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const historyItem = await History.findOne({ _id: id, userId: req.user.id });

        if (!historyItem) return res.status(404).json({ message: "Non trouvé" });

        historyItem.favorite = !historyItem.favorite;
        await historyItem.save();

        res.status(200).json({ favorite: historyItem.favorite });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHistory = async (req, res) => {
    try {
        const productData = req.body;

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
            message: "Produit mis à jour dans l'historique"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { sortBy, order, search } = req.query;
        const userId = req.user.id;

        let sortQuery = { last_updated: -1 };
        let filterQuery = {userId: userId};

        if (sortBy) {
            const sortDirection = order === 'asc' ? 1 : -1;

            if (sortBy === 'nutriscore') {
                sortQuery = { nutriscore: sortDirection };
            } else if (sortBy === 'last_updated') {
                sortQuery = { last_updated: sortDirection };
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
        const userId = req.user.id;
        const deletedItem = await History.findOneAndDelete({ _id: id, userId: userId });

        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Produit non trouvé" });
        }

        res.status(200).json({ success: true, message: "Produit supprimé de l'historique" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        const product = await Product.findOne({ barcode: barcode });

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ success: false, message: "Produit non trouvé en base" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getHistoryByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        const history = await History.findOne({ barcode: barcode });

        if (history) {
            res.status(200).json(history);
        } else {
            res.status(404).json({ success: false, message: "Produit non trouvé en base" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};