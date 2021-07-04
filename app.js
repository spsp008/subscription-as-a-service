const express = require('express');
const app = express();
const port = 4000;
const dotenv = require('dotenv').config();
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const moment = require('moment');

const User = require('./models').User;
const Plan = require('./models').Plan;
const Subscription = require('./models').Subscription;

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

app.post('/subscription', async (req, res) => {
  const {user_name, plan_id, start_date} = req.body;
  // TODO Error handling
  const plan = await Plan.findOne({where: {plan_id}});
  const user = await User.findOne({where: {user_name}});

  if (!user || !plan) {
    return res.status(400).send({status: 'FAILURE', message: "User or Plan not valid"});
  }
  // TODO Error handling
  // Validate date
  const formattedDate = moment(start_date, 'YYYY-MM-DD', true);
  if (!formattedDate.isValid()) {
    return res.status(400).send({status: 'FAILURE', message: "Date not valid"});
  }

  const validTill = plan.validity > -1 ? formattedDate.clone().add(plan.validity, 'days') : null;
  return Subscription
    .create({
      user_name,
      plan_id,
      start_date: formattedDate,
      valid_till: validTill
    })
    .then(subscription => res.status(201).send({
      status: 'SUCCESS',
      amount: (-1 * plan.cost).toFixed(1)
    }))
    .catch(error => res.status(400).send({status: 'FAILURE', message: error.message}));
});

app.get('/subscription/:user_name/:date', async (req, res) => {
  const {user_name, date} = req.params;
  if (date && user_name) {
    const startDate = moment(date, 'YYYY-MM-DD', true);
    if (!startDate.isValid()) {
      return res.status(400).send({status: 'FAILURE', message: "Specified date is not valid"});
    }
    const subscription = await Subscription.findOne({where: {user_name, [Op.or]: [
      {
        valid_till: {
          [Op.gte]: startDate
        },
      },
      {
        valid_till: {
         [Op.eq]: null
        }
      },
    ]}});
    const {plan_id, valid_till} = subscription;
    const diff = moment(valid_till).clone().diff(startDate, 'days');
    const obj = {
      plan_id,
      days_left: diff
    };
    res.status(200).send(obj);
  } else {
    // TODO
  }
});

app.get('/subscription/:user_name', async (req, res) => {
  const {user_name} = req.params;
  if (user_name) {
    const subscriptions = await Subscription.findAll({where: {user_name}, attributes: ['plan_id', 'start_date', 'valid_till']});
    res.status(200).send(subscriptions);
  } else {
    // TODO
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
