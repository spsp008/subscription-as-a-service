'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Plans', [
      {
        plan_id: 'FREE',
        validity: -1,
        cost: 0.0,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        plan_id: 'TRIAL',
        validity: 7,
        cost: 0.0,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        plan_id: 'LITE_1M',
        validity: 30,
        cost: 100.0,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        plan_id: 'PRO_1M',
        validity: 30,
        cost: 200.0,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        plan_id: 'LITE_6M',
        validity: 180,
        cost: 500.0,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        plan_id: 'PRO_6M',
        validity: 180,
        cost: 900.0,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Plans', null, {});
  }
};
