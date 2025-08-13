const { query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Search validation failed',
            errors: errors.array()
        });
    }
    next();
};

const validateSearch = [
    query('q')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters')
        .trim()
        .escape(),
    
    query('id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),
    
    query('category')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters')
        .trim()
        .escape(),
    
    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a positive number'),
    
    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a positive number'),
    
    query('page')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Page must be between 1 and 1000'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('sortBy')
        .optional()
        .isIn(['relevance', 'price', 'name', 'date'])
        .withMessage('Sort by must be one of: relevance, price, name, date'),
    
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
    
    // Custom validation for price range
    (req, res, next) => {
        const { minPrice, maxPrice } = req.query;
        if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
            return res.status(400).json({
                success: false,
                message: 'Minimum price cannot be greater than maximum price'
            });
        }
        next();
    },
    
    // Custom validation for search requirements
    (req, res, next) => {
        const { q, id, category, minPrice, maxPrice } = req.query;
        if (!q && !id && !category && !minPrice && !maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'At least one search parameter is required (q, id, category, minPrice, or maxPrice)'
            });
        }
        next();
    },
    
    handleValidationErrors
];

module.exports = {
    validateSearch
};