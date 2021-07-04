const express = require('express');
const app = express();
const port = 4000;
const dotenv = require('dotenv').config();
const routes = require('./routes');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

app.listen(port, () => {
  console.log(
    `SaaS app listening at ${port} in ${process.env.NODE_ENV} environment!`
  );
});
