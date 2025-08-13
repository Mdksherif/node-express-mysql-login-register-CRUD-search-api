const { userPool } = require('../config/db');

module.exports = {
    async createUser(name, email, passwordHash) {
        const [result] = await userPool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, passwordHash]
        );
        return result.insertId;
    },

    async getUsers() {
        const [rows] = await userPool.query('SELECT id, name, email FROM users');
        return rows;
    },

    async getUserById(id) {
        const [rows] = await userPool.query('SELECT id, name, email FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    async getUserByEmail(email) {
        const [rows] = await userPool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    async updateUser(id, name, email) {
        await userPool.query('UPDATE users SET name=?, email=? WHERE id=?', [name, email, id]);
    },

    async deleteUser(id) {
        await userPool.query('DELETE FROM users WHERE id=?', [id]);
    }
};
