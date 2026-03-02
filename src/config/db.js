const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((e) => {
      console.log("Error occured ", e);
      process.exit(1);
    });
}
module.exports = connectDB;
