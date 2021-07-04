const APP_CONSTANTS = {
  REQ_DATE_FORMAT: 'YYYY-MM-DD',
  USER: {
    RES_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    ERRORS: Object.freeze({
      INVALID: 'Invalid user.',
      CREATE: 'Unable to create user.',
      GET: 'Unable to get user(s)'
    })
  },
  SUBSCRIPTION: {
    ERRORS: Object.freeze({
      INVALID: 'Invalid subscription.',
      CREATE: 'Unable to create subscription.',
      GET: 'Unable to get subscription(s)'
    })
  },
  PLAN: {
    ERRORS: Object.freeze({
      INVALID: 'Invalid plan.'
    })
  },
  ERRORS: Object.freeze({
    INVALID_DATE: 'Invalid date.',
    NOT_FOUND: 'Not found.'
  }),
  STATUS: Object.freeze({
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE'
  })
};

module.exports = Object.freeze(APP_CONSTANTS);
