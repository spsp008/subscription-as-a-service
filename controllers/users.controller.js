const Models = require('../models');
const User = Models.User;
const { sequelize } = Models;
const APP_CONSTANTS = require('../constants.js');
const USER_CONSTANTS = APP_CONSTANTS.USER;

const getAll = async (req, res) => {
  return User.findAll({
    attributes: [
      'user_name',
      [
        sequelize.fn(
          'to_char',
          sequelize.col('createdAt'),
          USER_CONSTANTS.RES_DATE_FORMAT
        ),
        'created_at',
      ],
    ],
  })
    .then((users) => res.status(200).send({ users }))
    .catch((error) => res.status(500).send(APP_CONSTANTS.ERRORS.SOMETHING_WENT_WRONG));
};

const getByName = async (req, res) => {
  const { user_name } = req.params;
  try {
    const user = await User.findOne({
      where: { user_name },
      attributes: [
        'user_name',
        [
          sequelize.fn(
            'to_char',
            sequelize.col('createdAt'),
            USER_CONSTANTS.RES_DATE_FORMAT
          ),
          'created_at',
        ],
      ],
    });

    if (user) {
      return res.status(200).send(user);
    }
    return res.status(404).send(APP_CONSTANTS.ERRORS.NOT_FOUND);
  } catch (err) {
    return res.status(500).send(APP_CONSTANTS.ERRORS.SOMETHING_WENT_WRONG);
  }

};

const create = (req, res) => {
  const { user_name } = req.params;
  return User.create({
    user_name,
  })
    .then((user) => res.sendStatus(200))
    .catch((error) => res.status(500).send(APP_CONSTANTS.ERRORS.SOMETHING_WENT_WRONG));
};

module.exports = {
  getByName,
  create,
  getAll,
};
