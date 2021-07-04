const express = require('express');
const router = express.Router();

const {
  getAll,
  getByName,
  create,
} = require('../controllers/users.controller.js');

router.get('/', getAll);

router.get('/:user_name', getByName);

router.put('/:user_name', create);

module.exports = router;
