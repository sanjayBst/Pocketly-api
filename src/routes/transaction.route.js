const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middlewares");
const transactionController = require("../controllers/transaction.controller");

const transactionRoutes = Router();

transactionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);
transactionRoutes.post(
  "/system/initial-funds",
  authMiddleware.authSystemUser,
  transactionController.createInitialFundsTransaction,
);

module.exports = transactionRoutes;
