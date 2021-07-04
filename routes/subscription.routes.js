const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const { Op } = require('sequelize');
const moment = require('moment');

const User = require('../models').User;
const Plan = require('../models').Plan;
const Subscription = require('../models').Subscription;

router.post('/', async (req, res) => {
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

router.get('/:user_name/:date', async (req, res) => {
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
    if (!subscription) {
      return res.status(400).send({status: 'FAILURE', message: "No valid subscription"});
    }
    const {plan_id, valid_till} = subscription;
    const diff = moment(valid_till).clone().diff(startDate, 'days');
    const obj = {
      plan_id,
      days_left: diff
    };
    res.status(200).send(obj);
  } else {
    return res.sendStatus(400);
  }
});

router.get('/:user_name', async (req, res) => {
  const {user_name} = req.params;
  if (user_name) {
    const subscriptions = await Subscription.findAll({where: {user_name}, attributes: ['plan_id', 'start_date', 'valid_till']});
    res.status(200).send(subscriptions);
  } else {
    return res.sendStatus(400);
  }
});

module.exports = router;
