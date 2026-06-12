dotenv.config();

import app from './app.js';
import dotenv from 'dotenv';


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});