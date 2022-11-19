const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookie = require("cookie-parser");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
  })
);

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/", (req, res) => {
  res.send("Success Fully Working");
});

// Middle Ware for Error
app.use(errorMiddleware);

module.exports = app;
