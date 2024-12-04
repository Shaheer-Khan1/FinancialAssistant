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
  console.log(req.body);
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

  // Update income
router.put('/incomes', async (req, res) => {
  const { email, amount, source, oldAmount, oldSource, oldDate } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the income that needs to be updated
    const incomeToUpdate = user.income.find(
      (income) =>
        income.amount === oldAmount &&
        income.source === oldSource &&
        income.date.toString() === new Date(oldDate).toString()
    );

    if (!incomeToUpdate) return res.status(404).json({ message: 'Income not found' });

    // Update the income
    incomeToUpdate.amount = amount;
    incomeToUpdate.source = source;

    await user.save();

    res.status(200).json({ message: 'Income updated successfully', income: incomeToUpdate });
  } catch (error) {
    console.error('Error updating income:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete income
router.delete('/incomes', async (req, res) => {
  const { email, amount, source, date } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the income to delete
    const incomeIndex = user.income.findIndex(
      (income) =>
        income.amount === amount &&
        income.source === source &&
        income.date.toString() === new Date(date).toString()
    );

    if (incomeIndex === -1) return res.status(404).json({ message: 'Income not found' });

    // Remove the income
    user.income.splice(incomeIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

  
  router.post('/crypto', async (req, res) => {
    const { email, coinName, amount } = req.body;  // Expecting email from the frontend
    
    // Validate input
    if (!email || !coinName || !amount) {
      return res.status(400).json({ error: 'Email, coin name, and amount are required' });
    }
    console.log(req.body);
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the coin already exists in the user's cryptoBalance
      const existingCoinIndex = user.cryptoBalance.findIndex(
        (crypto) => crypto.coinName === coinName
      );
  
      if (existingCoinIndex > -1) {
        // Coin already exists, so we update the amount
        user.cryptoBalance[existingCoinIndex].amount += amount;
      } else {
        // Coin does not exist, add a new entry for the coin
        user.cryptoBalance.push({ coinName, amount });
      }
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: 'Crypto data saved successfully' });
    } catch (error) {
      console.error('Error saving crypto data:', error);
      res.status(500).json({ error: 'Failed to save crypto data' });
    }
  });

  router.post('/crypto/holdings', async (req, res) => {
    const { email } = req.body; // Get the email from the request body
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      // Fetch the user document by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Access the cryptoBalance field of the user
      const holdings = user.cryptoBalance;
  
      // Return the user's crypto holdings
      res.json({ holdings });
    } catch (error) {
      console.error('Error fetching holdings:', error);
      res.status(500).json({ message: 'Error fetching holdings' });
    }
  });

  router.post('/expenses', async (req, res) => {
    const { email, date, amount, description } = req.body;
  
    if (!email || !date || !amount || !description) {
      return res.status(400).json({ message: 'Email, date, amount, and description are required.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      user.expenses.push({ date, amount, description });
      await user.save();
  
      res.status(201).json({ message: 'Expense added successfully.', expenses: user.expenses });
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  });
  router.get('/expenses', async (req, res) => {
    const { email } = req.query; // Get email from query parameters
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({ expenses: user.expenses });
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  });

  // Delete an expense
router.delete('/expenses', async (req, res) => {
  const { email, date, amount, description } = req.body;

  if (!email || !date || !amount || !description) {
    return res.status(400).json({ message: 'Email, date, amount, and description are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Remove the expense that matches date, amount, and description
    user.expenses = user.expenses.filter(expense =>
      !(expense.date === date && expense.amount === amount && expense.description === description)
    );
    await user.save();

    res.status(200).json({ message: 'Expense deleted successfully.', expenses: user.expenses });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});


router.put('/expenses', async (req, res) => {
  console.log(req.body);
  const { email, oldDate, oldAmount, oldDescription, newDate, newAmount, newDescription } = req.body;

  if (!email || !oldDate || !oldAmount || !oldDescription || !newDate || !newAmount || !newDescription) {
    return res.status(400).json({ message: 'Email, oldDate, oldAmount, oldDescription, newDate, newAmount, and newDescription are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const expense = user.expenses.find(
      exp => exp.date === oldDate && exp.amount === oldAmount && exp.description === oldDescription
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    // Update the expense's date, amount, and description
    expense.date = newDate;
    expense.amount = newAmount;
    expense.description = newDescription;

    await user.save();

    res.status(200).json({ message: 'Expense updated successfully.', expenses: user.expenses });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});


  
  router.post('/budget', async (req, res) => {
    
    const { email, budget } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's budget and budgetDate
      user.budget.amount = budget.amount;
      user.budget.duration = budget.duration;
      user.budgetDate = budget.date; // Save the date when the budget was set
  
      // Save the user with the updated budget and budgetDate
      await user.save();
      res.status(200).json({ message: 'Budget saved successfully', user });
    } catch (error) {
      console.error('Error saving budget:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  router.get('/highest-budget', async (req, res) => {
    try {
      // Aggregation pipeline to group by duration and get the highest budget
      const result = await User.aggregate([
        {
          $group: {
            _id: "$budget.duration",  // Group by duration
            highestBudget: { $max: "$budget.amount" }  // Get the highest budget for each duration
          }
        },
        {
          $project: {
            _id: 0,  // Hide the internal '_id' field
            duration: "$_id",  // Rename '_id' to 'duration'
            highestBudget: 1  // Include the highest budget field
          }
        }
      ]);
  
      // Send the result back as a response
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching highest budget:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Backend route to delete the budget
  router.delete('/budget', async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  try {
    // Assuming you have a Budget model to interact with your database
    await Budget.deleteOne({ email }); // Delete the user's existing budget
    res.status(200).send({ message: 'Previous budget deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting budget' });
  }
  });

  router.get('/budget-remaining', async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Get the date when the budget was added
      const budgetDate = user.budgetDate;
  
      if (!budgetDate) {
        return res.status(400).json({ message: 'Budget date not found for the user.' });
      }
  
      // Calculate the total expenses since the budget date
      const totalExpenses = user.expenses.reduce((total, expense) => {
        if (new Date(expense.date) >= new Date(budgetDate)) {
          return total + expense.amount;  // Only sum the expenses after the budget was added
        }
        return total;
      }, 0);
  
      // Calculate the remaining budget
      const remainingBudget = user.budget.amount - totalExpenses;
  
      res.status(200).json({
        remainingBudget,
        totalExpenses,
        budget: user.budget.amount,
        message: 'Remaining budget calculated successfully.',
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  });
  

  // POST route to save user savings
router.post('/savings', async (req, res) => {
  console.log('Received data:', req.body); // Debugging purpose
  const { email, amount, description, date } = req.body;

  // Validate request body
  if (!email || !amount || !description) {
    return res.status(400).json({ message: 'Please provide email, amount, and description' });
  }

  if (isNaN(amount)) {
    return res.status(400).json({ message: 'Amount must be a valid number' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Push the new savings entry into the savings array
    user.savings.push({
      amount,
      description,
      date: date ? new Date(date) : new Date(), // Use the provided date or the current date
    });

    await user.save();

    res.status(200).json({ message: 'Savings saved successfully!' });
  } catch (error) {
    console.error('Error saving savings:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Update savings entry based on email, amount, and description
router.put('/savings', async (req, res) => {
  const { email, oldAmount, oldDescription, oldDate, amount, description, date } = req.body;

  if (!email || !oldAmount || !oldDescription || !oldDate || !amount || !description) {
    return res.status(400).json({ message: 'Please provide email, old amount, old description, old date, new amount, new description' });
  }

  if (isNaN(amount) || isNaN(oldAmount)) {
    return res.status(400).json({ message: 'Amount must be a valid number' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the savings entry to update using old values (oldAmount, oldDescription, oldDate)
    const saving = user.savings.find(s => 
      s.amount === oldAmount &&
      s.description === oldDescription &&
      new Date(s.date).toLocaleDateString() === new Date(oldDate).toLocaleDateString() // Match old date as well
    );

    if (!saving) {
      return res.status(404).json({ message: 'Matching savings entry not found' });
    }

    // Update the found entry with the new values
    saving.amount = amount;
    saving.description = description;
    saving.date = date ? new Date(date) : new Date(); // Use the provided date or the current date

    await user.save();

    res.status(200).json({ message: 'Savings updated successfully!' });
  } catch (error) {
    console.error('Error updating savings:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// Delete savings entry based on email, amount, and description
router.delete('/savings', async (req, res) => {
  const { email, amount, description } = req.body;

  if (!email || !amount || !description) {
    return res.status(400).json({ message: 'Please provide email, amount, and description' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the savings entry to delete
    const index = user.savings.findIndex(s => s.amount === amount && s.description === description);

    if (index === -1) {
      return res.status(404).json({ message: 'Matching savings entry not found' });
    }

    // Remove the savings entry from the array
    user.savings.splice(index, 1);

    await user.save();

    res.status(200).json({ message: 'Savings deleted successfully!' });
  } catch (error) {
    console.error('Error deleting savings:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});



// GET route to retrieve user savings
router.get('/savings/:email', async (req, res) => {
  console.log(req.params); // Logs the request parameters (email)
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.savings) {
      return res.status(404).json({ message: 'No savings found for this user' });
    }

    // Log the savings data before sending it back
    console.log('User Savings:', user.savings);

    res.status(200).json({ savings: user.savings });
  } catch (error) {
    console.error('Error retrieving savings:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// Add a debt
router.post('/debts', async (req, res) => {

  console.log(req.body);
  const { email, description, amount, date, type } = req.body;

  if (!email || !description || !amount || !date || !type) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const newDebt = {
      description,
      amount,
      date,
      type,
    };

    user.debts.push(newDebt);
    await user.save();

    res.status(200).json({ message: 'Debt added successfully.', debt: newDebt });
  } catch (error) {
    console.error('Error adding debt:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST route to get debts for a user
router.post('/showdebts', async (req, res) => {
  const { email } = req.body; // Email will now come from the body

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ debts: user.debts });
  } catch (error) {
    console.error('Error fetching debts:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.delete('/debts', async (req, res) => {
  const { description, amount, date, type } = req.body;  // Receive debt details from frontend

  try {
    // Find the user by email and remove the debt by matching description, amount, date, and type
    const user = await User.findOneAndUpdate(
      { 'debts.description': description, 'debts.amount': amount, 'debts.date': date, 'debts.type': type },
      { $pull: { debts: { description, amount, date, type } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Debt not found.' });
    }

    res.status(200).json({ message: 'Debt successfully deleted.' });
  } catch (error) {
    console.error('Error deleting debt:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});




  
  

export default router;
