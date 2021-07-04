const express = require('express');
const router = express.Router();

const {
  create,
  getByUserAndDate,
  getAllForUser,
} = require('../controllers/subscriptions.controller');

router.post('/', create);

router.get('/:user_name/:date', getByUserAndDate);

router.get('/:user_name', getAllForUser);

module.exports = router;
