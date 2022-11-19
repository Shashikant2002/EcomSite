const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/dataBase");
const cors = require("cors");
const cloudinary = require("cloudinary");

app.use(cors());

// handeling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting Down the Server Due to uncaughtException`);
  process.exit(1);
});

// config
dotenv.config({ path: "config/config.env" });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Connecting To Data Base
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Port Listening on http://localhost:${process.env.PORT}`);
});

// unHandeled promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting Down the Server Due to unhandled promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
