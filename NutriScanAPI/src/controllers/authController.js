const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Cet email est déjà utilisé."});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password_hash: hashedPassword
        });

        await newUser.save();

        res.status(201).json({message: "Utilisateur créé avec succès !"});
    } catch (error) {
        res.status(500).json({message: "Erreur lors de l'inscription", error: error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "Email ou mot de passe incorrect."});
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({message: "Email ou mot de passe incorrect."});
        }

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET || 'cle_secrete_temporaire',
            {expiresIn: '7d'}
        );

        res.status(200).json({
            message: "Connexion réussie !",
            token: token,
            user: {username: user.username, email: user.email}
        });

    } catch (error) {
        res.status(500).json({message: "Erreur lors de la connexion", error: error.message});
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const {email, username, currentPassword, newPassword} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: "Utilisateur introuvable."});
        }

        if (username) {
            user.username = username;
        }

        if (newPassword && newPassword !== '') {
            const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({message: "Le mot de passe actuel est incorrect."});
            }

            const salt = await bcrypt.genSalt(10);
            user.password_hash = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        res.status(200).json({
            message: "Profil mis à jour avec succès !",
            user: {username: user.username, email: user.email}
        });

    } catch (error) {
        res.status(500).json({message: "Erreur serveur", error: error.message});
    }
};