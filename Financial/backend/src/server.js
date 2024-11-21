import app from './app.js';
import cors from 'cors';


// Enable CORS for all routes
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
