-- Active: 1773130940574@@127.0.0.1@3306@auction_db

-- 5-13-2026
CREATE DATABASE AUCTION_DB;

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_expires DATETIME,
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    constraint FK_user_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY,

    full_name VARCHAR(150),
    gender ENUM('male','female','other'),
    phone_number VARCHAR(30) UNIQUE,
    address TEXT,
    dob DATE,
    profile_image VARCHAR(255)
    DEFAULT 'https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJZSCIPrwwopJdfqzBs0q69ezQoM8=',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    constraint FK_userProfile_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE password_resets (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    token VARCHAR(255) NOT NULL UNIQUE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,

    used_at DATETIME NULL,

    constraint FK_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    start_price DECIMAL(10,2) NOT NULL,

    product_code VARCHAR(100) UNIQUE,

    category_id INT NOT NULL,

    product_condition  ENUM('good', 'bad', 'best') DEFAULT 'good',

    thumbnail VARCHAR(255),

    start_auction DATETIME,
    end_auction DATETIME,

    created_by INT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_products_categories
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT FK_products_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,

    product_image VARCHAR(255) NOT NULL,

    product_id INT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_product_images_product FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

