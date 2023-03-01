const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const passport = require("passport");
const { errorHandler } = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(passport.initialize());
require("./auth/googleAuth")(passport);

app.use(morgan("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/recipes", require("./routes/recipes"));
app.use("/api/user", require("./routes/user"));
app.use("/auth", require("./routes/auth"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
