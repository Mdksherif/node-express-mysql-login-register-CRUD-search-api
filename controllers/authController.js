const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            const existingUser = await userModel.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            const passwordHash = await bcrypt.hash(password, 12);
            const id = await userModel.createUser(name, email, passwordHash);
            
            res.status(201).json({ message: 'User registered successfully', id });
        } catch (error) {
            res.status(500).json({ message: 'Registration failed', error: error.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userModel.getUserByEmail(email);

            if (!user) return res.status(400).json({ message: 'Invalid email or password' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ token, message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ message: 'Login failed', error: error.message });
        }
    }
};
