const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('joi');
require('dotenv').config();
const { validationResult } = require('express-validator');

// Joi schema for password validation
const schema = joi.object({
    username: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string()
        .min(8)
        .pattern(new RegExp('(?=.*[a-z])'))   
        .pattern(new RegExp('(?=.*[A-Z])'))  
        .pattern(new RegExp('(?=.*[0-9])'))  
        .pattern(new RegExp('(?=.*[!@#$%^&*])')) 
        .required(),
});

// Render sign-up page
exports.renderSignUp = async (req, res) => {
    res.render('signup', { title: 'Sign-Up', user: req.user });
};

// POST signup logic
exports.signUp = async (req, res) => {
    try {
        const { error } = schema.validate(req.body);

        const { username, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Render login page
exports.renderLogIn = async (req, res) => {
    res.render('login', { title: 'Log-In', user: req.user });
};

// POST login logic
exports.logIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        // Check credentials
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        //console.log("Generated JWT Token:", token); 
        
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};