const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

module.exports = {
    async create(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!password) {
                return res.status(400).json({ message: 'Password is required' });
            }
            const passwordHash = await bcrypt.hash(password, 12);
            const id = await userModel.createUser(name, email, passwordHash);
            res.status(201).json({ message: 'User created', id });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    },

    async list(req, res) {
        try {
            const users = await userModel.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    },

    async get(req, res) {
        try {
            const user = await userModel.getUserById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { name, email } = req.body;
            await userModel.updateUser(req.params.id, name, email);
            res.json({ message: 'User updated' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            await userModel.deleteUser(req.params.id);
            res.json({ message: 'User deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    }
};
