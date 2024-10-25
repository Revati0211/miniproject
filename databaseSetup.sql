-- Step 1: Create the database
CREATE DATABASE FitFlex;

-- Step 2: Use the FitFlex database
USE FitFlex;

-- Step 3: Create the 'users' table with id, username, email, and password
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Step 4: Create the 'fitness_details' table with water intake, steps walked, and other fitness-related fields
CREATE TABLE fitness_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE NOT NULL,
    water_intake_ml INT NOT NULL,
    steps_walked INT NOT NULL,
    calories_burned INT,
    workout_minutes INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
    