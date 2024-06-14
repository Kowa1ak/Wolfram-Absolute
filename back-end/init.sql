CREATE DATABASE IF NOT EXISTS wolframabsolute;
USE wolframabsolute;
CREATE TABLE IF NOT EXISTS users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL,
                       email VARCHAR(50) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       roles VARCHAR(50) NOT NULL
);