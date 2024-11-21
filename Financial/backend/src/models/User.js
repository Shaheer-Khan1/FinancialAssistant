import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // New fields
  savings: { type: Number, default: 0 },  // User savings
  expenses: { type: [Object], default: [] },  // List of expenses (could include date, amount, description)
  budget: { type: Number, default: 0 },  // User's set budget
  crypto_balance: { type: Number, default: 0 },  // Crypto balance for crypto dashboard
  debts: { type: [Object], default: [] },  // List of debts (could include amount, creditor, due date)
  subscriptions: { type: [Object], default: [] },  // List of subscriptions (could include name, amount, frequency)
  
  income: [{
    amount: { type: Number, required: true },  // Income amount
    source: { type: String, required: true },  // Source of income (e.g., job, investment, etc.)
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
