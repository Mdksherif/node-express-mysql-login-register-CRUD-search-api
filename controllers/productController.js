const productModel = require('../models/productModel');
const storageService = require('../config/storageService');

module.exports = {
    async list(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            
            const result = await productModel.getProducts(page, limit);
            
            res.json({
                success: true,
                data: result.products,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching products',
                error: error.message 
            });
        }
    },

    async create(req, res) {
        try {
            const { name, description, price, category, stock_quantity } = req.body;
            let image_url = null;
            
            // Handle image upload if file is provided
            if (req.file) {
                const filename = storageService.generateFilename(req.file.originalname);
                image_url = await storageService.uploadFile(req.file, filename);
            }
            
            const id = await productModel.createProduct(name, description, price, category, stock_quantity, image_url);
            
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: { id, image_url }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating product',
                error: error.message
            });
        }
    }
};