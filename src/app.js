const express = require("express");
const authRouter = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const accountRouter = require("./routes/account.route");
const transactionRouter = require("./routes/transaction.route");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pocketly is Live now");
});

app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);

module.exports = app;
