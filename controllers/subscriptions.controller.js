const { Op } = require('sequelize');
const moment = require('moment');

const User = require('../models').User;
const Plan = require('../models').Plan;
const Subscription = require('../models').Subscription;

const APP_CONSTANTS = require('../constants.js');
const USER_ERRORS = APP_CONSTANTS.USER.ERRORS;
const PLAN_ERRORS = APP_CONSTANTS.PLAN.ERRORS;

const create = async (req, res) => {
  // Validations
  const { user_name, plan_id, start_date } = req.body;

  const plan = await Plan.findOne({ where: { plan_id } });
  if (!plan) {
    return res
      .status(400)
      .send({
        status: APP_CONSTANTS.STATUS.FAILURE,
        message: PLAN_ERRORS.INVALID,
      });
  }

  const user = await User.findOne({ where: { user_name } });
  if (!user) {
    return res
      .status(400)
      .send({
        status: APP_CONSTANTS.STATUS.FAILURE,
        message: USER_ERRORS.INVALID,
      });
  }

  const formattedDate = moment(start_date, APP_CONSTANTS.REQ_DATE_FORMAT, true);
  if (!formattedDate.isValid()) {
    return res
      .status(400)
      .send({
        status: APP_CONSTANTS.STATUS.FAILURE,
        message: APP_CONSTANTS.ERRORS.INVALID_DATE,
      });
  }

  const validTill =
    plan.validity > -1
      ? formattedDate.clone().add(plan.validity, 'days')
      : null;
  return Subscription.create({
    user_name,
    plan_id,
    start_date: formattedDate,
    valid_till: validTill,
  })
    .then((subscription) =>
      res.status(201).send({
        status: APP_CONSTANTS.STATUS.SUCCESS,
        amount: (-1 * plan.cost).toFixed(1),
      })
    )
    .catch((error) =>
      res
        .status(400)
        .send({ status: APP_CONSTANTS.STATUS.FAILURE, message: error.message })
    );
};

const getByUserAndDate = async (req, res) => {
  const { user_name, date } = req.params;
  if (date && user_name) {
    // Validation
    const startDate = moment(date, APP_CONSTANTS.REQ_DATE_FORMAT, true);
    if (!startDate.isValid()) {
      return res
        .status(400)
        .send({
          status: APP_CONSTANTS.STATUS.FAILURE,
          message: APP_CONSTANTS.ERRORS.INVALID_DATE,
        });
    }
    const subscription = await Subscription.findOne({
      where: {
        user_name,
        [Op.or]: [
          {
            valid_till: {
              [Op.gte]: startDate,
            },
          },
          {
            valid_till: {
              [Op.eq]: null,
            },
          },
        ],
      },
    });
    if (!subscription) {
      return res
        .status(400)
        .send({
          status: APP_CONSTANTS.STATUS.FAILURE,
          message: APP_CONSTANTS.ERRORS.NOT_FOUND,
        });
    }
    const { plan_id, valid_till } = subscription;
    const diff = moment(valid_till).clone().diff(startDate, 'days');
    const obj = {
      plan_id,
      days_left: diff,
    };
    res.status(200).send(obj);
  } else {
    return res.sendStatus(400);
  }
};

const getAllForUser = async (req, res) => {
  const { user_name } = req.params;
  if (user_name) {
    const subscriptions = await Subscription.findAll({
      where: { user_name },
      attributes: ['plan_id', 'start_date', 'valid_till'],
    });
    res.status(200).send(subscriptions);
  } else {
    return res.sendStatus(400);
  }
};

module.exports = {
  create,
  getByUserAndDate,
  getAllForUser,
};
