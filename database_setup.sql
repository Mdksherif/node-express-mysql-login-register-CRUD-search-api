-- Create products database
CREATE DATABASE productsdb;
USE productsdb;

-- Create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, description, price, category, stock_quantity) VALUES
('iPhone 14', 'Latest Apple smartphone with advanced features', 999.99, 'Electronics', 50),
('Samsung Galaxy S23', 'High-performance Android smartphone', 899.99, 'Electronics', 30),
('MacBook Pro', 'Professional laptop for developers and creators', 1999.99, 'Computers', 25),
('Dell XPS 13', 'Compact and powerful ultrabook', 1299.99, 'Computers', 40),
('Sony WH-1000XM4', 'Noise-canceling wireless headphones', 349.99, 'Audio', 75),
('iPad Air', 'Versatile tablet for work and entertainment', 599.99, 'Electronics', 60),
('Nike Air Max', 'Comfortable running shoes', 129.99, 'Footwear', 100),
('Adidas Ultraboost', 'High-performance athletic shoes', 179.99, 'Footwear', 80),
('Canon EOS R5', 'Professional mirrorless camera', 3899.99, 'Photography', 15),
('GoPro Hero 11', 'Action camera for adventures', 499.99, 'Photography', 45);