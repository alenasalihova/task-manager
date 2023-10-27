const express = require("express");
const tasksRouter = require("./router/tasksRouter");
const app = express();
//require .env
require('dotenv').config();
const PORT = process.env.PORT;
app.use(express.static("public"));
app.use(express.json());
app.use(tasksRouter);
app.listen(PORT);
