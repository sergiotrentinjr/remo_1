require("dotenv").config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();


app.use(cors({
  origin: '*'
}));


app.use(express.json({ extended: false }));
app.use(routes);


app.listen(process.env.PORT || 3333);