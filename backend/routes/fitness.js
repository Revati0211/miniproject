const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();


const secret = 'your_jwt_secret';

router.post('/add-fitness-details', (req, res) => {
    const { token, water_intake, exercise_duration, blood_sugar_level } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    // Verify and decode the token
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const email = decoded.email;

        // Find user ID based on the email
        const findUserIdQuery = 'SELECT id FROM users WHERE email = ?';
        db.query(findUserIdQuery, [email], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userId = results[0].id;

            // Insert fitness details into the fitness_details table
            const insertQuery = `
                INSERT INTO fitness_details (user_id, water_intake_ml, workout_minutes, blood_sugar_level) VALUES (?, ?, ?, ?)
            `;
            db.query(insertQuery, [userId, water_intake, exercise_duration, blood_sugar_level], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error inserting fitness details', error: err });
                }

                res.status(200).json({ message: 'Fitness details added successfully' });
            });
        });
    });
});


router.post('/get-fitness-data', (req, res) => {

    const { email } = req.body;
    // Find user ID based on the email
    const findUserIdQuery = 'SELECT id FROM users WHERE email = ?';
    db.query(findUserIdQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = results[0].id;

        // Fetch fitness data from the fitness_table for this user_id
        const fetchFitnessDataQuery = `
                SELECT water_intake_ml, workout_minutes, blood_sugar_level, steps_walked, weight,date FROM fitness_details WHERE user_id = ?
            `;
        db.query(fetchFitnessDataQuery, [userId], (err, fitnessData) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching fitness data', error: err });
            }

            if (fitnessData.length === 0) {
                return res.status(404).json({ message: 'No fitness data found for this user' });
            }

            // Return the fitness data
            res.status(200).json({ fitnessData });
        });
    });

});

module.exports = router;
