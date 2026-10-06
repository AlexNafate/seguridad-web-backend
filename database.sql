-- =============================================
-- Script de Base de Datos para SecureWeb Backend
-- Motor: MySQL 8.0+ / MariaDB
-- =============================================

-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS secureweb_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE secureweb_db;

-- 2. Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  rol ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
