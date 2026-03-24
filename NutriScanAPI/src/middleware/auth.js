const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authentification requise" });
        }

        const token = authHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'cle_secrete_temporaire');

        const userId = decodedToken.userId;
        req.user = { id: userId };

        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
};