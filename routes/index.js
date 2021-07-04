const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();

const userRoutes = require('./user.routes.js');
const subscriptionRoutes = require('./subscription.routes.js');

router.get('/', (req, res) => {
  res.send('Hello World!' + process.env.NODE_ENV)
});

router.use('/user', userRoutes);
router.use('/subscription', subscriptionRoutes);

module.exports = router;
