import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  },
}
console.log(process.env.REACT_APP_API_URL);