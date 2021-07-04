const { Op } = require('sequelize');
const moment = require('moment');

const Models = require('../models');
const User = Models.User;
const Plan = Models.Plan;
const Subscription = Models.Subscription;
const { sequelize } = Models;

const APP_CONSTANTS = require('../constants.js');
const USER_ERRORS = APP_CONSTANTS.USER.ERRORS;
const PLAN_ERRORS = APP_CONSTANTS.PLAN.ERRORS;

const create = async (req, res) => {
  // Validations
  const { user_name, plan_id, start_date } = req.body;

  const plan = await Plan.findOne({ where: { plan_id } });
  if (!plan) {
    return res.status(400).send({
      status: APP_CONSTANTS.STATUS.FAILURE,
      message: PLAN_ERRORS.INVALID,
    });
  }

  const user = await User.findOne({ where: { user_name } });
  if (!user) {
    return res.status(400).send({
      status: APP_CONSTANTS.STATUS.FAILURE,
      message: USER_ERRORS.INVALID,
    });
  }

  const formattedDate = moment(start_date, APP_CONSTANTS.REQ_DATE_FORMAT, true);
  if (!formattedDate.isValid()) {
    return res.status(400).send({
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
        .status(500)
        .send({
          status: APP_CONSTANTS.STATUS.FAILURE,
          message: APP_CONSTANTS.ERRORS.SOMETHING_WENT_WRONG,
        })
    );
};

const getByUserAndDate = async (req, res) => {
  const { user_name, date } = req.params;
  if (date && user_name) {
    // Validation
    const startDate = moment(date, APP_CONSTANTS.REQ_DATE_FORMAT, true);
    if (!startDate.isValid()) {
      return res.status(400).send({
        status: APP_CONSTANTS.STATUS.FAILURE,
        message: APP_CONSTANTS.ERRORS.INVALID_DATE,
      });
    }
    try {
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
        order: [
          ['createdAt', 'DESC'],
        ],
      });
      if (!subscription) {
        return res.status(404).send({
          status: APP_CONSTANTS.STATUS.FAILURE,
          message: APP_CONSTANTS.ERRORS.NOT_FOUND,
        });
      }
      const { plan_id, valid_till } = subscription;
      const diff = valid_till
        ? moment(valid_till).clone().diff(startDate, 'days')
        : APP_CONSTANTS.PLAN.UNLIMITED;
      const obj = {
        plan_id,
        days_left: diff,
      };
      return res.status(200).send(obj);
    } catch (err) {
      return res.status(500).send(APP_CONSTANTS.ERRORS.SOMETHING_WENT_WRONG);
    }
  } else {
    return res.sendStatus(400);
  }
};

const getAllForUser = async (req, res) => {
  const { user_name } = req.params;
  if (user_name) {
    try {
      const subscriptions = await Subscription.findAll({
        where: { user_name },
        attributes: [
          'plan_id',
          [
            sequelize.fn(
              'to_char',
              sequelize.col('start_date'),
              APP_CONSTANTS.SUBSCRIPTION.RES_DATE_FORMAT
            ),
            'start_date',
          ],
          [
            sequelize.fn(
              'to_char',
              sequelize.col('valid_till'),
              APP_CONSTANTS.SUBSCRIPTION.RES_DATE_FORMAT
            ),
            'valid_till',
          ],
        ],
        order: [
          ['createdAt', 'DESC'],
        ],
      });
      if (!subscriptions) {
        return res.status(404).send({
          status: APP_CONSTANTS.STATUS.FAILURE,
          message: APP_CONSTANTS.ERRORS.NOT_FOUND,
        });
      }
      return res.status(200).send(subscriptions);
    } catch (err) {
      return res.status(500).send(APP_CONSTANTS.ERRORS.SOMETHING_WENT_WRONG);
    }
  } else {
    return res.sendStatus(400);
  }
};

module.exports = {
  create,
  getByUserAndDate,
  getAllForUser,
};
