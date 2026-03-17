const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Pour générer le jeton secret
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password_hash: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'cle_secrete_temporaire',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Connexion réussie !",
            token: token,
            user: { username: user.username, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { email, username, currentPassword, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        if (username) {
            user.username = username;
        }

        if (newPassword && newPassword !== '') {
            const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: "Le mot de passe actuel est incorrect." });
            }

            const salt = await bcrypt.genSalt(10);
            user.password_hash = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        res.status(200).json({ message: "Profil mis à jour avec succès !", user: { username: user.username, email: user.email } });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: "Si cette adresse existe, un lien de réinitialisation a été envoyé." });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.reset_token = resetToken;
        user.reset_token_expires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `nutriscanapp://reset-password?token=${resetToken}`;

        const { data, error } = await resend.emails.send({
            from: 'NutriScan <onboarding@resend.dev>',
            to: user.email,
            subject: 'NutriScan - Réinitialisation de votre mot de passe',
            html: `
                <h2>Bonjour ${user.username},</h2>
                <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                <p>Cliquez sur le lien suivant pour le modifier :</p>
                <a href="${resetUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
                <p><small>Ce lien expirera dans une heure.</small></p>
                <p>L'équipe NutriScan (Madrid)</p>
            `
        });

        if (error) {
            console.error("Erreur Resend:", error);
            return res.status(500).json({ message: "Erreur lors de l'envoi du courriel via l'API." });
        }

        res.status(200).json({ message: "Si cette adresse existe, un lien de réinitialisation a été envoyé." });

    } catch (error) {
        console.error("Erreur forgotPassword:", error);
        res.status(500).json({ message: "Erreur lors de la demande de réinitialisation." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            reset_token: token,
            reset_token_expires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Le lien de réinitialisation est invalide ou a expiré." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(newPassword, salt);

        user.reset_token = null;
        user.reset_token_expires = null;

        await user.save();

        res.status(200).json({ message: "Votre mot de passe a été réinitialisé avec succès !" });

    } catch (error) {
        console.error("Erreur resetPassword:", error);
        res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe." });
    }
};