-- ============================================================
-- Kalabe Motors & Transportation Logistics Limited
-- MySQL Database Setup Script
-- Run this ONCE to create all required tables
-- ============================================================

-- Create the database (skip if it already exists)
CREATE DATABASE IF NOT EXISTS kalabe_motors
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kalabe_motors;

-- ============================================================
-- TABLE 1: bookings
-- Stores all vehicle reservation form submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL,
    phone          VARCHAR(30)  NOT NULL,
    nrc_number     VARCHAR(50),
    nrc_document   VARCHAR(255),          -- path to uploaded file
    licence_number VARCHAR(100),
    nationality    VARCHAR(100),
    vehicle_id     INT          NOT NULL,
    vehicle_name   VARCHAR(150),
    pickup_city    VARCHAR(100),
    start_date     DATE         NOT NULL,
    end_date       DATE         NOT NULL,
    purpose        TEXT,
    driver_needed  ENUM('yes','no') DEFAULT 'no',
    insurance      ENUM('basic','standard','premium') DEFAULT 'basic',
    payment_method VARCHAR(80),
    notes          TEXT,
    daily_rate     DECIMAL(10,2) DEFAULT 0,
    num_days       INT           DEFAULT 1,
    total_price    DECIMAL(10,2) DEFAULT 0,
    status         ENUM('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 2: contact_messages
-- Stores all contact form submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(150) NOT NULL,
    phone      VARCHAR(30),
    subject    VARCHAR(200),
    message    TEXT NOT NULL,
    is_read    TINYINT(1) DEFAULT 0,       -- 0 = unread, 1 = read
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 3: vehicles  (for the fleet / booking dropdown)
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    category     ENUM('Economy','SUV','Luxury','Bus','Truck','Pickup') NOT NULL,
    daily_rate   DECIMAL(10,2) NOT NULL,
    seats        INT DEFAULT 5,
    fuel_type    ENUM('Petrol','Diesel','Hybrid','Electric') DEFAULT 'Petrol',
    transmission ENUM('Manual','Automatic') DEFAULT 'Automatic',
    is_available TINYINT(1) DEFAULT 1,
    image_path   VARCHAR(255),
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed: sample vehicles
INSERT INTO vehicles (name, category, daily_rate, seats, fuel_type, transmission) VALUES
  ('Toyota Corolla',      'Economy', 350.00,  5, 'Petrol',  'Automatic'),
  ('Nissan Note',         'Economy', 300.00,  5, 'Petrol',  'Manual'),
  ('Toyota Fortuner',     'SUV',     650.00,  7, 'Diesel',  'Automatic'),
  ('Toyota Land Cruiser', 'SUV',     900.00,  7, 'Diesel',  'Automatic'),
  ('Mercedes E-Class',    'Luxury',  1200.00, 5, 'Petrol',  'Automatic'),
  ('Toyota HiAce Bus',    'Bus',     800.00, 15, 'Diesel',  'Manual'),
  ('Isuzu Truck',         'Truck',   1100.00, 3, 'Diesel',  'Manual'),
  ('Toyota Hilux',        'Pickup',  700.00,  5, 'Diesel',  'Manual');

-- ============================================================
-- USEFUL ADMIN QUERIES
-- ============================================================

-- View all bookings (newest first)
-- SELECT b.*, DATEDIFF(b.end_date, b.start_date) AS days
-- FROM bookings b ORDER BY b.created_at DESC;

-- View unread contact messages
-- SELECT * FROM contact_messages WHERE is_read = 0 ORDER BY created_at DESC;

-- Mark a message as read
-- UPDATE contact_messages SET is_read = 1 WHERE id = ?;

-- Confirm a booking
-- UPDATE bookings SET status = 'confirmed' WHERE id = ?;

-- Revenue this month
-- SELECT SUM(total_price) AS monthly_revenue
-- FROM bookings
-- WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())
-- AND status != 'cancelled';
