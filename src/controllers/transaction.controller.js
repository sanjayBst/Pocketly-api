const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");
const emailService = require("../services/email.service");

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "FromAccount, ToAccount, Amount and IdempotencyKey are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "fromUserAccount or toUserAccount is missing",
    });
  }

  const isTransactionExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionExists) {
    if (isTransactionExists.status === "COMPLETE") {
      return res.status(200).json({
        message: "Transaction completed successfully",
      });
    } else if (isTransactionExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is Pending! Please wait.",
      });
    } else if (isTransactionExists.status === "FAILED") {
      return res.status(500).json({
        message: "Oops! Transaction failed, Try again",
      });
    } else if (isTransactionExists.status === "REVERSED") {
      return res.status(500).json({
        message: "Transction was Reversed to source account",
      });
    }
  }

  if (fromUserAccount !== "ACTIVE" || toUserAccount !== "ACTIVE") {
    return res.status(400).json({
      message: "Both account mustbe ACTIVE to process a transaction ",
    });
  }

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: "Insufficient Funds",
    });
  }
}
