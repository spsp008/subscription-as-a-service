const express = require('express');
const app = express();
const port = 4000;
const dotenv = require('dotenv').config();
const Sequelize = require('sequelize');

const User = require('./models').User;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!' + process.env.NODE_ENV)
});

app.get('/user', async (req, res) => {
  const users = await User.findAll({attributes: ['user_name', ['createdAt', 'created_at']]});
  res.send({users});
});

app.get('/user/:user_name', (req, res) => {
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

app.put('/user/:user_name', (req, res) => {
  const {user_name} = req.params;
  return User
    .create({
      user_name
    })
    .then(user => res.sendStatus(200))
    .catch(error => res.status(400).send(error));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
