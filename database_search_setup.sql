-- Database Search Optimization Setup
-- Run these commands to optimize search performance for existing products table

USE productsdb;

-- Add full-text search index for name and description
ALTER TABLE products ADD FULLTEXT(name, description);

-- Add individual indexes for filtering (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_updated_at ON products(updated_at);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_category_price ON products(category, price);
CREATE INDEX IF NOT EXISTS idx_price_created ON products(price, created_at);

-- Insert additional sample data for testing search functionality (if needed)
INSERT INTO products (name, description, price, category, stock_quantity) VALUES
('Samsung TV 55 inch', '4K Smart TV by Samsung with HDR support', 1299.99, 'Electronics', 25),
('Samsung Laptop', 'Samsung Galaxy Book Pro laptop for business', 1599.99, 'Computers', 20),
('Samsung Phone Case', 'Protective case for Samsung Galaxy phones', 29.99, 'Accessories', 200),
('Apple Watch', 'Apple Watch Series 8 with health monitoring', 399.99, 'Electronics', 60),
('Gaming Laptop', 'High-performance laptop for gaming', 1899.99, 'Computers', 12),
('Wireless Mouse', 'Ergonomic wireless mouse for productivity', 49.99, 'Accessories', 150),
('Bluetooth Speaker', 'Portable speaker with excellent sound quality', 79.99, 'Audio', 90),
('USB-C Cable', 'Fast charging USB-C cable', 19.99, 'Accessories', 300),
('Monitor Stand', 'Adjustable monitor stand for better ergonomics', 89.99, 'Accessories', 75),
('Keyboard Mechanical', 'RGB mechanical keyboard for gaming', 159.99, 'Accessories', 55);

-- Verify indexes were created
SHOW INDEX FROM products;

-- Test full-text search functionality
SELECT name, description, 
       MATCH(name, description) AGAINST('samsung' IN NATURAL LANGUAGE MODE) as relevance_score
FROM products 
WHERE MATCH(name, description) AGAINST('samsung' IN NATURAL LANGUAGE MODE)
ORDER BY relevance_score DESC;