const User = require('../models').User;

const APP_CONSTANTS = require('../constants.js');

const getAll = async (req, res) => {
  const users = await User.findAll({
    attributes: ['user_name', ['createdAt', 'created_at']],
  });
  res.send({ users });
};

const getByName = async (req, res) => {
  const { user_name } = req.params;
  const user =  await User.findOne({
    where: { user_name },
    attributes: ['user_name', ['createdAt', 'created_at']],
  })

  if (user) {
    return res.status(200).send(user);
  }
  return res.status(404).send(APP_CONSTANTS.ERRORS.NOT_FOUND)
};

const create = (req, res) => {
  const { user_name } = req.params;
  return User.create({
    user_name,
  })
    .then((user) => res.sendStatus(200))
    .catch((error) => res.status(400).send(error));
};

module.exports = {
  getByName,
  create,
  getAll,
};
