const searchModel = require('../models/searchModel');

module.exports = {
    async searchProducts(req, res) {
        try {
            const startTime = Date.now();
            const searchParams = {
                q: req.query.q,
                id: req.query.id,
                category: req.query.category,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                page: req.query.page || 1,
                limit: req.query.limit || 20,
                sortBy: req.query.sortBy || 'relevance',
                sortOrder: req.query.sortOrder || 'desc'
            };
            
            const result = await searchModel.searchProducts(searchParams);
            const executionTime = ((Date.now() - startTime) / 1000).toFixed(3);
            
            res.json({
                success: true,
                query: {
                    searchTerm: searchParams.q || null,
                    id: searchParams.id || null,
                    filters: {
                        category: searchParams.category || null,
                        priceRange: {
                            min: searchParams.minPrice || null,
                            max: searchParams.maxPrice || null
                        }
                    },
                    sorting: {
                        sortBy: searchParams.sortBy,
                        sortOrder: searchParams.sortOrder
                    }
                },
                data: result.products,
                pagination: result.pagination,
                searchStats: {
                    executionTime: `${executionTime}s`,
                    totalMatches: result.pagination.totalItems
                }
            });
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({
                success: false,
                message: 'Error searching products',
                error: error.message
            });
        }
    },

    async getCategories(req, res) {
        try {
            const categories = await searchModel.getCategories();
            
            res.json({
                success: true,
                data: categories,
                total: categories.length
            });
        } catch (error) {
            console.error('Categories error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching categories',
                error: error.message
            });
        }
    }
};