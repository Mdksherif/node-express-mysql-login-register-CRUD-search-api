const { productPool } = require('../config/db');

module.exports = {
    async getProducts(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        const [products] = await productPool.query(
            'SELECT * FROM products LIMIT ? OFFSET ?',
            [parseInt(limit), parseInt(offset)]
        );
        
        const [countResult] = await productPool.query('SELECT COUNT(*) as total FROM products');
        const total = countResult[0].total;
        
        return {
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        };
    },

    async createProduct(name, description, price, category, stock_quantity, image_url) {
        const [result] = await productPool.query(
            'INSERT INTO products (name, description, price, category, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, category, stock_quantity, image_url]
        );
        return result.insertId;
    }
};