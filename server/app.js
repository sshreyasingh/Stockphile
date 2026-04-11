const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const connectToDB = require("./config/db");
const cookieParser = require("cookie-parser");

connectToDB();

/* VIEW ENGINE */

app.set("view engine", "ejs");

app.set(
  "views",
  path.join(__dirname, "views")
);

/* MIDDLEWARE */

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* STATIC FILES */

const staticPath =
  path.join(__dirname, "../client");

app.use(express.static(staticPath));

/* ROUTERS */

const indexRouter =
  require("./routes/index.routes");

const userRouter =
  require("./routes/user.routes");

const uploadRouter =
  require("./upload");

/* ROUTES */

app.use("/", indexRouter);

app.use("/user", userRouter);

app.use("/", uploadRouter);

/* REACT FALLBACK (VERY IMPORTANT) */

app.get("*", (req, res) => {
  res.sendFile(
    path.join(staticPath, "index.html")
  );
});

module.exports = app;