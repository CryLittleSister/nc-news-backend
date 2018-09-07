const express = require("express");
const mongoose = require("mongoose");
const { DB_URL } =
  process.env.NODE_ENV === "production" ? process.env : require("./config");
const apiRouter = require("./routes/apiRouter");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");

mongoose.connect(DB_URL).then(console.log(`connected to the ${DB_URL}`));

app.use("/api", apiRouter);
app.use("/*", (req, res) =>
  res.status(404).send({ message: "ERROR! PAGE NOT FOUND" })
);

app.use((err, req, res, next) => {
  err.name === "CastError"
    ? res
        .status(400)
        .send({ message: "invalid ID. please input with the correct format" })
    : res.status(err.status || 500).send(err);
});

module.exports = app;
