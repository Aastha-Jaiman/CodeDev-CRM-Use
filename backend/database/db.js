const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async (URL) => {
  try {
    console.log("URL", URL);
    const DB = await mongoose.connect(`${URL}`);
    console.log(`DataBase Connected: ${DB.connection.host}`.bgBlue.black);
  } catch (err) {
    console.log(`DataBase occur error {\n${err}\n}`.bgRed.black);
  }
};

module.exports = connectDB;
