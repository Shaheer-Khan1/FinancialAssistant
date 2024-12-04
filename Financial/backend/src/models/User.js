import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  savings: [{
    amount: { type: Number, default: 0 },  // User savings amount
    description: { type: String, default: '' },  // Description of savings
    date: { type: Date, default: Date.now }  // Date of savings entry
  }],
  
  
  expenses: { type: [Object], default: [] },  // List of expenses (could include date, amount, description)
  budget: {
    amount: { type: Number, default: 0 },  // Amount of the budget
    duration: { type: String, default: '1 month' },  // Duration of the budget (e.g., '1 month', '1 year')
  },
  budgetDate: Date, // Add this field to track the date when the budget was added
  cryptoBalance: [
    {
      coinName: { type: String, required: true }, // Coin name (e.g., Bitcoin, Ethereum)
      amount: { type: Number, default: 0 }, // Amount of the coin
    },
  ],
  debts: [
    {
      description: { type: String, default: '' },  // Description of the debt
      amount: { type: Number, required: true },  // Amount of the debt
      date: { type: Date, default: Date.now },  // Date of the debt
      type: { type: String, enum: ['Taken', 'Lended'], required: true },  // Debt type: Taken or Lended
    }
  ],
  subscriptions: { type: [Object], default: [] },  // List of subscriptions (could include name, amount, frequency)
  
  income: [{
    amount: { type: Number  },  // Income amount
    source: { type: String},  // Source of income (e.g., job, investment, etc.)
    date: { type: Date, default: Date.now },  // Date when the income was received
  }],
  
  profilePicture: { type: String, default: '' },  // URL for profile picture
  
  isActive: { type: Boolean, default: true },  // Whether the user account is active
  
  createdAt: { type: Date, default: Date.now },  // Account creation date
  updatedAt: { type: Date, default: Date.now },  // Last updated date
});

// Update `updatedAt` field whenever the user document is modified
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});



export default mongoose.model('User', userSchema);
