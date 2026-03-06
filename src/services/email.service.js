const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((e, s) => {
  if (e) {
    console.log("Error connecting to Email server ", e);
  } else {
    console.log("Email server is ready to send emails");
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `Pocketly Wallet <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("mail sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (e) {
    console.error("Error sending mail: ", e);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Pocketly Wallet!";
  const text = `Hello ${name}, \n\n Thank you for registering with Pocketly Wallet!\n
We’re excited to have you on board. Your digital wallet is now ready to make managing money simple, secure, and stress-free.\n
We’re glad you chose Pocketly. Let’s make every transaction effortless!\n Team Pocketly`;

  const html = `<p>Hello ${name}</p> <p>Thank you for registering with <strong>Pocketly Wallet</strong>!</p> <p>We’re excited to have you on board. Your digital wallet is now ready to make managing money simple, secure, and stress-free.</p> <p>We’re glad you chose Pocketly. Let’s make every transaction effortless!</p> <p>Team Pocketly</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(
  userEmail,
  name,
  amount,
  fromAccount,
  toAccount,
) {
  const subject = "Transaction Alert from Pocketly Wallet";
  const text = `Hello ${name}, \n\n A transaction of amount ${amount} has been made from your account ${fromAccount} to account ${toAccount}.\n
If you did not authorize this transaction, please contact our support team immediately.\n Team Pocketly`;

  const html = `<p>Hello ${name}</p> <p>A transaction of amount <strong>${amount}</strong> has been made from your account <strong>${fromAccount}</strong> to account <strong>${toAccount}</strong>.</p> <p>If you did not authorize this transaction, please contact our support team immediately.</p> <p>Team Pocketly</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function failedTransactionEmail(
  userEmail,
  name,
  amount,
  fromAccount,
  toAccount,
) {
  const subject = "Failed Transaction Alert from Pocketly Wallet";
  const text = `Hello ${name}, \n\n A transaction of amount ${amount} from your account ${fromAccount} to account ${toAccount} has failed.\n
Please check your account balance and try again.\n Team Pocketly`;

  const html = `<p>Hello ${name}</p> <p>A transaction of amount <strong>${amount}</strong> from your account <strong>${fromAccount}</strong> to account <strong>${toAccount}</strong> has failed.</p> <p>Please check your account balance and try again.</p> <p>Team Pocketly</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  failedTransactionEmail,
};
