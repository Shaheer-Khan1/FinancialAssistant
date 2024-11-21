import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    console.log('Received register request');
    console.log('Request Body:', req.body);  // Check the request body

    // Extract and normalize the fields
    const { name, email, password } = req.body;
    
    // Normalize email: trim and convert to lowercase for consistency
    const normalizedEmail = email.trim().toLowerCase();

    try {
        console.log('Checking if the user exists...');
        
        // Check for an existing user by email, using the normalized email
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({ name, email: normalizedEmail, password: hashedPassword });

        console.log('User created:', newUser);

        // Return success response
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        // Log and return detailed error message
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/getUserData', async (req, res) => {
    const { email } = req.query; // Assuming the email is sent as a query parameter
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Respond with the complete user data (except password for security)
      const { password, ...userData } = user.toObject();
      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

  
  router.get('/incomes', async (req, res) => {
    const { email } = req.query;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const incomes = user.income; // Retrieve all incomes for this user
      res.status(200).json({ incomes });
    } catch (error) {
      console.error('Error fetching incomes:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  router.post('/incomes', async (req, res) => {
    console.log('Request Body:', req.body);
    const { email, amount, source } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const newIncome = { amount, source, date: new Date() };
      user.income.push(newIncome); // Add new income to the user's income array
      await user.save(); // Save the updated user document
  
      res.status(201).json({ message: 'Income added successfully', income: newIncome });
    } catch (error) {
      console.error('Error adding income:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

export default router;
