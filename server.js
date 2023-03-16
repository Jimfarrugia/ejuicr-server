const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const { errorHandler } = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./auth/googleAuth")(passport);
require("./auth/twitterAuth")(passport);

app.use(morgan("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/recipes", require("./routes/recipes"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/user", require("./routes/user"));
app.use("/auth", require("./routes/auth"));

app.use(errorHandler);

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
});
