
# Subscription as a Service

Subscription as a Service is plan subscription app. It is an API based solution to create subscription for the users based on a plan.

## Environment
- NodeJs [v13+](https://nodejs.org/en/download/)
## Packages used
- Express [v4.17.1](https://www.npmjs.com/package/express)
- Sequelize [v6.6.4](https://www.npmjs.com/package/sequelize)
- PostgreSQL [v8.6.0](https://www.npmjs.com/package/pg)
- Moment.js [v2.29.1](https://www.npmjs.com/package/moment)


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependancies. In the root folder run below command.

```bash
npm install
```

## Usage
To start app
- First create `.env` file in the root folder and set environment either of *local|dev|test|env* e.g.
```
NODE_ENV=local
```
In the config folder create *environment.config.json* file e.g. `local.config.json` and add following values according to your database. First create a DB in postgres with name say `saas`. Dev and Test config files are already added. Example values below
```
  {
    "username": "shiv",
    "password": "password",
    "database": "saas",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "port": 5432
  }
```
Then run migration and seeds respectively.
Note: Sequelize cli must be installed before running this.
```
sequelize db:create // In case db is not already created
```
```
sequelize db:migrate
```
```
sequelize db:seed:all
```
This will create **Users**, **Plans** and **Subscriptions** table in DB. **Plans** table must be filled with the data.
To run server run

```bash
npm start
```

## Assumptions
1. There is no authentication in the APIs.
2. There are no associations/relations among User, Plan and Subscription yet.
3. The `user_name` field in the **User** table will be unique.
4. User can have many subscriptions active.
5. If user has more than one active subscriptions, on calling below API

```
  GET /subscription/:user_name/:date/
```
the subscription which was active on the date and the latest will be returned.

6. If plan is unlimited then in the response of user's subscription the `days_left` value will be `'Unlimited'`
```
{ "plan_id": "FREE", "days_left": "Unlimited" }
```
7. In the below API

```
  GET /subscription/:user_name/
```
For the case of unlimited plans the `valid_till` value will be `null`. The response will be like below.

```
  [
    {
      "plan_id": "TRIAL",
      "start_date": "2020-02-22",
      "valid_till": "2020-02-28"
    },
    {
      "plan_id": "FREE",
      "start_date": "2020-02-29",
      "valid_till": null
    }
  ]

```
8. The date/time are in UTC format in all the responses.
