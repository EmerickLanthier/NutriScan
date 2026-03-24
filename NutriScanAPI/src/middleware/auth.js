const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({message: "Authentification requise"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cle_secrete_temporaire');
        req.user = {id: decoded.userId};
        next();
    } catch (error) {
        res.status(401).json({message: "Token invalide ou expiré"});
    }
};