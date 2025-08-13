const { productPool } = require('../config/db');

module.exports = {
    async searchProducts(searchParams) {
        const { q, id, category, minPrice, maxPrice, page = 1, limit = 20, sortBy = 'relevance', sortOrder = 'desc' } = searchParams;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT 
                id, name, description, price, category, stock_quantity, image_url, created_at, updated_at
        `;
        
        let whereConditions = [];
        let queryParams = [];
        let orderBy = '';
        
        // Add relevance score if text search
        if (q) {
            query += `, MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance_score`;
            queryParams.push(q);
        }
        
        query += ` FROM products WHERE 1=1`;
        
        // ID search (highest priority)
        if (id) {
            whereConditions.push('id = ?');
            queryParams.push(parseInt(id));
        }
        
        // Text search
        if (q && !id) {
            whereConditions.push('MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE)');
            queryParams.push(q);
        }
        
        // Category filter
        if (category) {
            whereConditions.push('category = ?');
            queryParams.push(category);
        }
        
        // Price range filters
        if (minPrice) {
            whereConditions.push('price >= ?');
            queryParams.push(parseFloat(minPrice));
        }
        
        if (maxPrice) {
            whereConditions.push('price <= ?');
            queryParams.push(parseFloat(maxPrice));
        }
        
        // Add WHERE conditions
        if (whereConditions.length > 0) {
            query += ' AND ' + whereConditions.join(' AND ');
        }
        
        // Order by logic
        if (id) {
            orderBy = 'ORDER BY id';
        } else if (q) {
            if (sortBy === 'price') {
                orderBy = `ORDER BY price ${sortOrder.toUpperCase()}, relevance_score DESC`;
            } else if (sortBy === 'name') {
                orderBy = `ORDER BY name ${sortOrder.toUpperCase()}, relevance_score DESC`;
            } else if (sortBy === 'date') {
                orderBy = `ORDER BY created_at ${sortOrder.toUpperCase()}, relevance_score DESC`;
            } else {
                orderBy = 'ORDER BY relevance_score DESC, created_at DESC';
            }
        } else {
            if (sortBy === 'price') {
                orderBy = `ORDER BY price ${sortOrder.toUpperCase()}`;
            } else if (sortBy === 'name') {
                orderBy = `ORDER BY name ${sortOrder.toUpperCase()}`;
            } else {
                orderBy = 'ORDER BY created_at DESC';
            }
        }
        
        query += ` ${orderBy} LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));
        
        // Execute search query
        const [products] = await productPool.query(query, queryParams);
        
        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
        let countParams = [];
        
        if (id) {
            countQuery += ' AND id = ?';
            countParams.push(parseInt(id));
        }
        
        if (q && !id) {
            countQuery += ' AND MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE)';
            countParams.push(q);
        }
        
        if (category) {
            countQuery += ' AND category = ?';
            countParams.push(category);
        }
        
        if (minPrice) {
            countQuery += ' AND price >= ?';
            countParams.push(parseFloat(minPrice));
        }
        
        if (maxPrice) {
            countQuery += ' AND price <= ?';
            countParams.push(parseFloat(maxPrice));
        }
        
        const [countResult] = await productPool.query(countQuery, countParams);
        const total = countResult[0].total;
        
        return {
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    },

    async getCategories() {
        const [categories] = await productPool.query(
            'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
        );
        return categories.map(row => row.category);
    }
};