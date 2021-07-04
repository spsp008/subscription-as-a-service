const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();

const User = require('../models').User;

router.get('/', async (req, res) => {
  const users = await User.findAll({attributes: ['user_name', ['createdAt', 'created_at']]});
  res.send({users});
});

router.get('/:user_name', (req, res) => {
  const {user_name} = req.params;
  return User.findOne({
    where: {user_name},
    attributes: [
      'user_name',
      ['createdAt', 'created_at']
    ]
  })
  .then(user => res.status(200).send(user))
  .catch(error => res.status(404).send(error));
});

router.put('/:user_name', (req, res) => {
  const {user_name} = req.params;
  return User
    .create({
      user_name
    })
    .then(user => res.sendStatus(200))
    .catch(error => res.status(400).send(error));
});

module.exports = router;
