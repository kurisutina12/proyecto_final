CREATE DATABASE tienda;

USE tienda;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles(nombre)
VALUES
('ADMIN'),
('CLIENT');

DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT DEFAULT 2
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    confirmado BOOLEAN,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
);

CREATE TABLE order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10,2),

    FOREIGN KEY (order_id)
    REFERENCES orders(id),

    FOREIGN KEY (product_id)
    REFERENCES products(id)
);

INSERT INTO users(
    username,
    email,
    password,
    role_id
)
VALUES(
    'admin',
    'admin@admin.com',
    '$2a$10$1vYF7v0l9b8h4u3Yx5P3m.Uh9c4B9v3P3M6k5m3Y1bY9F9d5d6D8G',
    1
);