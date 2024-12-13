import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  savings: [{
    amount: { type: Number, default: 0 },  
    description: { type: String, default: '' },  
    date: { type: Date, default: Date.now }  
  }],
  
  
  expenses: { type: [Object], default: [] },  
  budget: {
    amount: { type: Number, default: 0 },  
    duration: { type: String, default: '1 month' },  
  },
  budgetDate: Date, 
  cryptoBalance: [
    {
      coinName: { type: String, required: true }, 
      amount: { type: Number, default: 0 }, 
    },
  ],
  debts: [
    {
      description: { type: String, default: '' },  
      amount: { type: Number, required: true },  
      date: { type: Date, default: Date.now },  
      type: { type: String, enum: ['Taken', 'Lended'], required: true },  // Debt type: Taken or Lended
    }
  ],
  subscriptions: { type: [Object], default: [] },  // List of subscriptions 
  
  income: [{
    amount: { type: Number  },  // Income amount
    source: { type: String},  // Source of income 
    date: { type: Date, default: Date.now },  // Date when the income was received
  }],
  
  profilePicture: { type: String, default: '' },  // URL for profile picture
  
  isActive: { type: Boolean, default: true },  // Whether the user account is active
  
  createdAt: { type: Date, default: Date.now },  // Account creation date
  updatedAt: { type: Date, default: Date.now },  // Last updated date
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});



export default mongoose.model('User', userSchema);
